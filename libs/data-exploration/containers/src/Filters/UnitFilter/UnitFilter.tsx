import * as React from 'react';

import { useTimeseriesFilterOptions } from '@data-exploration-lib/domain-layer';
import { MultiSelectFilter } from '../MultiSelectFilter';
import { BaseFilter, CommonFilterProps, MultiSelectOptionType } from '../types';
import { transformOptionsForMultiselectFilter } from '../utils';
import {
  DATA_EXPLORATION_COMPONENT,
  InternalTimeseriesFilters,
  useDebouncedState,
  useMetrics,
} from '@data-exploration-lib/core';
import { InputActionMeta } from 'react-select';

interface BaseUnitFilterProps<TFilter>
  extends BaseFilter<TFilter>,
    CommonFilterProps {
  value?: string | string[];
  onChange?: (newSources: string | string[]) => void;
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void;
  addNilOption?: boolean;
  query?: string;
}

export interface UnitFilterProps<TFilter> extends BaseUnitFilterProps<TFilter> {
  options: MultiSelectOptionType<string>[];
}

export function UnitFilter<TFilter>({
  options,
  onChange,
  value,
  ...rest
}: UnitFilterProps<TFilter>) {
  const trackUsage = useMetrics();

  const handleChange = (
    units: {
      label: string;
      value: string;
    }[]
  ) => {
    onChange?.(units.map((unit) => unit.value));
    trackUsage(DATA_EXPLORATION_COMPONENT.SELECT.AGGREGATE_FILTER, {
      value: units,
      title: 'Unit Filter',
    });
  };

  return (
    <MultiSelectFilter<string>
      {...rest}
      label="Unit"
      value={value ? transformOptionsForMultiselectFilter(value) : undefined}
      options={options}
      onChange={(_, units) => handleChange(units)}
    />
  );
}

const TimeseriesUnitFilter = ({
  query,
  filter,
  ...props
}: BaseUnitFilterProps<InternalTimeseriesFilters>) => {
  const [prefix, setPrefix] = useDebouncedState<string>();
  const { options, isLoading, isError } = useTimeseriesFilterOptions({
    property: 'unit',
    query,
    prefix,
    filter,
  });

  return (
    <UnitFilter
      {...props}
      onInputChange={setPrefix}
      isError={isError}
      isLoading={isLoading}
      options={options}
    />
  );
};

UnitFilter.Timeseries = TimeseriesUnitFilter;