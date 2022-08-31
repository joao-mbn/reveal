import { CogniteClient } from '@cognite/sdk';
import { StringifyOptions } from 'query-string';
import { createLink } from '@cognite/cdf-utilities';

export const EXTRACTION_PIPELINES_PATH: Readonly<string> = 'extpipes';
export const PROJECT_ITERA_INT_GREEN: Readonly<string> = 'itera-int-green';
export const ORIGIN_DEV: Readonly<string> = 'dev';
export const CDF_ENV_GREENFIELD: Readonly<string> = 'greenfield';

const getBaseUrl = (project: string): string => {
  return `/api/v1/projects/${project}/${EXTRACTION_PIPELINES_PATH}`;
};

const createExtPipePath = (
  path: string = '',
  queries?: any,
  opts?: StringifyOptions
) => {
  return createLink(`/${EXTRACTION_PIPELINES_PATH}${path}`, queries, opts);
};

const get = async <D extends object>(
  sdk: CogniteClient,
  route: string,
  params = ''
) => {
  return sdk.get<D>(`${getBaseUrl(sdk.project)}${route}${params}`, {
    withCredentials: true,
  });
};

const post = async <Response extends object, D>(
  sdk: CogniteClient,
  route: string,
  data: D,
  params = ''
) => {
  return sdk.post<Response>(`${getBaseUrl(sdk.project)}${route}${params}`, {
    data,
    withCredentials: true,
  });
};

export { get, getBaseUrl, post, createExtPipePath };
