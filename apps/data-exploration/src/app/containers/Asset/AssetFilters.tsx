import { useList } from '@cognite/sdk-react-query-hooks';
import {
  useAssetFilters,
  useFilterEmptyState,
  useResetAssetFilters,
} from '@data-exploration-app/store/filter';
import { BaseFilterCollapse } from '@data-exploration-app/components/Collapse/BaseFilterCollapse/BaseFilterCollapse';
import {
  LabelFilterV2,
  MetadataFilterV2,
  SourceFilter,
} from '@cognite/data-exploration';
import { TempMultiSelectFix } from '@data-exploration-app/containers/elements';
import { SPECIFIC_INFO_CONTENT } from '@data-exploration-app/containers/constants';
import {
  transformNewFilterToOldFilter,
  useAssetsMetadataKeysAggregateQuery,
  useAssetsMetadataValuesAggregateQuery,
} from '@data-exploration-lib/domain-layer';

import { useFlagAdvancedFilters } from '@data-exploration-app/hooks';

export const AssetFilters = ({ ...rest }) => {
  const [assetFilters, setAssetFilters] = useAssetFilters();
  const resetAssetFilters = useResetAssetFilters();
  const isFiltersEmpty = useFilterEmptyState('asset');

  const { data: items = [] } = useList<any>('assets', {
    filter: transformNewFilterToOldFilter(assetFilters),
    limit: 1000,
  });

  const { data: metadataKeys = [] } =
    useAssetsMetadataKeysAggregateQuery(assetFilters);

  const isAdvancedFiltersEnabled = useFlagAdvancedFilters();

  return (
    <BaseFilterCollapse.Panel
      title="Assets"
      hideResetButton={isFiltersEmpty}
      infoContent={SPECIFIC_INFO_CONTENT}
      onResetClick={resetAssetFilters}
      {...rest}
    >
      <TempMultiSelectFix>
        <LabelFilterV2
          resourceType="asset"
          value={assetFilters.labels}
          setValue={(newFilters) =>
            setAssetFilters({
              labels: newFilters,
            })
          }
          addNilOption
        />

        <SourceFilter
          items={items}
          value={assetFilters.sources}
          onChange={(newSources) =>
            setAssetFilters({
              sources: newSources,
            })
          }
          isAdvancedFiltersEnabled={isAdvancedFiltersEnabled}
        />

        <MetadataFilterV2
          items={items}
          keys={metadataKeys}
          value={assetFilters.metadata}
          setValue={(newMetadata) =>
            setAssetFilters({
              metadata: newMetadata,
            })
          }
          useAggregateMetadataValues={useAssetsMetadataValuesAggregateQuery}
        />
      </TempMultiSelectFix>
    </BaseFilterCollapse.Panel>
  );
};
