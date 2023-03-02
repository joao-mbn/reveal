import { DocumentFilterProperty, DocumentSortItem } from '@cognite/sdk';
import {
  TableSortBy,
  METADATA_KEY_SEPARATOR,
} from '@data-exploration-lib/domain-layer';

const columnToSortMap = new Map<string, DocumentFilterProperty>([
  ['name', ['sourceFile', 'name']],
  ['type', ['type']],
  ['author', ['author']],
  ['modifiedTime', ['modifiedTime']],
  ['createdTime', ['createdTime']],
  ['externalId', ['externalId']],
  ['id', ['id']],
  ['dataSetId', ['sourceFile', 'datasetId']],
]);

export const mapTableSortByToDocumentSortFields = (
  sortBy?: TableSortBy[]
): DocumentSortItem[] | undefined => {
  if (!sortBy || sortBy.length === 0) return undefined;

  // Documents sort only supports for 1 property.
  const { id, desc } = sortBy[0];
  return [
    {
      order: desc ? 'desc' : 'asc',
      property: columnToSortMap.get(id) || [
        'sourceFile',
        ...id.split(METADATA_KEY_SEPARATOR),
      ],
    },
  ];
};
