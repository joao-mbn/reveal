import { useQuery } from '@tanstack/react-query';

import { getProjectInfo } from '@cognite/react-container';

import { NPT_LEGEND_KEY } from 'constants/react-query';
import { useJsonHeaders } from 'hooks/useJsonHeaders';

import { nptListLegend } from '../../service/network/nptListLegend';
import { WellLegendNptType } from '../types';

const useNptLegendQuery = (type: WellLegendNptType) => {
  const headers = useJsonHeaders({}, true);
  const [project] = getProjectInfo();

  return useQuery(NPT_LEGEND_KEY.lists(type), () =>
    nptListLegend(headers, project, type)
  );
};

export const useNptLegendCodeQuery = () => {
  return useNptLegendQuery(WellLegendNptType.Code);
};

export const useNptLegendDetailCodeQuery = () => {
  return useNptLegendQuery(WellLegendNptType.DetailCode);
};
