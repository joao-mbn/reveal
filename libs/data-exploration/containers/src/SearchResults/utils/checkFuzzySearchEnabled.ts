import {
  SearchConfigDataType,
  SearchConfigResourceType,
} from '@data-exploration-lib/core';

export const checkFuzzySearchEnabled = (
  data: SearchConfigDataType,
  index: number
) => {
  // returns length of checked common cells in a common row.
  return (Object.keys(data) as Array<SearchConfigResourceType>).some(
    (resource) => {
      const filterId = Object.keys(data[resource])[index];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Property does not exist on type
      return data[resource][filterId]?.enabledFuzzySearch;
    }
  );
};
