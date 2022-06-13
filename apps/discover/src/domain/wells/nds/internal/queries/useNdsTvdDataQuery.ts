import { useInterpolateTvdQuery } from 'domain/wells/trajectory/internal/queries/useInterpolateTvdQuery';
import { getKeyedTvdData } from 'domain/wells/trajectory/internal/utils/getKeyedTvdData';

import { Nds } from '@cognite/sdk-wells-v3';

import { useUserPreferencesMeasurement } from 'hooks/useUserPreferences';

import { getInterpolateRequests } from '../../service/utils/getInterpolateRequests';

export const useNdsTvdDataQuery = (ndsData: Nds[]) => {
  const { data: userPreferredUnit } = useUserPreferencesMeasurement();

  const interpolateRequests = getInterpolateRequests(
    ndsData,
    userPreferredUnit
  );

  const { data, ...rest } = useInterpolateTvdQuery(
    ndsData,
    interpolateRequests
  );

  if (!data) {
    return { data: {}, ...rest };
  }

  return {
    data: getKeyedTvdData(data),
    ...rest,
  };
};
