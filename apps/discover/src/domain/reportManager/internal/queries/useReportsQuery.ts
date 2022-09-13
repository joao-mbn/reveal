import { reportManagerAPI } from 'domain/reportManager/service/network/reportManagerAPI';

import { useQuery, useQueryClient, UseQueryResult } from 'react-query';

import { REPORTS_QUERY_KEY } from 'constants/react-query';

import { Report } from '../types';

export const useAllReportsQuery = (): UseQueryResult<Report[]> => {
  return useQuery(REPORTS_QUERY_KEY.ALL, () => reportManagerAPI.search({}));
};

export const useAllReportsInvalidate = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries(REPORTS_QUERY_KEY.ALL);
};
