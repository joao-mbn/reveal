import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from 'react-query';

import merge from 'lodash/merge';

import { ProjectConfig } from '@cognite/discover-api-types';
import { getTenantInfo } from '@cognite/react-container';

import { showErrorMessage } from 'components/toast';
import { PROJECT_CONFIG_QUERY_KEY } from 'constants/react-query';
import { discoverAPI, getJsonHeaders } from 'modules/api/service';
import { Metadata } from 'pages/authorized/admin/projectConfig/types';

export function useProjectConfigUpdateMutate() {
  const headers = getJsonHeaders({}, true);
  const queryClient = useQueryClient();
  const [project] = getTenantInfo();

  return useMutation(
    (newProjectConfig: ProjectConfig) => {
      // optimistic update
      const oldProjectConfig = queryClient.getQueryData(
        PROJECT_CONFIG_QUERY_KEY.CONFIG
      );

      if (oldProjectConfig) {
        queryClient.setQueryData(PROJECT_CONFIG_QUERY_KEY.CONFIG, [
          merge({}, oldProjectConfig, newProjectConfig),
        ]);
      }

      return discoverAPI.projectConfig.update(
        newProjectConfig,
        headers,
        project
      );
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries(PROJECT_CONFIG_QUERY_KEY.CONFIG);
      },
      onError: (_error) => {
        queryClient.invalidateQueries(PROJECT_CONFIG_QUERY_KEY.CONFIG);
        showErrorMessage('Could not update project configuration.');
      },
    }
  );
}

export function useProjectConfigGetQuery(): UseQueryResult<ProjectConfig> {
  const headers = getJsonHeaders({}, true);
  const [project] = getTenantInfo();

  return useQuery(PROJECT_CONFIG_QUERY_KEY.CONFIG, () =>
    discoverAPI.projectConfig.getConfig(headers, project)
  );
}

export function useProjectConfigMetadataGetQuery(): UseQueryResult<Metadata> {
  const headers = getJsonHeaders({}, true);
  const [project] = getTenantInfo();

  return useQuery(PROJECT_CONFIG_QUERY_KEY.METADATA, () =>
    discoverAPI.projectConfig.getMetadata(headers, project)
  );
}

export function useProjectConfigDeleteQuery() {
  const headers = getJsonHeaders({}, true);
  const [project] = getTenantInfo();
  const queryClient = useQueryClient();

  return useMutation(
    () => {
      return discoverAPI.projectConfig.delete(headers, project);
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(PROJECT_CONFIG_QUERY_KEY.CONFIG);
      },
      onError: (_error) => {
        return queryClient.invalidateQueries(PROJECT_CONFIG_QUERY_KEY.CONFIG);
      },
    }
  );
}
