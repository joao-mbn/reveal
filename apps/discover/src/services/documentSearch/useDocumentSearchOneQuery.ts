import { useQuery } from 'react-query';

import { Document } from '@cognite/sdk-playground';

import { DOCUMENTS_QUERY_KEY } from 'constants/react-query';

import { getDocumentSearchById } from './getDocumentSearchById';

export const useDocumentSearchOneQuery = (id: Document['id']) => {
  return useQuery([DOCUMENTS_QUERY_KEY.SEARCH_ONE, id], () => {
    return getDocumentSearchById(id);
  });
};
