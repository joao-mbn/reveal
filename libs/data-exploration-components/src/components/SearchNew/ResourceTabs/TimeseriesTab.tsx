import { useTimeseriesAggregateCountQuery } from '@data-exploration-lib/domain-layer';
import { getChipRightPropsForResourceCounter } from '../../../utils';

import { ResourceTabProps } from './types';
import { CounterTab } from './elements';
import { useGetSearchConfigFromLocalStorage } from '@data-exploration-lib/core';

export const TimeseriesTab = ({ query, filter, ...rest }: ResourceTabProps) => {
  const timeseriesSearchConfig =
    useGetSearchConfigFromLocalStorage('timeSeries');
  const { data, isLoading } = useTimeseriesAggregateCountQuery(
    {
      timeseriesFilters: filter,
      query,
    },
    undefined,
    timeseriesSearchConfig
  );
  const chipRightProps = getChipRightPropsForResourceCounter(
    data?.count || 0,
    isLoading
  );

  return <CounterTab label="Time series" {...chipRightProps} {...rest} />;
};