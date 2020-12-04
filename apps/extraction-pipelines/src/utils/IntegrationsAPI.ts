import { sdkv3 } from '@cognite/cdf-sdk-singleton';
import { DataSet, IdEither } from '@cognite/sdk';
import { get, getBaseUrl } from './baseURL';
import { Integration } from '../model/Integration';
import { IntegrationAPIResponse } from '../model/IntegrationAPIResponse';

import {
  createUpdateIntegrationObj,
  CreateUpdateIntegrationObjArgs,
} from './integrationUtils';
import { IntegrationFieldValue } from '../components/table/details/DetailsCols';

export const getIntegrations = async (
  _: string,
  project: string
): Promise<Integration[]> => {
  const response = await get<IntegrationAPIResponse>('/', project);
  return response.data.items;
};

export const getIntegrationById = async (
  _: string,
  integrationId: number,
  project: string
): Promise<Integration> => {
  const response = await get<Integration>(`/${integrationId}`, project);
  return response.data;
};

type Update = {
  [key: string]: {
    set: IntegrationFieldValue;
  };
};

export interface IntegrationUpdateSpec {
  id: string;
  update: Update;
}

export const saveUpdate = async (
  project: string,
  items: IntegrationUpdateSpec[]
) => {
  const response = await sdkv3.post<IntegrationAPIResponse>(
    `${getBaseUrl(project)}/update`,
    {
      data: {
        items,
      },
      withCredentials: true,
    }
  );
  return response.data.items[0];
};

export const updateIntegration = async (
  project: string,
  { data, id }: CreateUpdateIntegrationObjArgs
): Promise<Integration> => {
  const items = createUpdateIntegrationObj({
    data,
    id,
  });

  const response = await sdkv3.post<IntegrationAPIResponse>(
    `${getBaseUrl(project)}/update`,
    {
      data: {
        items,
      },
      withCredentials: true,
    }
  );
  return response.data.items[0];
};

export const getDataSets = async (ids: IdEither[]): Promise<DataSet[]> => {
  const res = await sdkv3.datasets.retrieve(ids);
  return res;
};
