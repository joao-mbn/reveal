import { Unit } from 'convert-units';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import head from 'lodash/head';
import last from 'lodash/last';
import set from 'lodash/set';
import {
  endOf,
  getDateByMatchingRegex,
  isValidDate,
  startOf,
} from 'utils/date';
import {
  changeUnit,
  changeUnits as changeSomeUnits,
  changeUnitTo,
  UnitConverterItem,
} from 'utils/units';

import { SpudDateLimits, WaterDepthLimits } from '@cognite/sdk-wells-v2';

import { FEET, UserPreferredUnit } from 'constants/units';
import { convertToClosestInteger } from 'pages/authorized/search/well/inspect/modules/events/common';

const DEFAULT_MIN_LIMIT = 0;
const DEFAULT_MAX_LIMIT = 0;

/**
 * @deprecated - this is mega unsafe - use direct key accessor instead
 */
export const convertToFixedDecimal = <Item>(
  dataObj: Item,
  accessors: string[]
): Item => {
  const copiedEvent = { ...dataObj };
  accessors.forEach((accessor) => {
    const numValue = Number(get(dataObj, accessor));
    if (!Number.isNaN(numValue)) {
      set(
        copiedEvent as unknown as Record<string, unknown>,
        accessor,
        numValue.toFixed(2)
      );
    }
  });
  return copiedEvent;
};

export const convertTimeStampsToDates = <Item>(
  dataObj: Item,
  accessors: string[]
) => {
  const copiedEvent = { ...dataObj };
  accessors.forEach((accessor) => {
    const date = get(dataObj, accessor);
    set(
      copiedEvent as unknown as Record<string, unknown>,
      accessor,
      getDateByMatchingRegex(date)
    );
  });
  return copiedEvent;
};

export const convertObject = <Item>(object: Item) => {
  let clonedObj = cloneDeep(object);
  const allFunctions = {
    toFixedDecimals: (accessors: string[]) => {
      clonedObj = convertToFixedDecimal(clonedObj, accessors);
      return allFunctions;
    },
    toClosestInteger: (accessors: string[]) => {
      clonedObj = convertToClosestInteger(clonedObj, accessors);
      return allFunctions;
    },
    toDate: (accessors: string[]) => {
      clonedObj = convertTimeStampsToDates(clonedObj, accessors);
      return allFunctions;
    },
    changeUnits: (unitAccessors: UnitConverterItem[]) => {
      clonedObj = changeSomeUnits(clonedObj, unitAccessors);
      return allFunctions;
    },
    add: (extraValues: { [key: string]: any }) => {
      clonedObj = { ...clonedObj, ...extraValues };
      return allFunctions;
    },
    get: () => clonedObj,
  };
  return allFunctions;
};

export const getWaterDepthLimitsInUnit = (
  waterDepthLimits: WaterDepthLimits,
  preferredUnit: string
) => {
  const config = {
    accessor: 'value',
    fromAccessor: 'unit',
    to: preferredUnit,
  };
  const min = changeUnit(waterDepthLimits.min, config).value;
  const max = changeUnit(waterDepthLimits.max, config).value;
  return [Math.floor(min), Math.ceil(max)];
};

export const getRangeLimitInUnit = (
  limitMin: number,
  limitMax: number,
  preferredUnit: UserPreferredUnit
) => {
  if (preferredUnit === FEET) return [limitMin, limitMax];
  return [
    Math.floor(changeUnitTo(limitMin, FEET, preferredUnit) || 0),
    Math.ceil(changeUnitTo(limitMax, FEET, preferredUnit) || 0),
  ];
};

export const getLimitRangeInUserPreferredUnit = (
  limitRange: number[],
  unit: UserPreferredUnit
) => {
  return getRangeLimitInUnit(
    head(limitRange) || DEFAULT_MIN_LIMIT,
    last(limitRange) || DEFAULT_MAX_LIMIT,
    unit
  );
};

export const processSpudDateLimits = (spudDateLimits: SpudDateLimits) => {
  const minDate = spudDateLimits.min;
  const maxDate = spudDateLimits.max;

  return [
    isValidDate(minDate) ? startOf(minDate, 'day') : undefined,
    isValidDate(maxDate) ? endOf(maxDate, 'day') : undefined,
  ];
};

export const toBooleanMap = (list: (number | string)[], status = true) =>
  list.reduce(
    (booleanMap, key) => ({
      ...booleanMap,
      [key]: status,
    }),
    {}
  );

export const getFilterRangeInUserPreferredUnit = (
  range: [number, number],
  currentUnit: Unit,
  userPreferredUnit: UserPreferredUnit
) => {
  const [min, max] = range;

  if (currentUnit === userPreferredUnit) {
    return [Math.floor(min), Math.ceil(max)];
  }

  return [
    Math.floor(
      changeUnitTo(min, currentUnit, userPreferredUnit) || DEFAULT_MIN_LIMIT
    ),
    Math.ceil(
      changeUnitTo(max, currentUnit, userPreferredUnit) || DEFAULT_MAX_LIMIT
    ),
  ];
};
