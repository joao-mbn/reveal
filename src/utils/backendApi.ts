import queryString from 'query-string';
import { CogniteClient } from '@cognite/sdk';
import config, { getSidecar } from 'config';
import { BACKEND_SERVICE_URL_KEY, CLUSTER_KEY } from 'utils/constants';
import { getLoginStatus } from './login';

export type CogniteFunction = {
  id: number;
  externalId?: string;
  name: string;
  fileId: number;
  description?: string;
};

const backendServiceBaseUrlFromQuery = queryString.parse(
  window.location.search
)[BACKEND_SERVICE_URL_KEY] as string;

const BACKEND_SERVICE_BASE_URL =
  backendServiceBaseUrlFromQuery ||
  process.env.REACT_APP_BACKEND_SERVICE_BASE_URL;

const useBackendService = !!BACKEND_SERVICE_BASE_URL;

const getServiceClient = async (sdk: CogniteClient) => {
  const login = await getLoginStatus(sdk);

  if (!login?.id) {
    return sdk;
  }

  const { cdfCluster } = getSidecar();
  const urlCluster = queryString.parse(window.location.search)[CLUSTER_KEY];

  const client = new CogniteClient({
    appId: config.appId,
    baseUrl: useBackendService
      ? BACKEND_SERVICE_BASE_URL
      : `https://${urlCluster || cdfCluster || 'api'}.cognitedata.com`,
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
  const client = await getServiceClient(sdk);

  return client
    .get(`/api/playground/projects/${sdk.project}/functions/${fnId}/calls`)
    .then((response) => response?.data?.items || []);
};

export async function listFunctions(sdk: CogniteClient) {
  const client = await getServiceClient(sdk);

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
  const client = await getServiceClient(sdk);

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
  const client = await getServiceClient(sdk);

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
  const client = await getServiceClient(sdk);

  return client
    .get(
      `/api/playground/projects/${sdk.project}/functions/${functionId}/calls/${callId}/response`
    )
    .then((r) => r.data.response);
}
