import { useQuery, useQueryClient } from '@tanstack/react-query';

import sdk from '@cognite/cdf-sdk-singleton';
import { HttpError } from '@cognite/sdk';

import { fireErrorNotification } from '../../utils';

async function fetchFile(fileId: number): Promise<string> {
  const arraybuffers = await sdk.files3D.retrieve(fileId);
  const arrayBufferView = new Uint8Array(arraybuffers);
  const blob = new Blob([arrayBufferView]);
  return window.URL.createObjectURL(blob);
}

export function useThumbnailFileQuery(fileId: number) {
  const queryKey = ['file', fileId];
  const queryClient = useQueryClient();
  return useQuery<string, HttpError>(queryKey, () => fetchFile(fileId), {
    staleTime: Infinity,
    initialData: () => queryClient.getQueryData(queryKey),
    refetchOnMount: false,
    onError: (error) =>
      fireErrorNotification({ error, message: 'Could not fetch thumbnail' }),
  });
}