import { useEffect } from 'react';

import {
  DataSourceDto,
  DataSourceDraft,
  useCreateDataSources,
  useListDataSources,
} from '@data-quality/api/codegen';
import { DataModelVersion } from '@fusion/data-modeling';
import { Notification } from '@platypus-app/components/Notification/Notification';
import { useTranslation } from '@platypus-app/hooks/useTranslation';
import { useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

import { useAccessControl } from './useAccessControl';
import { useDataModel } from './useDataModel';

/** Load a data source by using the data model id, data model space and data model version.
 *
 * If there is no data source matching the given params, then create a new data source. */
export const useLoadDataSource = (): {
  dataSource?: DataSourceDto;
  error: any;
  isLoading: boolean;
} => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('useLoadDataSource');

  const { dataModel, isLoading: isLoadingDataModel } = useDataModel();

  const { canWriteDataValidation, isLoading: isLoadingAccess } =
    useAccessControl();

  const {
    data: dataSourcesData,
    error: dataSourcesError,
    isLoading: isLoadingDataSources,
    isRefetching: isRefetchingDataSources,
    refetch,
  } = useListDataSources({});

  const {
    isLoading: isLoadingCreateDataSource,
    mutateAsync: createDataSourceMutation,
    status: createDataSourceStatus,
  } = useCreateDataSources({ mutationKey: ['createDataSource'] });

  const isLoading =
    isLoadingDataModel ||
    isLoadingAccess ||
    isLoadingDataSources ||
    isRefetchingDataSources ||
    isLoadingCreateDataSource;

  const dataSource = findDataSource(dataSourcesData?.items, dataModel);

  // This effect can be triggered concurrently by multiple components using 'useLoadDataSource' hook.
  // Therefore, it requires unconventional handling without using a dependency array.
  useEffect(() => {
    // Start looking for a data source when we have the list of all datasources
    if (
      isLoadingAccess ||
      isLoadingDataSources ||
      dataSourcesError ||
      isRefetchingDataSources
    )
      return;

    // Try to find an existing data source in the fetched list
    const existingDataSource = findDataSource(
      dataSourcesData?.items,
      dataModel
    );
    if (existingDataSource) return;

    // Check if the createDataSource mutation is in use
    const creatingDataSource = queryClient.isMutating({
      mutationKey: ['createDataSource'],
    });
    if (creatingDataSource) return;

    // User needs all necessary capabilities to create a data source
    // DQ main page displays an error if user has no access to create a data source
    if (!canWriteDataValidation) return;

    // No data source found, try to create it
    try {
      if (createDataSourceStatus === 'idle') {
        const newDataSource: DataSourceDraft = {
          externalId: uuidv4(),
          dataModelId: dataModel.externalId,
          dataModelSpaceId: dataModel.space,
          dataModelVersion: dataModel.version,
        };

        createDataSourceMutation(
          {
            body: {
              items: [newDataSource],
            },
          },
          { onSuccess: () => refetch() }
        );
      }
    } catch (err: any) {
      Notification({
        type: 'error',
        message: t(
          'data_quality_not_found_ds',
          'Something went wrong. The data source could not be loaded.'
        ),
        errors: JSON.stringify(err?.stack?.error),
      });
    }
  });

  return { dataSource, error: dataSourcesError, isLoading };
};

/** Looks for a data source that matches the given data model id, data mode space and data model version in a list of data sources. */
const findDataSource = (
  dataSources: DataSourceDto[] = [],
  dataModel: DataModelVersion
) => {
  const { externalId, space, version } = dataModel;

  return dataSources.find(
    (ds) =>
      ds.dataModelId === externalId &&
      ds.dataModelSpaceId === space &&
      ds.dataModelVersion === version
  );
};
