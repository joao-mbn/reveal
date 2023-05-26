import { useMemo } from 'react';

import {
  UseInfiniteQueryOptions,
  useInfiniteQuery,
} from '@tanstack/react-query';

import { useSDK } from '@cognite/sdk-provider';

import { queryKeys } from '../../../queryKeys';
import { getBasicMappingsByAssetId } from '../network';

export const useBasicMappingsByAssetIdQuery = (
  {
    assetId,
    limit,
  }: {
    assetId: number;
    limit?: number;
  },
  options?: UseInfiniteQueryOptions
) => {
  const sdk = useSDK();

  const { data, ...rest } = useInfiniteQuery(
    queryKeys.listBasicAssetMappings(assetId),
    async ({ pageParam }) => {
      return await getBasicMappingsByAssetId(sdk, {
        assetId,
        limit,
        cursor: pageParam,
      });
    },
    {
      getNextPageParam: (param) => param.nextCursor,
      ...(options as any),
    }
  );

  const flattenData = useMemo(
    () => (data?.pages || []).flatMap(({ data }) => data),
    [data?.pages]
  );

  return { data: flattenData, ...rest };
};
