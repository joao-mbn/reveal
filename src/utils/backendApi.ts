import { CogniteClient } from '@cognite/sdk';
import config from 'config';

export type CogniteFunction = {
  id: number;
  externalId?: string;
  name: string;
  fileId: number;
  description?: string;
};

const useBackendService = !!process.env.REACT_APP_BACKEND_SERVICE_BASE_URL;
const BACKEND_SERVICE_BASE_URL = process.env.REACT_APP_BACKEND_SERVICE_BASE_URL;
const CDF_API_BASE_URL = config.cdfApiBaseUrl;

const getServiceClient = (sdk: CogniteClient) => {
  const client = new CogniteClient({
    appId: config.appId,
    baseUrl: useBackendService ? BACKEND_SERVICE_BASE_URL : CDF_API_BASE_URL,
  });

  const accessToken = sdk
    .getDefaultRequestHeaders()
    .Authorization.split('Bearer ')[1];

  client.loginWithOAuth({
    project: sdk.project,
    accessToken,
  });

  return client;
};

export const getCalls = async (sdk: CogniteClient, fnId: number) => {
  const client = getServiceClient(sdk);

  return client
    .get(`/api/playground/projects/${sdk.project}/functions/${fnId}/calls`)
    .then((response) => response?.data?.items || []);
};

export async function listFunctions(sdk: CogniteClient) {
  const client = getServiceClient(sdk);

  return client
    .get<{ items: CogniteFunction[] }>(
      `/api/playground/projects/${sdk.project}/functions`
    )
    .then((r) => r.data?.items);
}

export async function callFunction(
  sdk: CogniteClient,
  functionId: number,
  data?: object
) {
  const client = getServiceClient(sdk);

  return client
    .post(
      `/api/playground/projects/${sdk.project}/functions/${functionId}/call`,
      {
        data: { data },
      }
    )
    .then((r) => r.data);
}

export async function getCallStatus(
  sdk: CogniteClient,
  functionId: number,
  callId: number
) {
  const client = getServiceClient(sdk);

  return client
    .get(
      `/api/playground/projects/${sdk.project}/functions/${functionId}/calls/${callId}`
    )
    .then((r) => r.data);
}

export async function getCallResponse(
  sdk: CogniteClient,
  functionId: number,
  callId: number
) {
  const client = getServiceClient(sdk);

  return client
    .get(
      `/api/playground/projects/${sdk.project}/functions/${functionId}/calls/${callId}/response`
    )
    .then((r) => r.data.response);
}
