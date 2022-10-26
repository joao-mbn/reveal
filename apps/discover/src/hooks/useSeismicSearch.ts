import { SavedSearchQuery } from 'domain/savedSearches/types';

import { useDispatch } from 'react-redux';

import { useQueryClient } from '@tanstack/react-query';
import isUndefined from 'lodash/isUndefined';
import { FetchHeaders } from 'utils/fetch';

import { seismicSearchActions } from 'modules/seismicSearch/actions';
import { prefetchSurveys } from 'modules/seismicSearch/hooks';

export const useSeismicSearch = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const doSeismicSearch = (
    searchQuery: SavedSearchQuery,
    headers: FetchHeaders
  ) => {
    if (!isUndefined(searchQuery.phrase) && searchQuery.phrase === '') {
      dispatch<any>(seismicSearchActions.resetDataSearch());
    }
    prefetchSurveys(headers, queryClient);
  };

  return doSeismicSearch;
};
