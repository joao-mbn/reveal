import isUndefined from 'lodash/isUndefined';
import pickBy from 'lodash/pickBy';
import { caseInsensitiveSort } from 'utils/sort';

import { DataObject } from 'components/charts/types';

import { LegendCheckboxState } from './types';

export const getLegendInitialCheckboxState = <T extends DataObject<T>>(
  data: T[],
  accessor: string
) => {
  const checkboxOptions = [
    ...new Set(data.map((dataElement) => dataElement[accessor])),
  ]
    .sort(caseInsensitiveSort)
    .filter((option) => !isUndefined(option));

  const checkboxState: LegendCheckboxState = {};

  checkboxOptions.forEach((option) => {
    checkboxState[option] = true;
  });

  return checkboxState;
};

export const getCheckedLegendCheckboxOptions = (
  checkboxState: LegendCheckboxState
) => Object.keys(pickBy(checkboxState));
