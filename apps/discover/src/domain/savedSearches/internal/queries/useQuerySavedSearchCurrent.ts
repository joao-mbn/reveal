import { SAVED_SEARCHES_CURRENT_KEY } from 'domain/savedSearches/constants';
import { getSavedSearch } from 'domain/savedSearches/service/network/getSavedSearch';

import { useQuery } from '@tanstack/react-query';

import { getProjectInfo } from '@cognite/react-container';

import { SAVED_SEARCHES_QUERY_KEY_CURRENT } from 'constants/react-query';
import { useJsonHeaders } from 'hooks/useJsonHeaders';

export const useQuerySavedSearchCurrent = () => {
  const headers = useJsonHeaders({}, true);
  const [tenant] = getProjectInfo();

  return useQuery(
    SAVED_SEARCHES_QUERY_KEY_CURRENT,
    () => getSavedSearch(SAVED_SEARCHES_CURRENT_KEY, headers, tenant),
    {
      enabled: true,
      retry: false,
    }
  );
};
