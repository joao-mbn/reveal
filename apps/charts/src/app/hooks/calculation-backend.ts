import { useCallback } from 'react';

import { WorkflowResult } from '@charts-app/models/calculation-results/types';
import { ChartThreshold } from '@charts-app/models/chart/types';
import { RAW_DATA_POINTS_THRESHOLD } from '@charts-app/utils/constants';
import { getHash } from '@charts-app/utils/hash';
import {
  MutateOptions,
  useMutation,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';

import {
  Calculation,
  CalculationResult,
  Status,
  CreateStatisticsParams,
  CreateDataProfilingParams,
  StatisticsResult,
  DataProfilingResult,
  CreateThresholdsParams,
  StatusStatusEnum,
} from '@cognite/calculation-backend';
import { DatapointAggregate, DatapointsMultiQuery } from '@cognite/sdk';
import { useSDK } from '@cognite/sdk-provider';

import {
  createCalculation,
  createStatistics,
  createDataProfiling,
  createThreshold,
  fetchCalculationQueryResult,
  fetchCalculationResult,
  fetchCalculationStatus,
  fetchStatisticsResult,
  fetchStatisticsStatus,
  fetchDataProfilingStatus,
  fetchDataProfilingResult,
  fetchThresholdResult,
  waitForCalculationToFinish,
  waitForThresholdToFinish,
} from '../services/calculation-backend';

export const useCreateCalculation = () => {
  const sdk = useSDK();
  return useMutation(async ({ definition }: { definition: Calculation }) => {
    return createCalculation(sdk, definition);
  });
};

export const useCalculationStatus = (
  id: string | number,
  queryOpts?: UseQueryOptions<Status>
) => {
  const sdk = useSDK();
  return useQuery<Status>(
    ['calculation', 'status', id],
    () => fetchCalculationStatus(sdk, String(id)),
    {
      ...queryOpts,
      retry: 1,
      retryDelay: 1000,
      enabled: !!id,
    }
  );
};

export const useCalculationResult = (
  id?: string | number,
  queryOpts?: UseQueryOptions<CalculationResult>
) => {
  const sdk = useSDK();
  return useQuery<CalculationResult>(
    ['calculation', 'response', id],
    () => {
      return fetchCalculationResult(sdk, String(id));
    },
    {
      retry: 1,
      retryDelay: 1000,
      enabled: !!id,
      staleTime: 10000,
      ...queryOpts,
    }
  );
};

export const useCalculationQueryResult = (
  id: string | number,
  query: DatapointsMultiQuery,
  queryOpts?: UseQueryOptions<WorkflowResult>
) => {
  const sdk = useSDK();
  return useQuery<WorkflowResult>(
    ['calculation', 'response_query_v2', id, query],
    async () => {
      const aggregatedResult = await fetchCalculationQueryResult(
        sdk,
        String(id),
        query
      );

      const aggregatedCount = (
        aggregatedResult.datapoints as DatapointAggregate[]
      ).reduce((point: number, c: DatapointAggregate) => {
        return point + (c.count || 0);
      }, 0);

      const isRaw =
        !aggregatedResult.isDownsampled &&
        aggregatedCount < RAW_DATA_POINTS_THRESHOLD;

      const getRawResult = () =>
        fetchCalculationQueryResult(sdk, String(id), {
          ...query,
          granularity: undefined,
          aggregates: undefined,
        });

      return isRaw ? getRawResult() : aggregatedResult;
    },
    {
      retry: 1,
      retryDelay: 1000,
      enabled: !!id,
      staleTime: 10000,
      ...queryOpts,
    }
  );
};

export const useCreateDataProfiling = () => {
  const sdk = useSDK();
  return useMutation(
    async (createDataProfilingParams: CreateDataProfilingParams) => {
      return createDataProfiling(sdk, createDataProfilingParams);
    }
  );
};

export const useDataProfilingStatus = (
  id: string | number,
  queryOpts?: UseQueryOptions<Status>
) => {
  const sdk = useSDK();
  return useQuery<Status>(
    ['calculation', 'status', id],
    () => fetchDataProfilingStatus(sdk, String(id)),
    {
      ...queryOpts,
      retry: 1,
      retryDelay: 1000,
      enabled: !!id,
    }
  );
};

export const useDataProfilingResult = (
  id: string | number,
  queryOpts?: UseQueryOptions<DataProfilingResult>
) => {
  const sdk = useSDK();
  return useQuery<DataProfilingResult>(
    ['calculation', 'response', id],
    () => fetchDataProfilingResult(sdk, String(id)),
    {
      retry: 1,
      retryDelay: 1000,
      enabled: !!id,
      ...queryOpts,
    }
  );
};

export const useCreateStatistics = () => {
  const sdk = useSDK();
  return useMutation(async (createStatisticsParams: CreateStatisticsParams) => {
    return createStatistics(sdk, createStatisticsParams);
  });
};

export const useStatisticsStatus = (
  id: string | number,
  queryOpts?: UseQueryOptions<Status>
) => {
  const sdk = useSDK();
  return useQuery<Status>(
    ['calculation', 'status', id],
    () => fetchStatisticsStatus(sdk, String(id)),
    {
      ...queryOpts,
      retry: 1,
      retryDelay: 1000,
      enabled: !!id,
    }
  );
};

export const useStatisticsResult = (
  id: string | number,
  queryOpts?: UseQueryOptions<StatisticsResult>
) => {
  const sdk = useSDK();
  return useQuery<StatisticsResult>(
    ['calculation', 'response', id],
    () => fetchStatisticsResult(sdk, String(id)),
    {
      retry: 1,
      retryDelay: 1000,
      enabled: !!id,
      ...queryOpts,
    }
  );
};

/**
 * Threshold
 */
export const useCreateThreshold = () => {
  const sdk = useSDK();
  return useMutation(async (createThresholdParams: CreateThresholdsParams) => {
    return createThreshold(sdk, createThresholdParams);
  });
};

export const useThresholdIsReady = (thresholdCallId: string | undefined) => {
  const sdk = useSDK();

  return useQuery({
    queryKey: ['threshold', 'status', thresholdCallId],
    queryFn: async () => {
      return waitForThresholdToFinish(sdk, String(thresholdCallId));
    },
    enabled: !!thresholdCallId,
  });
};

export const useThresholdResultData = (
  thresholdCallId: string | undefined,
  callStatus: Status | undefined
) => {
  const sdk = useSDK();

  return useQuery({
    queryKey: ['thresholds', 'result', thresholdCallId],
    queryFn: () => fetchThresholdResult(sdk, thresholdCallId || ''),
    retry: true,
    retryDelay: 1000,
    enabled: callStatus?.status === StatusStatusEnum.Success,
  });
};

export const useThresholdCreator = () => {
  const sdk = useSDK();

  return useCallback(
    async ({
      thresholdParameters,
      onCreateThreshold,
      onUpdateThreshold,
    }: {
      thresholdParameters: CreateThresholdsParams;
      onCreateThreshold: (
        variables: CreateThresholdsParams,
        options?:
          | MutateOptions<Status, unknown, CreateThresholdsParams, unknown>
          | undefined
      ) => void;
      onUpdateThreshold: (diff: Partial<ChartThreshold>) => void;
    }) => {
      const hashOfParams = getHash(thresholdParameters);

      if (
        'calculation_id' in thresholdParameters &&
        thresholdParameters.calculation_id
      ) {
        await waitForCalculationToFinish(
          sdk,
          thresholdParameters.calculation_id
        );
      }

      onCreateThreshold(thresholdParameters, {
        onSuccess({ id: callId }) {
          onUpdateThreshold({
            calls: [
              {
                callDate: Date.now(),
                callId,
                hash: hashOfParams,
              },
            ],
          });
        },
      });
    },
    [sdk]
  );
};