import {
  CogniteClient,
  CursorResponse,
  Sequence,
  SequenceFilter,
} from '@cognite/sdk';
import { AdvancedFilter } from '@data-exploration-lib/domain-layer';
import {
  normalizeSequence,
  SequenceProperties,
} from '@data-exploration-lib/domain-layer';
import { InternalSortBy } from '@data-exploration-lib/domain-layer';

export const getSequenceList = (
  sdk: CogniteClient,
  {
    advancedFilter,
    filter,
    cursor,
    limit,
    sort,
  }: {
    advancedFilter?: AdvancedFilter<SequenceProperties>;
    filter?: Required<SequenceFilter>['filter'];
    cursor?: string;
    limit?: number;
    sort?: InternalSortBy[];
  }
) => {
  return sdk
    .post<CursorResponse<Sequence[]>>(
      `/api/v1/projects/${sdk.project}/sequences/list`,
      {
        headers: {
          'cdf-version': 'alpha',
        },
        data: {
          limit: limit ?? 1000,
          cursor,
          filter,
          advancedFilter,
          sort,
        },
      }
    )
    .then(({ data }) => {
      return {
        items: normalizeSequence(data.items),
        nextCursor: data.nextCursor,
      };
    });
};