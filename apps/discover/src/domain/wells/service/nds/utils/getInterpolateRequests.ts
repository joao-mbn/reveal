import { groupByWellbore } from 'domain/wells/dataLayer/wellbore/adapters/groupByWellbore';
import { toIdentifierWithMatchingId } from 'domain/wells/utils/toIdentifierWithMatchingId';

import compact from 'lodash/compact';
import { toDistanceUnit } from 'utils/units/toDistanceUnit';

import {
  DistanceUnitEnum,
  Nds,
  TrajectoryInterpolationRequest,
} from '@cognite/sdk-wells-v3';

import { UserPreferredUnit } from 'constants/units';

export const getInterpolateRequests = (
  ndsData: Nds[],
  userPreferredUnit?: UserPreferredUnit
): TrajectoryInterpolationRequest[] => {
  const groupedNdsData = groupByWellbore(ndsData);

  return Object.keys(groupedNdsData).map((wellboreMatchingId) => {
    const nds = groupedNdsData[wellboreMatchingId];
    const holeStartValues = compact(
      nds.map(({ holeStart }) => holeStart?.value)
    );
    const holeEndValues = compact(nds.map(({ holeEnd }) => holeEnd?.value));
    const ndsWithMeasurement = nds.find(
      ({ holeStart, holeEnd }) => holeStart || holeEnd
    );
    const measuredDepthUnit =
      ndsWithMeasurement?.holeStart?.unit ||
      ndsWithMeasurement?.holeEnd?.unit ||
      DistanceUnitEnum.Meter;

    return {
      wellboreId: toIdentifierWithMatchingId(wellboreMatchingId),
      measuredDepths: [...holeStartValues, ...holeEndValues],
      measuredDepthUnit: toDistanceUnit(measuredDepthUnit),
      trueVerticalDepthUnit:
        userPreferredUnit && toDistanceUnit(userPreferredUnit),
    };
  });
};
