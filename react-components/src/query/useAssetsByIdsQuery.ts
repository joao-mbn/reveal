/*!
 * Copyright 2024 Cognite AS
 */
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { type IdEither, type Asset } from '@cognite/sdk';

import { queryKeys } from '../utilities/queryKeys';
import { useSDK } from '../components/RevealCanvas/SDKProvider';
import { getAssetsByIds } from '../hooks/network/getAssetsByIds';

export const useAssetsByIdsQuery = (ids: IdEither[]): UseQueryResult<Asset[]> => {
  const sdk = useSDK();

  // eslint-disable-next-line no-console
  console.log(' getAssetsByIds ', ids);
  return useQuery(queryKeys.assetsById(ids), async () => await getAssetsByIds(sdk, ids), {
    enabled: ids.length > 0
  });
};
