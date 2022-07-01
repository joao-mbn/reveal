import { getWellSDKClient } from 'domain/wells/utils/authenticate';
import { convertToIdentifiers } from 'domain/wells/utils/convertToIdentifiers';

import { fetchAllCursors } from 'utils/fetchAllCursors';

import { DepthMeasurement } from '@cognite/sdk-wells-v3';

import { GetDepthMeasurementsProps } from '../types';

export const getDepthMeasurements = async ({
  wellboreIds,
  measurementTypes,
  options,
}: GetDepthMeasurementsProps) => {
  return fetchAllCursors<DepthMeasurement>({
    signal: options?.signal,
    action: getWellSDKClient().measurements.list,
    actionProps: {
      filter: {
        wellboreIds: convertToIdentifiers(wellboreIds),
        measurementTypes,
      },
    },
  });
};
