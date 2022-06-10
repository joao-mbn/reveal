import { feedback } from 'domain/feedback/service/network/service';
import { savedSearches } from 'domain/savedSearches/service/network/savedSearches';
import * as user from 'domain/user/service/network';

import { getDefaultHeader, getAuthHeaders } from '@cognite/react-container';

import { useIdToken as useIdTokenHook } from 'hooks/useIdToken';

import { projectConfig } from './projectConfig';
import { stats } from './stats';

export const useJsonHeaders = (
  extras: Record<string, string> = {},
  useIdToken = false
) => {
  const idToken = useIdTokenHook(useIdToken);

  return {
    ...getDefaultHeader(),
    ...getAuthHeaders({
      useIdToken: idToken,
    }),
    ...extras,
  };
};

export const discoverAPI = {
  feedback,
  projectConfig,
  savedSearches,
  stats,
  user,
};
