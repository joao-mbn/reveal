import { AdvancedFilterBuilder, AdvancedFilter } from '../../../builders';
import { InternalDocumentFilter } from '../types';
import { isNumeric, searchConfigData } from '@data-exploration-lib/core';

export type DocumentProperties = {
  'sourceFile|datasetId': number[];
  'sourceFile|assetIds': number[];
  author: string[];
  'sourceFile|source': string[];
  type: string[];
  externalId: string;
  id: number;
  metadata: string;
  assetIds: number[];
  [key: `sourceFile|metadata|${string}`]: string;
};

export const mapFiltersToDocumentSearchFilters = (
  {
    dataSetIds,
    externalIdPrefix,
    source,
    author,
    type,
    createdTime,
    lastUpdatedTime,
    assetSubtreeIds,
    internalId,
    metadata,
  }: InternalDocumentFilter,
  query?: string
): AdvancedFilter<DocumentProperties> | undefined => {
  const builder = new AdvancedFilterBuilder<DocumentProperties>();

  const filterBuilder = new AdvancedFilterBuilder<DocumentProperties>()
    .in('sourceFile|datasetId', () => {
      return dataSetIds?.reduce((acc, { value }) => {
        if (typeof value === 'number') {
          return [...acc, value];
        }
        return acc;
      }, [] as number[]);
    })

    .in('author', author)
    .in('sourceFile|source', source)
    .in('type', type)
    .equals('id', internalId)
    .inAssetSubtree('assetIds', () => {
      return assetSubtreeIds?.reduce((acc, { value }) => {
        if (typeof value === 'number') {
          return [...acc, value];
        }
        return acc;
      }, [] as number[]);
    })
    .prefix('externalId', externalIdPrefix)
    .range('createdTime', {
      lte: createdTime?.max as number,
      gte: createdTime?.min as number,
    })
    .range('modifiedTime', {
      lte: lastUpdatedTime?.max as number,
      gte: lastUpdatedTime?.min as number,
    });

  if (metadata) {
    for (const { key, value } of metadata) {
      filterBuilder.equals(`sourceFile|metadata|${key}`, value);
    }
  }

  builder.and(filterBuilder);

  if (query) {
    const searchQueryBuilder = new AdvancedFilterBuilder<DocumentProperties>();

    if (searchConfigData.file['sourceFile|name']) {
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore the builder types will be refactored in future the "ts-ignore" is harmless in this case
      searchQueryBuilder.search('sourceFile|name', query);
    }
    if (searchConfigData.file.content) {
      // @ts-ignore
      searchQueryBuilder.search('content', query);
    }

    if (searchConfigData.file['sourceFile|metadata']) {
      // @ts-ignore
      searchQueryBuilder.prefix('sourceFile|metadata', query);
    }

    if (isNumeric(query) && searchConfigData.file.id) {
      searchQueryBuilder.equals('id', Number(query));
    }

    if (searchConfigData.file.externalId) {
      searchQueryBuilder.prefix('externalId', query);
    }

    if (searchConfigData.file['sourceFile|source']) {
      // @ts-ignore
      searchQueryBuilder.prefix('sourceFile|source', query);
    }

    if (searchConfigData.file.labels) {
      // @ts-ignore
      searchQueryBuilder.containsAny('labels', [{ externalId: query }]);
    }

    builder.or(searchQueryBuilder);
  }

  return new AdvancedFilterBuilder<DocumentProperties>().and(builder).build();
};
