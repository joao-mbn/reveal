import { useQuery } from '@tanstack/react-query';

import { useSDK } from '@cognite/sdk-provider';

import { queryKeys } from '../../queryKeys';
import { TimeseriesSingleAggregateQuery } from '../types';
import { getTimeseriesSingleAggregate } from '../network';

interface Props {
  query: TimeseriesSingleAggregateQuery;
}

export const useTimeseriesSingleAggregateQuery = ({ query }: Props) => {
  const sdk = useSDK();

  return useQuery(
    queryKeys.timeseriesSingleAggregate(query),
    () => {
      return getTimeseriesSingleAggregate(sdk, query);
    },
    {
      keepPreviousData: true,
      onError: () => {
        return {
          id: query.id,
          data: {},
        };
      },
    }
  );
};