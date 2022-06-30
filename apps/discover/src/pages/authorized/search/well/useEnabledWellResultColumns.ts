import { DoglegSeverityUnitInternal } from 'domain/wells/trajectory/internal/types';

import { UserPreferredUnit } from 'constants/units';
import { useUserPreferencesMeasurement } from 'hooks/useUserPreferences';

import { getVisibleWellColumns } from './getVisibleWellColumns';
import { useEnabledWellResultColumnNames } from './useEnabledWellResultColumnNames';

export const useEnabledWellResultColumns = (
  doglegUnit?: DoglegSeverityUnitInternal
) => {
  const enabledWellColumnNames = useEnabledWellResultColumnNames();
  const { data: userPreferredUnit } = useUserPreferencesMeasurement();
  const visibleWellColumns = getVisibleWellColumns({
    unit: userPreferredUnit || UserPreferredUnit.FEET,
    enabled: enabledWellColumnNames,
    doglegUnit,
  });

  return visibleWellColumns;
};
