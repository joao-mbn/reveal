import { useDispatch, useSelector } from 'react-redux';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Model3D } from '@cognite/sdk';
import { HttpError, InternalId } from '@cognite/sdk-core/dist/src';
import { useSDK } from '@cognite/sdk-provider';

import { setSelectedModels } from '../../store/modules/App';
import { AppState } from '../../store/modules/App/types';
import { fireErrorNotification, QUERY_KEY } from '../../utils';

export function useDeleteModelMutation() {
  const queryClient = useQueryClient();
  const sdk = useSDK();
  const deleteModel = async ({ id }: InternalId): Promise<void> => {
    await sdk.models3D.delete([{ id }]);
  };
  const dispatch = useDispatch();
  const appState = useSelector((state: any) => state.app) as AppState;

  return useMutation<void, HttpError, InternalId, Model3D[]>(deleteModel, {
    onMutate: ({ id }: InternalId) => {
      queryClient.cancelQueries(QUERY_KEY.MODELS, { exact: true });

      // Snapshot the previous value
      const previousModels = queryClient.getQueryData<Model3D[]>(
        QUERY_KEY.MODELS
      );

      // Optimistically update to the new value
      queryClient.setQueryData<Model3D[]>(QUERY_KEY.MODELS, (old) =>
        (old || []).filter((model) => {
          return model.id !== id;
        })
      );

      return previousModels || [];
    },
    onError: (error, _, snapshotValue) => {
      queryClient.setQueryData(QUERY_KEY.MODELS, snapshotValue);
      fireErrorNotification({
        error,
        message: 'Error: Could not delete a model',
      });
    },
    onSuccess: (_, { id }: InternalId) => {
      queryClient.invalidateQueries(QUERY_KEY.MODELS, { exact: true });
      setSelectedModels(
        appState.selectedModels.filter((modelId) => modelId !== id)
      )(dispatch);
    },
  });
}
