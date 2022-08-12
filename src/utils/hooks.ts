import { useQuery, QueryConfig, useQueryCache, useMutation } from 'react-query';
import {
  CogFunction,
  GetCallsArgs,
  Call,
  GetCallArgs,
  CallResponse,
  Log,
  Schedule,
} from 'types';
import sdk, { getUserInformation } from '@cognite/cdf-sdk-singleton';
import { getProject } from '@cognite/cdf-utilities';
import {
  allFunctionsKey,
  allSchedulesKey,
  callKey,
  callsKey,
  functionKey,
  logsKey,
  responseKey,
  sortFunctionKey,
} from './queryKeys';
import { getCalls, getCall, getResponse, getLogs, getLatestCalls } from './api';

export const useFunctions = (config?: QueryConfig<CogFunction[], unknown>) => {
  const cache = useQueryCache();
  return useQuery<CogFunction[]>(
    [allFunctionsKey],
    () =>
      sdk
        .get(`/api/v1/projects/${getProject()}/functions`)
        .then(r => r.data?.items),
    {
      onSuccess: functions => {
        functions.forEach(fn => {
          cache.setQueryData(functionKey({ id: fn.id }), fn, {
            initialStale: false,
          });
        });
      },
      ...config,
    }
  );
};
export const useFunction = (
  id: number,
  config?: QueryConfig<CogFunction, unknown>
) =>
  useQuery<CogFunction>(
    functionKey({ id }),
    () =>
      sdk
        .get(`/api/v1/projects/${getProject()}/functions/${id}`)
        .then(r => r.data),
    config
  );
export const useSchedules = (config?: QueryConfig<Schedule[], unknown>) =>
  useQuery<Schedule[]>(
    [allSchedulesKey],
    () =>
      sdk
        .get(`/api/v1/projects/${getProject()}/functions/schedules`, {
          params: { limit: 1000 },
        })
        .then(r => r.data?.items),
    config
  );

export const useCalls = (
  args: GetCallsArgs,
  config?: QueryConfig<Call[], unknown>
) => useQuery<Call[]>(callsKey(args), getCalls, config);

export const useMultipleCalls = (
  args: GetCallsArgs[],
  config?: QueryConfig<{ [id: number]: Call | undefined }, unknown>
) =>
  useQuery<{ [id: number]: Call | undefined }>(
    [sortFunctionKey, args],
    getLatestCalls,
    config
  );

export const useCall = (
  args: GetCallArgs,
  config?: QueryConfig<Call, unknown>
) => useQuery<Call>(callKey(args), getCall, config);

export const useResponse = (
  args: GetCallArgs,
  config?: QueryConfig<CallResponse, unknown>
) => useQuery<CallResponse>(responseKey(args), getResponse, config);

export const useLogs = (
  args: GetCallArgs,
  config?: QueryConfig<Log[], unknown>
) => useQuery<Log[]>(logsKey(args), getLogs, config);

type AssetType = 'files';
type Method = 'retrieve' | 'filter';
export const useSDK = <T>(assetType: AssetType, method: Method, data: any) =>
  useQuery<T>(['sdk', assetType, data], () =>
    // @ts-ignore
    sdk[assetType][method](data)
  );

export const useRefreshApp = () => {
  const cache = useQueryCache();
  return () => {
    cache.invalidateQueries();
  };
};

export const useUserInformation = () => {
  return useQuery('user-info', getUserInformation);
};

type ActivationResponse = {
  status: 'activated' | 'inactive' | 'requested';
};
type ActivationError = {
  message: string;
};

export const useCheckActivateFunction = (
  config?: QueryConfig<ActivationResponse, ActivationError>
) => {
  const project = getProject();
  return useQuery<ActivationResponse, ActivationError>(
    ['activation', project],
    () =>
      sdk
        .get(`api/v1/projects/${project}/functions/status`)
        .then(res => res.data),
    config
  );
};

export const useActivateFunction = (
  config?: QueryConfig<ActivationResponse, ActivationError>
) => {
  const cache = useQueryCache();
  const project = getProject();
  return useMutation<ActivationResponse, ActivationError>(
    () =>
      sdk
        .post(`/api/v1/projects/${project}/functions/status`)
        .then(res => res.data),
    {
      ...config,
      onSuccess: data => {
        cache.setQueryData(['activation', project], data);
      },
    }
  );
};
