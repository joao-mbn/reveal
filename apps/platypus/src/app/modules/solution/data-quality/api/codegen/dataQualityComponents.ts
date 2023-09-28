/**
 * Generated by @openapi-codegen
 *
 * @version v1 alpha
 */
import * as reactQuery from '@tanstack/react-query';

import {
  useDataQualityContext,
  DataQualityContext,
} from './dataQualityContext';
import type * as Fetcher from './dataQualityFetcher';
import { dataQualityFetch } from './dataQualityFetcher';
import type * as Responses from './dataQualityResponses';
import type * as Schemas from './dataQualitySchemas';

export type CreateDataSourcesPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
};

export type CreateDataSourcesError = Fetcher.ErrorWrapper<
  | {
      status: 400;
      payload: Responses.ErrorResponse;
    }
  | {
      status: 409;
      payload: Schemas.UpsertConflict;
    }
>;

export type CreateDataSourcesVariables = {
  body: Schemas.DataSourceCreateRequest;
  pathParams?: CreateDataSourcesPathParams;
} & DataQualityContext['fetcherOptions'];

/**
 * Add or update (upsert) data sources.
 */
export const fetchCreateDataSources = (
  variables: CreateDataSourcesVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.DataSourceListResponse,
    CreateDataSourcesError,
    Schemas.DataSourceCreateRequest,
    {},
    {},
    CreateDataSourcesPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources',
    method: 'post',
    ...variables,
    signal,
  });

/**
 * Add or update (upsert) data sources.
 */
export const useCreateDataSources = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Responses.DataSourceListResponse,
      CreateDataSourcesError,
      CreateDataSourcesVariables
    >,
    'mutationFn'
  >
) => {
  const { fetcherOptions } = useDataQualityContext();
  return reactQuery.useMutation<
    Responses.DataSourceListResponse,
    CreateDataSourcesError,
    CreateDataSourcesVariables
  >(
    (variables: CreateDataSourcesVariables) =>
      fetchCreateDataSources({ ...fetcherOptions, ...variables }),
    options
  );
};

export type ListDataSourcesPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
};

export type ListDataSourcesQueryParams = {
  /**
   * Cursor for paging through results.
   *
   * @example 4zj0Vy2fo0NtNMb229mI9r1V3YG5NBL752kQz1cKtwo
   */
  cursor?: string;
};

export type ListDataSourcesError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: Responses.ErrorResponse;
}>;

export type ListDataSourcesVariables = {
  pathParams?: ListDataSourcesPathParams;
  queryParams?: ListDataSourcesQueryParams;
} & DataQualityContext['fetcherOptions'];

/**
 * List data sources defined in the current project.
 */
export const fetchListDataSources = (
  variables: ListDataSourcesVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.DataSourceListResponseWithCursor,
    ListDataSourcesError,
    undefined,
    {},
    ListDataSourcesQueryParams,
    ListDataSourcesPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources',
    method: 'get',
    ...variables,
    signal,
  });

/**
 * List data sources defined in the current project.
 */
export const useListDataSources = <
  TData = Responses.DataSourceListResponseWithCursor
>(
  variables: ListDataSourcesVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<
      Responses.DataSourceListResponseWithCursor,
      ListDataSourcesError,
      TData
    >,
    'queryKey' | 'queryFn'
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useDataQualityContext(options);
  return reactQuery.useQuery<
    Responses.DataSourceListResponseWithCursor,
    ListDataSourcesError,
    TData
  >(
    queryKeyFn({
      path: '/api/v1/projects/{project}/data-validation/datasources',
      operationId: 'listDataSources',
      variables,
    }),
    ({ signal }) =>
      fetchListDataSources({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type ListByIdsDataSourcesPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
};

export type ListByIdsDataSourcesError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: Responses.ErrorResponse;
}>;

export type ListByIdsDataSourcesVariables = {
  body: Schemas.DataSourceListIdsRequest;
  pathParams?: ListByIdsDataSourcesPathParams;
} & DataQualityContext['fetcherOptions'];

/**
 * Retrieve up to 100 data sources by specifying their ids.
 */
export const fetchListByIdsDataSources = (
  variables: ListByIdsDataSourcesVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.DataSourceListResponse,
    ListByIdsDataSourcesError,
    Schemas.DataSourceListIdsRequest,
    {},
    {},
    ListByIdsDataSourcesPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/byids',
    method: 'post',
    ...variables,
    signal,
  });

/**
 * Retrieve up to 100 data sources by specifying their ids.
 */
export const useListByIdsDataSources = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Responses.DataSourceListResponse,
      ListByIdsDataSourcesError,
      ListByIdsDataSourcesVariables
    >,
    'mutationFn'
  >
) => {
  const { fetcherOptions } = useDataQualityContext();
  return reactQuery.useMutation<
    Responses.DataSourceListResponse,
    ListByIdsDataSourcesError,
    ListByIdsDataSourcesVariables
  >(
    (variables: ListByIdsDataSourcesVariables) =>
      fetchListByIdsDataSources({ ...fetcherOptions, ...variables }),
    options
  );
};

export type DeleteDataSourcesPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
};

export type DeleteDataSourcesError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: Responses.ErrorResponse;
}>;

export type DeleteDataSourcesVariables = {
  body: Schemas.DataSourceListIdsRequest;
  pathParams?: DeleteDataSourcesPathParams;
} & DataQualityContext['fetcherOptions'];

/**
 * Delete one or more data sources
 */
export const fetchDeleteDataSources = (
  variables: DeleteDataSourcesVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.DataSourceListIdsResponse,
    DeleteDataSourcesError,
    Schemas.DataSourceListIdsRequest,
    {},
    {},
    DeleteDataSourcesPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/delete',
    method: 'post',
    ...variables,
    signal,
  });

/**
 * Delete one or more data sources
 */
export const useDeleteDataSources = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Responses.DataSourceListIdsResponse,
      DeleteDataSourcesError,
      DeleteDataSourcesVariables
    >,
    'mutationFn'
  >
) => {
  const { fetcherOptions } = useDataQualityContext();
  return reactQuery.useMutation<
    Responses.DataSourceListIdsResponse,
    DeleteDataSourcesError,
    DeleteDataSourcesVariables
  >(
    (variables: DeleteDataSourcesVariables) =>
      fetchDeleteDataSources({ ...fetcherOptions, ...variables }),
    options
  );
};

export type CreateRulesetsPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
  /**
   * The external id of the data source.
   */
  dataSourceId?: string;
};

export type CreateRulesetsError = Fetcher.ErrorWrapper<
  | {
      status: 400;
      payload: Responses.ErrorResponse;
    }
  | {
      status: 409;
      payload: Schemas.UpsertConflict;
    }
>;

export type CreateRulesetsVariables = {
  body: Schemas.RulesetCreateRequest;
  pathParams?: CreateRulesetsPathParams;
} & DataQualityContext['fetcherOptions'];

/**
 * Add rulesets.
 */
export const fetchCreateRulesets = (
  variables: CreateRulesetsVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.RulesetListResponse,
    CreateRulesetsError,
    Schemas.RulesetCreateRequest,
    {},
    {},
    CreateRulesetsPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rulesets',
    method: 'post',
    ...variables,
    signal,
  });

/**
 * Add rulesets.
 */
export const useCreateRulesets = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Responses.RulesetListResponse,
      CreateRulesetsError,
      CreateRulesetsVariables
    >,
    'mutationFn'
  >
) => {
  const { fetcherOptions } = useDataQualityContext();
  return reactQuery.useMutation<
    Responses.RulesetListResponse,
    CreateRulesetsError,
    CreateRulesetsVariables
  >(
    (variables: CreateRulesetsVariables) =>
      fetchCreateRulesets({ ...fetcherOptions, ...variables }),
    options
  );
};

export type ListRulesetsPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
  /**
   * The external id of the data source.
   */
  dataSourceId?: string;
};

export type ListRulesetsQueryParams = {
  /**
   * Cursor for paging through results.
   *
   * @example 4zj0Vy2fo0NtNMb229mI9r1V3YG5NBL752kQz1cKtwo
   */
  cursor?: string;
};

export type ListRulesetsError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: Responses.ErrorResponse;
}>;

export type ListRulesetsVariables = {
  pathParams?: ListRulesetsPathParams;
  queryParams?: ListRulesetsQueryParams;
} & DataQualityContext['fetcherOptions'];

/**
 * List rulesets defined in the current project and the current data source.
 */
export const fetchListRulesets = (
  variables: ListRulesetsVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.RulesetListResponseWithCursor,
    ListRulesetsError,
    undefined,
    {},
    ListRulesetsQueryParams,
    ListRulesetsPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rulesets',
    method: 'get',
    ...variables,
    signal,
  });

/**
 * List rulesets defined in the current project and the current data source.
 */
export const useListRulesets = <
  TData = Responses.RulesetListResponseWithCursor
>(
  variables: ListRulesetsVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<
      Responses.RulesetListResponseWithCursor,
      ListRulesetsError,
      TData
    >,
    'queryKey' | 'queryFn'
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useDataQualityContext(options);
  return reactQuery.useQuery<
    Responses.RulesetListResponseWithCursor,
    ListRulesetsError,
    TData
  >(
    queryKeyFn({
      path: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rulesets',
      operationId: 'listRulesets',
      variables,
    }),
    ({ signal }) =>
      fetchListRulesets({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type ListByIdsRulesetsPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
  /**
   * The external id of the data source.
   */
  dataSourceId?: string;
};

export type ListByIdsRulesetsError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: Responses.ErrorResponse;
}>;

export type ListByIdsRulesetsVariables = {
  body: Schemas.RulesetListIdsRequest;
  pathParams?: ListByIdsRulesetsPathParams;
} & DataQualityContext['fetcherOptions'];

/**
 * Retrieve up to 100 rulesets by specifying their ids.
 */
export const fetchListByIdsRulesets = (
  variables: ListByIdsRulesetsVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.RulesetListResponse,
    ListByIdsRulesetsError,
    Schemas.RulesetListIdsRequest,
    {},
    {},
    ListByIdsRulesetsPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rulesets/byids',
    method: 'post',
    ...variables,
    signal,
  });

/**
 * Retrieve up to 100 rulesets by specifying their ids.
 */
export const useListByIdsRulesets = <TData = Responses.RulesetListResponse>(
  variables: ListByIdsRulesetsVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<
      Responses.RulesetListResponse,
      ListByIdsRulesetsError,
      TData
    >,
    'queryKey' | 'queryFn'
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useDataQualityContext(options);
  return reactQuery.useQuery<
    Responses.RulesetListResponse,
    ListByIdsRulesetsError,
    TData
  >(
    queryKeyFn({
      path: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rulesets/byids',
      operationId: 'listByIdsRulesets',
      variables,
    }),
    ({ signal }) =>
      fetchListByIdsRulesets({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type DeleteRulesetsPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
  /**
   * The external id of the data source.
   */
  dataSourceId?: string;
};

export type DeleteRulesetsError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: Responses.ErrorResponse;
}>;

export type DeleteRulesetsVariables = {
  body: Schemas.RulesetListIdsRequest;
  pathParams?: DeleteRulesetsPathParams;
} & DataQualityContext['fetcherOptions'];

/**
 * Delete one or more rulesets
 */
export const fetchDeleteRulesets = (
  variables: DeleteRulesetsVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.RulesetListIdsResponse,
    DeleteRulesetsError,
    Schemas.RulesetListIdsRequest,
    {},
    {},
    DeleteRulesetsPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rulesets/delete',
    method: 'post',
    ...variables,
    signal,
  });

/**
 * Delete one or more rulesets
 */
export const useDeleteRulesets = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Responses.RulesetListIdsResponse,
      DeleteRulesetsError,
      DeleteRulesetsVariables
    >,
    'mutationFn'
  >
) => {
  const { fetcherOptions } = useDataQualityContext();
  return reactQuery.useMutation<
    Responses.RulesetListIdsResponse,
    DeleteRulesetsError,
    DeleteRulesetsVariables
  >(
    (variables: DeleteRulesetsVariables) =>
      fetchDeleteRulesets({ ...fetcherOptions, ...variables }),
    options
  );
};

export type CreateRulesPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
  /**
   * The external id of the data source.
   */
  dataSourceId?: string;
  /**
   * The external id of the ruleset.
   */
  rulesetId?: string;
};

export type CreateRulesError = Fetcher.ErrorWrapper<
  | {
      status: 400;
      payload: Responses.ErrorResponse;
    }
  | {
      status: 409;
      payload: Schemas.UpsertConflict;
    }
>;

export type CreateRulesVariables = {
  body: Schemas.RuleCreateRequest;
  pathParams?: CreateRulesPathParams;
} & DataQualityContext['fetcherOptions'];

/**
 * Create a set of new rules.
 */
export const fetchCreateRules = (
  variables: CreateRulesVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.RuleListResponse,
    CreateRulesError,
    Schemas.RuleCreateRequest,
    {},
    {},
    CreateRulesPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rulesets/{rulesetId}/rules',
    method: 'post',
    ...variables,
    signal,
  });

/**
 * Create a set of new rules.
 */
export const useCreateRules = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Responses.RuleListResponse,
      CreateRulesError,
      CreateRulesVariables
    >,
    'mutationFn'
  >
) => {
  const { fetcherOptions } = useDataQualityContext();
  return reactQuery.useMutation<
    Responses.RuleListResponse,
    CreateRulesError,
    CreateRulesVariables
  >(
    (variables: CreateRulesVariables) =>
      fetchCreateRules({ ...fetcherOptions, ...variables }),
    options
  );
};

export type ListRulesPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
  /**
   * The external id of the data source.
   */
  dataSourceId?: string;
  /**
   * The external id of the ruleset.
   */
  rulesetId?: string;
};

export type ListRulesQueryParams = {
  /**
   * Cursor for paging through results.
   *
   * @example 4zj0Vy2fo0NtNMb229mI9r1V3YG5NBL752kQz1cKtwo
   */
  cursor?: string;
};

export type ListRulesError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: Responses.ErrorResponse;
}>;

export type ListRulesVariables = {
  pathParams?: ListRulesPathParams;
  queryParams?: ListRulesQueryParams;
} & DataQualityContext['fetcherOptions'];

/**
 * List rules defined in the current project, in the current data source and in the current ruleset.
 */
export const fetchListRules = (
  variables: ListRulesVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.RuleListResponseWithCursor,
    ListRulesError,
    undefined,
    {},
    ListRulesQueryParams,
    ListRulesPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rulesets/{rulesetId}/rules',
    method: 'get',
    ...variables,
    signal,
  });

/**
 * List rules defined in the current project, in the current data source and in the current ruleset.
 */
export const useListRules = <TData = Responses.RuleListResponseWithCursor>(
  variables: ListRulesVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<
      Responses.RuleListResponseWithCursor,
      ListRulesError,
      TData
    >,
    'queryKey' | 'queryFn'
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useDataQualityContext(options);
  return reactQuery.useQuery<
    Responses.RuleListResponseWithCursor,
    ListRulesError,
    TData
  >(
    queryKeyFn({
      path: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rulesets/{rulesetId}/rules',
      operationId: 'listRules',
      variables,
    }),
    ({ signal }) => fetchListRules({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type ListByIdsRulesPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
  /**
   * The external id of the data source.
   */
  dataSourceId?: string;
  /**
   * The external id of the ruleset.
   */
  rulesetId?: string;
};

export type ListByIdsRulesError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: Responses.ErrorResponse;
}>;

export type ListByIdsRulesVariables = {
  body: Schemas.RuleListIdsRequest;
  pathParams?: ListByIdsRulesPathParams;
} & DataQualityContext['fetcherOptions'];

/**
 * Retrieve up to 100 rules by specifying their ids.
 */
export const fetchListByIdsRules = (
  variables: ListByIdsRulesVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.RuleListResponse,
    ListByIdsRulesError,
    Schemas.RuleListIdsRequest,
    {},
    {},
    ListByIdsRulesPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rulesets/{rulesetId}/rules/byids',
    method: 'post',
    ...variables,
    signal,
  });

/**
 * Retrieve up to 100 rules by specifying their ids.
 */
export const useListByIdsRules = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Responses.RuleListResponse,
      ListByIdsRulesError,
      ListByIdsRulesVariables
    >,
    'mutationFn'
  >
) => {
  const { fetcherOptions } = useDataQualityContext();
  return reactQuery.useMutation<
    Responses.RuleListResponse,
    ListByIdsRulesError,
    ListByIdsRulesVariables
  >(
    (variables: ListByIdsRulesVariables) =>
      fetchListByIdsRules({ ...fetcherOptions, ...variables }),
    options
  );
};

export type DeleteRulesPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
  /**
   * The external id of the data source.
   */
  dataSourceId?: string;
  /**
   * The external id of the ruleset.
   */
  rulesetId?: string;
};

export type DeleteRulesError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: Responses.ErrorResponse;
}>;

export type DeleteRulesVariables = {
  body: Schemas.RuleListIdsRequest;
  pathParams?: DeleteRulesPathParams;
} & DataQualityContext['fetcherOptions'];

/**
 * Delete one or more rules
 */
export const fetchDeleteRules = (
  variables: DeleteRulesVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.RuleListIdsResponse,
    DeleteRulesError,
    Schemas.RuleListIdsRequest,
    {},
    {},
    DeleteRulesPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rulesets/{rulesetId}/rules/delete',
    method: 'post',
    ...variables,
    signal,
  });

/**
 * Delete one or more rules
 */
export const useDeleteRules = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Responses.RuleListIdsResponse,
      DeleteRulesError,
      DeleteRulesVariables
    >,
    'mutationFn'
  >
) => {
  const { fetcherOptions } = useDataQualityContext();
  return reactQuery.useMutation<
    Responses.RuleListIdsResponse,
    DeleteRulesError,
    DeleteRulesVariables
  >(
    (variables: DeleteRulesVariables) =>
      fetchDeleteRules({ ...fetcherOptions, ...variables }),
    options
  );
};

export type UpdateRulesPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
  /**
   * The external id of the data source.
   */
  dataSourceId?: string;
  /**
   * The external id of the ruleset.
   */
  rulesetId?: string;
};

export type UpdateRulesError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: Responses.ErrorResponse;
}>;

export type UpdateRulesVariables = {
  body: Schemas.RuleUpdateRequest;
  pathParams?: UpdateRulesPathParams;
} & DataQualityContext['fetcherOptions'];

/**
 * Update the properties of a set of rules
 */
export const fetchUpdateRules = (
  variables: UpdateRulesVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.RuleListResponse,
    UpdateRulesError,
    Schemas.RuleUpdateRequest,
    {},
    {},
    UpdateRulesPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rulesets/{rulesetId}/rules/update',
    method: 'post',
    ...variables,
    signal,
  });

/**
 * Update the properties of a set of rules
 */
export const useUpdateRules = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Responses.RuleListResponse,
      UpdateRulesError,
      UpdateRulesVariables
    >,
    'mutationFn'
  >
) => {
  const { fetcherOptions } = useDataQualityContext();
  return reactQuery.useMutation<
    Responses.RuleListResponse,
    UpdateRulesError,
    UpdateRulesVariables
  >(
    (variables: UpdateRulesVariables) =>
      fetchUpdateRules({ ...fetcherOptions, ...variables }),
    options
  );
};

export type ListAllRulesPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
  /**
   * The external id of the data source.
   */
  dataSourceId?: string;
};

export type ListAllRulesQueryParams = {
  /**
   * Cursor for paging through results.
   *
   * @example 4zj0Vy2fo0NtNMb229mI9r1V3YG5NBL752kQz1cKtwo
   */
  cursor?: string;
};

export type ListAllRulesError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: Responses.ErrorResponse;
}>;

export type ListAllRulesVariables = {
  pathParams?: ListAllRulesPathParams;
  queryParams?: ListAllRulesQueryParams;
} & DataQualityContext['fetcherOptions'];

/**
 * List rules defined in the current project, in the current data source and from all the rulesets.
 */
export const fetchListAllRules = (
  variables: ListAllRulesVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.RuleListResponseWithCursor,
    ListAllRulesError,
    undefined,
    {},
    ListAllRulesQueryParams,
    ListAllRulesPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rules',
    method: 'get',
    ...variables,
    signal,
  });

/**
 * List rules defined in the current project, in the current data source and from all the rulesets.
 */
export const useListAllRules = <TData = Responses.RuleListResponseWithCursor>(
  variables: ListAllRulesVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<
      Responses.RuleListResponseWithCursor,
      ListAllRulesError,
      TData
    >,
    'queryKey' | 'queryFn'
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useDataQualityContext(options);
  return reactQuery.useQuery<
    Responses.RuleListResponseWithCursor,
    ListAllRulesError,
    TData
  >(
    queryKeyFn({
      path: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rules',
      operationId: 'listAllRules',
      variables,
    }),
    ({ signal }) =>
      fetchListAllRules({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type DataSourceValidationRunPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
  /**
   * The external id of the data source.
   */
  dataSourceId?: string;
};

export type DataSourceValidationRunError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: Responses.ErrorResponse;
}>;

export type DataSourceValidationRunVariables = {
  body: Schemas.DataSourceValidationRequest;
  pathParams?: DataSourceValidationRunPathParams;
} & DataQualityContext['fetcherOptions'];

/**
 * A validation job will be started on the current data source and all its rules.
 */
export const fetchDataSourceValidationRun = (
  variables: DataSourceValidationRunVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    undefined,
    DataSourceValidationRunError,
    Schemas.DataSourceValidationRequest,
    {},
    {},
    DataSourceValidationRunPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/validation/run',
    method: 'post',
    ...variables,
    signal,
  });

/**
 * A validation job will be started on the current data source and all its rules.
 */
export const useDataSourceValidationRun = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      undefined,
      DataSourceValidationRunError,
      DataSourceValidationRunVariables
    >,
    'mutationFn'
  >
) => {
  const { fetcherOptions } = useDataQualityContext();
  return reactQuery.useMutation<
    undefined,
    DataSourceValidationRunError,
    DataSourceValidationRunVariables
  >(
    (variables: DataSourceValidationRunVariables) =>
      fetchDataSourceValidationRun({ ...fetcherOptions, ...variables }),
    options
  );
};

export type ListDataScopesPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
  /**
   * The external id of the data source.
   */
  dataSourceId?: string;
};

export type ListDataScopesQueryParams = {
  /**
   * Cursor for paging through results.
   *
   * @example 4zj0Vy2fo0NtNMb229mI9r1V3YG5NBL752kQz1cKtwo
   */
  cursor?: string;
};

export type ListDataScopesError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: Responses.ErrorResponse;
}>;

export type ListDataScopesVariables = {
  pathParams?: ListDataScopesPathParams;
  queryParams?: ListDataScopesQueryParams;
} & DataQualityContext['fetcherOptions'];

/**
 * List data scopes defined in the current data source.
 */
export const fetchListDataScopes = (
  variables: ListDataScopesVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.DataScopeListResponseWithCursor,
    ListDataScopesError,
    undefined,
    {},
    ListDataScopesQueryParams,
    ListDataScopesPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/datascopes',
    method: 'get',
    ...variables,
    signal,
  });

/**
 * List data scopes defined in the current data source.
 */
export const useListDataScopes = <
  TData = Responses.DataScopeListResponseWithCursor
>(
  variables: ListDataScopesVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<
      Responses.DataScopeListResponseWithCursor,
      ListDataScopesError,
      TData
    >,
    'queryKey' | 'queryFn'
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useDataQualityContext(options);
  return reactQuery.useQuery<
    Responses.DataScopeListResponseWithCursor,
    ListDataScopesError,
    TData
  >(
    queryKeyFn({
      path: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/datascopes',
      operationId: 'listDataScopes',
      variables,
    }),
    ({ signal }) =>
      fetchListDataScopes({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type CreateDataScopesPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
  /**
   * The external id of the data source.
   */
  dataSourceId?: string;
};

export type CreateDataScopesError = Fetcher.ErrorWrapper<
  | {
      status: 400;
      payload: Responses.ErrorResponse;
    }
  | {
      status: 409;
      payload: Schemas.UpsertConflict;
    }
>;

export type CreateDataScopesVariables = {
  body: Schemas.DataScopeCreateRequest;
  pathParams?: CreateDataScopesPathParams;
} & DataQualityContext['fetcherOptions'];

/**
 * Create a set of new data scopes.
 */
export const fetchCreateDataScopes = (
  variables: CreateDataScopesVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.DataScopeListResponse,
    CreateDataScopesError,
    Schemas.DataScopeCreateRequest,
    {},
    {},
    CreateDataScopesPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/datascopes',
    method: 'post',
    ...variables,
    signal,
  });

/**
 * Create a set of new data scopes.
 */
export const useCreateDataScopes = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Responses.DataScopeListResponse,
      CreateDataScopesError,
      CreateDataScopesVariables
    >,
    'mutationFn'
  >
) => {
  const { fetcherOptions } = useDataQualityContext();
  return reactQuery.useMutation<
    Responses.DataScopeListResponse,
    CreateDataScopesError,
    CreateDataScopesVariables
  >(
    (variables: CreateDataScopesVariables) =>
      fetchCreateDataScopes({ ...fetcherOptions, ...variables }),
    options
  );
};

export type UpdateDataScopesPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
  /**
   * The external id of the data source.
   */
  dataSourceId?: string;
};

export type UpdateDataScopesError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: Responses.ErrorResponse;
}>;

export type UpdateDataScopesVariables = {
  body: Schemas.DataScopeUpdateRequest;
  pathParams?: UpdateDataScopesPathParams;
} & DataQualityContext['fetcherOptions'];

/**
 * Update the properties of a set of data scopes
 */
export const fetchUpdateDataScopes = (
  variables: UpdateDataScopesVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.DataScopeListResponse,
    UpdateDataScopesError,
    Schemas.DataScopeUpdateRequest,
    {},
    {},
    UpdateDataScopesPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/datascopes/update',
    method: 'post',
    ...variables,
    signal,
  });

/**
 * Update the properties of a set of data scopes
 */
export const useUpdateDataScopes = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Responses.DataScopeListResponse,
      UpdateDataScopesError,
      UpdateDataScopesVariables
    >,
    'mutationFn'
  >
) => {
  const { fetcherOptions } = useDataQualityContext();
  return reactQuery.useMutation<
    Responses.DataScopeListResponse,
    UpdateDataScopesError,
    UpdateDataScopesVariables
  >(
    (variables: UpdateDataScopesVariables) =>
      fetchUpdateDataScopes({ ...fetcherOptions, ...variables }),
    options
  );
};

export type ListByIdsDataScopesPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
};

export type ListByIdsDataScopesError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: Responses.ErrorResponse;
}>;

export type ListByIdsDataScopesVariables = {
  body: Schemas.DataScopeListIdsRequest;
  pathParams?: ListByIdsDataScopesPathParams;
} & DataQualityContext['fetcherOptions'];

/**
 * Retrieve up to 100 data scopes by specifying their ids.
 */
export const fetchListByIdsDataScopes = (
  variables: ListByIdsDataScopesVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.DataScopeListResponse,
    ListByIdsDataScopesError,
    Schemas.DataScopeListIdsRequest,
    {},
    {},
    ListByIdsDataScopesPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/{dataSource}/datascopes/byids',
    method: 'post',
    ...variables,
    signal,
  });

/**
 * Retrieve up to 100 data scopes by specifying their ids.
 */
export const useListByIdsDataScopes = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Responses.DataScopeListResponse,
      ListByIdsDataScopesError,
      ListByIdsDataScopesVariables
    >,
    'mutationFn'
  >
) => {
  const { fetcherOptions } = useDataQualityContext();
  return reactQuery.useMutation<
    Responses.DataScopeListResponse,
    ListByIdsDataScopesError,
    ListByIdsDataScopesVariables
  >(
    (variables: ListByIdsDataScopesVariables) =>
      fetchListByIdsDataScopes({ ...fetcherOptions, ...variables }),
    options
  );
};

export type ListLatestRuleRunsPathParams = {
  /**
   * The project name.
   *
   * @example publicdata
   */
  project?: string;
  /**
   * The external id of the data source.
   */
  dataSourceId?: string;
};

export type ListLatestRuleRunsQueryParams = {
  /**
   * Cursor for paging through results.
   *
   * @example 4zj0Vy2fo0NtNMb229mI9r1V3YG5NBL752kQz1cKtwo
   */
  cursor?: string;
};

export type ListLatestRuleRunsError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: Responses.ErrorResponse;
}>;

export type ListLatestRuleRunsVariables = {
  pathParams?: ListLatestRuleRunsPathParams;
  queryParams?: ListLatestRuleRunsQueryParams;
} & DataQualityContext['fetcherOptions'];

/**
 * List the latest rule runs for each rule defined in the current data source.
 */
export const fetchListLatestRuleRuns = (
  variables: ListLatestRuleRunsVariables,
  signal?: AbortSignal
) =>
  dataQualityFetch<
    Responses.RuleRunListResponse,
    ListLatestRuleRunsError,
    undefined,
    {},
    ListLatestRuleRunsQueryParams,
    ListLatestRuleRunsPathParams
  >({
    url: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/ruleruns/latest',
    method: 'get',
    ...variables,
    signal,
  });

/**
 * List the latest rule runs for each rule defined in the current data source.
 */
export const useListLatestRuleRuns = <TData = Responses.RuleRunListResponse>(
  variables: ListLatestRuleRunsVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<
      Responses.RuleRunListResponse,
      ListLatestRuleRunsError,
      TData
    >,
    'queryKey' | 'queryFn'
  >
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } =
    useDataQualityContext(options);
  return reactQuery.useQuery<
    Responses.RuleRunListResponse,
    ListLatestRuleRunsError,
    TData
  >(
    queryKeyFn({
      path: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/ruleruns/latest',
      operationId: 'listLatestRuleRuns',
      variables,
    }),
    ({ signal }) =>
      fetchListLatestRuleRuns({ ...fetcherOptions, ...variables }, signal),
    {
      ...options,
      ...queryOptions,
    }
  );
};

export type QueryOperation =
  | {
      path: '/api/v1/projects/{project}/data-validation/datasources';
      operationId: 'listDataSources';
      variables: ListDataSourcesVariables;
    }
  | {
      path: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rulesets';
      operationId: 'listRulesets';
      variables: ListRulesetsVariables;
    }
  | {
      path: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rulesets/byids';
      operationId: 'listByIdsRulesets';
      variables: ListByIdsRulesetsVariables;
    }
  | {
      path: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rulesets/{rulesetId}/rules';
      operationId: 'listRules';
      variables: ListRulesVariables;
    }
  | {
      path: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/rules';
      operationId: 'listAllRules';
      variables: ListAllRulesVariables;
    }
  | {
      path: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/datascopes';
      operationId: 'listDataScopes';
      variables: ListDataScopesVariables;
    }
  | {
      path: '/api/v1/projects/{project}/data-validation/datasources/{dataSourceId}/ruleruns/latest';
      operationId: 'listLatestRuleRuns';
      variables: ListLatestRuleRunsVariables;
    };
