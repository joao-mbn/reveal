import {
  Timeseries,
  CogniteError,
  TimeseriesFilter,
  TimeSeriesUpdate,
  CogniteClient,
} from '@cognite/sdk';
import { useSDK } from '@cognite/sdk-provider';
import {
  QueryClient,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { PropertyAggregate, PropertyAggregateResponse } from 'common/types';
import { downcaseMetadata } from 'utils';

import { TABLE_ITEMS_PER_PAGE } from '../constants';

type TSParams = {
  limit?: number;
  unmatchedOnly?: boolean;
  filter?: TimeseriesFilter;
};
const useTimeseriesKey = (opts: TSParams): QueryKey => [
  'timeseries',
  'list',
  opts,
];
const useTimeseriesSearchKey = (
  q: string,
  filter?: TimeseriesFilter
): QueryKey => ['timeseries', 'search', q, { filter }];

type RawTimeseries = Timeseries & {
  lastUpdatedTime: number;
  createdTime: number;
};

export const useTimeseries = (
  { limit = TABLE_ITEMS_PER_PAGE, unmatchedOnly: unmatched, filter }: TSParams,
  opts?: UseInfiniteQueryOptions<
    { items: RawTimeseries[]; nextPage?: string },
    CogniteError
  >
) => {
  const sdk = useSDK();
  return useInfiniteQuery(
    useTimeseriesKey({ limit, filter, unmatchedOnly: unmatched }),
    ({ pageParam }) =>
      sdk
        .post<{ items: RawTimeseries[]; nextPage?: string }>(
          `/api/v1/projects/${sdk.project}/timeseries/list`,
          {
            headers: {
              'cdf-version': 'alpha',
            },
            data: {
              cursor: pageParam,
              filter,
              advancedFilter: unmatched
                ? {
                    not: {
                      exists: {
                        property: ['assetId'],
                      },
                    },
                  }
                : undefined,
              limit,
            },
          }
        )
        .then((r) => {
          if (r.status === 200) {
            return {
              nextPage: r.data.nextPage,
              items: r.data.items.map((ts) => {
                return {
                  ...ts,
                  // this will downcase all metadata keys. this is done since metadata aggreagates
                  // are downcased server side and metadata fitlers are case insensitive
                  metadata: downcaseMetadata(ts.metadata),
                };
              }),
            };
          } else {
            return Promise.reject(r);
          }
        }),
    {
      getNextPageParam(lastPage) {
        return lastPage.nextPage;
      },
      ...opts,
    }
  );
};

export const useTimeseriesSearch = <T>(
  query: string,
  opts?: UseQueryOptions<Timeseries[], CogniteError, T>
) => {
  const sdk = useSDK();
  return useQuery(
    useTimeseriesSearchKey(query),
    () => sdk.timeseries.search({ search: { query }, limit: 1000 }),

    opts
  );
};

export const useUpdateTimeseries = (
  options?: UseMutationOptions<Timeseries[], CogniteError, TimeSeriesUpdate[]>
) => {
  const sdk = useSDK();

  return useMutation(
    ['update', 'ts'],
    (changes) => {
      return sdk.timeseries.update(changes);
    },
    options
  );
};

export const getPropertiesAggregateKey = (): QueryKey => [
  'timeseries',
  'properties-aggregate',
];

/**
 * NOTE: metadata aggreates are always downcased since metadata filters are case-insensitive.
 */
export const getPropertiesAggregate = async (sdk: CogniteClient) => {
  const topLevelProperties: PropertyAggregate[] = [
    { values: [{ property: ['name'] }] },
    { values: [{ property: ['description'] }] },
    { values: [{ property: ['unit'] }] },
  ];
  return sdk
    .post<PropertyAggregateResponse>(
      `/api/v1/projects/${sdk.project}/timeseries/aggregate`,
      {
        headers: {
          'cdf-version': 'alpha',
        },
        data: { aggregate: 'uniqueProperties', path: ['metadata'] },
      }
    )
    .then((r) => {
      if (r.status === 200) {
        return [...topLevelProperties, ...r.data.items];
      } else {
        return Promise.reject(r);
      }
    });
};

export const fetchProperties = async (sdk: CogniteClient, qc: QueryClient) => {
  return qc.fetchQuery(getPropertiesAggregateKey(), () =>
    getPropertiesAggregate(sdk)
  );
};

export const useProperties = (
  options?: UseQueryOptions<PropertyAggregate[], CogniteError>
) => {
  const sdk = useSDK();
  return useQuery(
    getPropertiesAggregateKey(),
    () => getPropertiesAggregate(sdk),
    options
  );
};
