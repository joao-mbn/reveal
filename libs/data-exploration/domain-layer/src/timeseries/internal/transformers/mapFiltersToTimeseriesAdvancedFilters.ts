import {
  InternalTimeseriesFilters,
  isNumeric,
  METADATA_ALL_VALUE,
} from '@data-exploration-lib/core';
import { NIL_FILTER_VALUE } from '@data-exploration-lib/domain-layer';
import {
  AdvancedFilter,
  AdvancedFilterBuilder,
} from '@data-exploration-lib/domain-layer';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

import { getSearchConfig } from '../../../utils';

export type TimeseriesProperties = {
  assetIds: number[];
  dataSetId: number[];
  unit: string | string[];
  externalId: string;
  name: string;
  id: number;
  isStep: boolean;
  isString: boolean;
  description: string;
  metadata: string;
  [key: `metadata|${string}`]: string;
};

export const mapFiltersToTimeseriesAdvancedFilters = (
  {
    dataSetIds,
    createdTime,
    lastUpdatedTime,
    externalIdPrefix,
    unit,
    metadata,
    isStep,
    isString,
    internalId,
  }: InternalTimeseriesFilters,
  query?: string
): AdvancedFilter<TimeseriesProperties> | undefined => {
  const builder = new AdvancedFilterBuilder<TimeseriesProperties>();

  const filterBuilder = new AdvancedFilterBuilder<TimeseriesProperties>()
    .in('dataSetId', () => {
      return dataSetIds?.reduce((acc, { value }) => {
        if (typeof value === 'number') {
          return [...acc, value];
        }
        return acc;
      }, [] as number[]);
    })
    .or(
      new AdvancedFilterBuilder<TimeseriesProperties>()
        .in('unit', () => {
          // this condition need to be removed when remove the legacy implementation
          if (unit && !isArray(unit)) {
            return [unit];
          }
          return unit;
        })
        .notExists('unit', () => {
          if (!unit) return false;
          if (isArray(unit)) {
            return unit.includes(NIL_FILTER_VALUE);
          }

          return unit === NIL_FILTER_VALUE;
        })
    )
    .equals('id', internalId)
    .equals('isStep', isStep)
    .equals('isString', isString)
    .prefix('externalId', externalIdPrefix)
    .range('createdTime', {
      lte: createdTime?.max as number,
      gte: createdTime?.min as number,
    })
    .range('lastUpdatedTime', {
      lte: lastUpdatedTime?.max as number,
      gte: lastUpdatedTime?.min as number,
    });

  if (metadata) {
    for (const { key, value } of metadata) {
      if (value === METADATA_ALL_VALUE) {
        filterBuilder.exists(`metadata|${key}`);
      } else {
        filterBuilder.equals(`metadata|${key}`, value);
      }
    }
  }

  builder.and(filterBuilder);

  if (query && !isEmpty(query)) {
    const searchQueryBuilder =
      new AdvancedFilterBuilder<TimeseriesProperties>();

    const searchConfigData = getSearchConfig();

    if (searchConfigData.timeSeries.name.enabled) {
      searchQueryBuilder.equals('name', query);
      searchQueryBuilder.prefix('name', query);

      if (searchConfigData.timeSeries.name.enabledFuzzySearch) {
        searchQueryBuilder.search('name', query);
      }
    }

    if (searchConfigData.timeSeries.description.enabled) {
      searchQueryBuilder.equals('description', query);
      searchQueryBuilder.prefix('description', query);

      if (searchConfigData.timeSeries.description.enabledFuzzySearch) {
        searchQueryBuilder.search('description', query);
      }
    }

    /**
     * We want to filter all the metadata keys with the search query, to give a better result
     * to the user when using our search.
     */
    if (searchConfigData.timeSeries.metadata.enabled) {
      searchQueryBuilder.prefix(`metadata`, query);
    }

    if (isNumeric(query) && searchConfigData.timeSeries.id.enabled) {
      searchQueryBuilder.equals('id', Number(query));
    }

    if (searchConfigData.timeSeries.unit.enabled) {
      searchQueryBuilder.prefix('unit', query);
    }

    if (searchConfigData.timeSeries.externalId.enabled) {
      searchQueryBuilder.prefix('externalId', query);
    }

    builder.or(searchQueryBuilder);
  }

  return new AdvancedFilterBuilder<TimeseriesProperties>().and(builder).build();
};
