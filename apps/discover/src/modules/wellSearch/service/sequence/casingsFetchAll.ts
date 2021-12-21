import { Wellbore, CasingSchematic } from '@cognite/sdk-wells-v3';

import { fetchAllCursors, FetchOptions } from '_helpers/fetchAllCursors';
import { toIdentifier } from 'modules/wellSearch/sdk/utils';
import { getWellSDKClient } from 'modules/wellSearch/sdk/v3';

export const casingsFetchAll = async ({
  wellboreIds,
  options,
}: {
  wellboreIds: Set<Wellbore['matchingId']>;
  options?: FetchOptions;
}) => {
  return fetchAllCursors<CasingSchematic>({
    signal: options?.signal,
    action: getWellSDKClient().casings.list,
    actionProps: {
      filter: { wellboreIds: Array.from(wellboreIds).map(toIdentifier) },
      //   limit: LIMIT,
    },
  });
};
