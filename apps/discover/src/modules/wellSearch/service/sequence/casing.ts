import chunk from 'lodash/chunk';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import max from 'lodash/max';
import min from 'lodash/min';
import uniqueId from 'lodash/uniqueId';

import { Metrics } from '@cognite/metrics';
import { Sequence, SequenceColumn, SequenceFilter } from '@cognite/sdk';
import { CasingAssembly, CasingItems } from '@cognite/sdk-wells-v3';

import { getCogniteSDKClient } from '_helpers/getCogniteSDKClient';
import { LOG_WELLS_CASING_NAMESPACE } from 'constants/logging';
import {
  TimeLogStages,
  useStartTimeLogger,
  useStopTimeLogger,
} from 'hooks/useTimeLog';
import { toIdentifier } from 'modules/wellSearch/sdk/utils';
import { getWellSDKClient } from 'modules/wellSearch/sdk/v3';
import {
  WellboreAssetIdMap,
  WellboreId,
  WellboreSourceExternalIdMap,
} from 'modules/wellSearch/types';
import { filterValidCasings } from 'modules/wellSearch/utils/casings';
import { getWellboreAssetIdReverseMap } from 'modules/wellSearch/utils/common';

import { CASINGS_COLUMN_NAME_MAP, SEQUENCE_COLUMNS } from './constants';

const CHUNK_LIMIT = 100;

// refactor to use generic log fetcher.
export async function getCasingByWellboreIds(
  wellboreIds: WellboreId[],
  wellboreAssetIdMap: WellboreAssetIdMap,
  wellboreSourceExternalIdMap: WellboreSourceExternalIdMap,
  filter: SequenceFilter['filter'] = {},
  metric?: Metrics,
  enableWellSDKV3?: boolean
) {
  let networkTimer;
  if (metric) {
    networkTimer = useStartTimeLogger(
      TimeLogStages.Network,
      metric,
      LOG_WELLS_CASING_NAMESPACE
    );
  }

  const casingsData = enableWellSDKV3
    ? await fetchCasingsUsingWellsSDK(wellboreIds, wellboreSourceExternalIdMap)
    : await fetchCasingsUsingCogniteSDK(
        wellboreIds,
        wellboreAssetIdMap,
        filter
      );

  useStopTimeLogger(networkTimer, {
    noOfWellbores: wellboreIds.length,
  });

  return casingsData;
}

export const fetchCasingsUsingWellsSDK = async (
  wellboreIds: WellboreId[],
  wellboreSourceExternalIdMap: WellboreSourceExternalIdMap
) => {
  const casingItems = (await getWellSDKClient().casings.list({
    filter: { wellboreIds: wellboreIds.map(toIdentifier) },
    limit: CHUNK_LIMIT,
  })) as CasingItems;

  const sequences = mapCasingItemsToSequences(
    casingItems,
    wellboreSourceExternalIdMap
  );

  return getGroupedSequenceData(sequences, wellboreIds);
};

export const mapCasingItemsToSequences = (
  casingItems: CasingItems,
  wellboreSourceExternalIdMap: WellboreSourceExternalIdMap
) => {
  return casingItems.items.map((casingSchematic) => {
    return {
      id: Number(uniqueId()),
      columns: getCasingsColumns(casingSchematic.casingAssemblies[0]),
      assetId:
        wellboreSourceExternalIdMap[casingSchematic.wellboreAssetExternalId],
      name: casingSchematic.source.sourceName,
      externalId: casingSchematic.wellboreAssetExternalId,
      metadata: getSequenceMetadata(casingSchematic.casingAssemblies),
      createdTime: new Date(),
      lastUpdatedTime: new Date(),
    } as Sequence;
  });
};

export const getCasingsColumns = (casingAssembly: CasingAssembly) => {
  const groupedColumns = groupBy(SEQUENCE_COLUMNS, 'name');

  return Object.keys(CASINGS_COLUMN_NAME_MAP).map((columnName) => {
    const casingAssemblyKey = get(
      CASINGS_COLUMN_NAME_MAP,
      columnName
    ) as keyof CasingAssembly;
    const casingAssemblyData = casingAssembly[casingAssemblyKey];

    return {
      ...get(groupedColumns, columnName)[0],
      metadata: { unit: get(casingAssemblyData, 'unit') },
    } as SequenceColumn;
  });
};

export const getSequenceMetadata = (casingAssemblies: CasingAssembly[]) => {
  const mdBases: number[] = [];
  const mdTops: number[] = [];
  const maxOutsideDiameters: number[] = [];
  const minInsideDiameters: number[] = [];
  let casingType: string | undefined;

  casingAssemblies.forEach((casingAssembly) => {
    mdBases.push(casingAssembly.originalMeasuredDepthBase.value);
    mdTops.push(casingAssembly.originalMeasuredDepthTop.value);
    maxOutsideDiameters.push(casingAssembly.maxOutsideDiameter.value);
    minInsideDiameters.push(casingAssembly.minInsideDiameter.value);

    if (!casingType) {
      casingType = casingAssembly.type;
    }
  });

  return {
    assy_original_md_base: String(max(mdBases)),
    assy_name: casingType,
    assy_original_md_top: String(max(mdTops)),
    assy_size: String(max(maxOutsideDiameters)),
    assy_min_inside_diameter: String(min(minInsideDiameters)),
  };
};

export const fetchCasingsUsingCogniteSDK = async (
  wellboreIds: WellboreId[],
  wellboreAssetIdMap: WellboreAssetIdMap,
  filter: SequenceFilter['filter'] = {}
) => {
  const wellboreAssetIdReverseMap =
    getWellboreAssetIdReverseMap(wellboreAssetIdMap);
  const idChunkList = chunk(wellboreIds, CHUNK_LIMIT);

  const casings = Promise.all(
    idChunkList.map((wellIdChunk) =>
      getCogniteSDKClient()
        .sequences.list({
          filter: {
            assetIds: wellIdChunk.map((id) => wellboreAssetIdMap[id]),
            ...filter,
          },
        })
        .then((list) =>
          list.items.map((item) => ({
            ...item,
            assetId: wellboreAssetIdReverseMap[item.assetId as number],
          }))
        )
    )
  );

  const results = ([] as Sequence[]).concat(...(await casings));

  return getGroupedSequenceData(results, wellboreIds);
};

export const getGroupedSequenceData = (
  data: Sequence[],
  wellboreIds: WellboreId[]
) => {
  const groupedData = groupBy(data, 'assetId');
  wellboreIds.forEach((wellboreId) => {
    groupedData[wellboreId] = filterValidCasings(groupedData[wellboreId] || []);
  });
  return groupedData;
};
