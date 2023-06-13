import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSDK } from '@cognite/sdk-provider';

import { Toast } from '../../../components/Toast';
import { updateFileLabels } from '../../api';
import { DOCUMENTS_KEYS } from '../../constants';
import { FilesApiError, LabelFileUpdate } from '../../types';

export const useUpdateFileLabelsMutate = (action: 'add' | 'remove') => {
  const sdk = useSDK();
  const queryClient = useQueryClient();

  return useMutation(
    ({ label, fileIds }: LabelFileUpdate) =>
      updateFileLabels(sdk, action, label, fileIds),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(DOCUMENTS_KEYS.documents());
        Toast.info({
          title: 'Updating file labels',
          message:
            'Changing file labels might take some time to take effect in the backend...',
          autoClose: 10_000,
        });
      },
      onError: ({ errors }: FilesApiError, { label: { externalId } }) => {
        errors.forEach(({ message, status }) => {
          Toast.error({
            title: `Error while updating label ("${externalId}") in files`,
            message,
            status,
          });
        });
      },
    }
  );
};