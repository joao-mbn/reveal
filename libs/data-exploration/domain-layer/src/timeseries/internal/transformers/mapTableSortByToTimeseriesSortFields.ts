import {
  TableSortBy,
  // DEFAULT_SCORE_SORTING,
} from '@data-exploration-lib/domain-layer';
import {
  InternalSortBy,
  METADATA_KEY_SEPARATOR,
} from '@data-exploration-lib/domain-layer';

export const mapTableSortByToTimeseriesSortFields = (
  sortBy?: TableSortBy[]
): InternalSortBy[] | undefined => {
  if (!sortBy || sortBy.length === 0) return undefined;
  // INFO: Sorting according to search score is not supported by TS and Sequences yet.
  // if (!sortBy || sortBy.length === 0) {
  //   return DEFAULT_SCORE_SORTING;
  // }

  if (sortBy.length > 0) {
    return sortBy.map((tableSort) => {
      const properties = tableSort.id.split(METADATA_KEY_SEPARATOR);

      return {
        property: properties,
        order: tableSort.desc ? 'desc' : 'asc',
        // Waiting implentation from timelords
        // nulls: tableSort.desc ? 'last' : 'first', // When ascending undefined(null) comes first and last for descending
      };
    });
  }

  return undefined;
};