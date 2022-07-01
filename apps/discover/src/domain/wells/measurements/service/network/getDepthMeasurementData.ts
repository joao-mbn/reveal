import { getWellSDKClient } from 'domain/wells/utils/authenticate';

import { fetchAllCursorsItem } from 'utils/fetchAllCursors';

import { DepthMeasurementData } from '@cognite/sdk-wells-v3';

import { GetDepthMeasurementDataProps } from '../types';

export const getDepthMeasurementData = async ({
  sequenceExternalIds,
  measurementTypes,
  unit,
  options,
}: GetDepthMeasurementDataProps) => {
  return Promise.all(
    Array.from(sequenceExternalIds).map((sequenceExternalId) => {
      return fetchAllCursorsItem<DepthMeasurementData>({
        signal: options?.signal,
        action: getWellSDKClient().measurements.listData,
        actionProps: {
          sequenceExternalId,
          measurementTypes,
          depthUnit: unit && { unit },
        },
        concatAccessor: 'rows',
      });
    })
  );
};
