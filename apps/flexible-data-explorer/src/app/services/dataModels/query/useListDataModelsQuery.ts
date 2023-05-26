import { useQuery } from '@tanstack/react-query';

import { useSDK } from '@cognite/sdk-provider';

import { FDMClient } from '../../FDMClient';

export const useListDataModelsQuery = () => {
  const sdk = useSDK();
  const client = new FDMClient(sdk);

  return useQuery(['data-models', 'all'], async () => {
    return client.listDataModels();
  });
};
