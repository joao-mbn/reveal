import React, { useEffect, useMemo, useState } from 'react';
import {
  LineChart,
  LineChartProps,
  Loader,
  RangePicker,
  SpacedRow,
} from '@data-exploration-components/components';
import { useQuery } from 'react-query';
import { useSDK } from '@cognite/sdk-provider';
import { baseCacheKey } from '@cognite/sdk-react-query-hooks';
import dayjs from 'dayjs';
import { DateRangeProps, ResourceTypes } from 'types';
import { OptionType, Select } from '@cognite/cogs.js';
import { ParentSize } from '@visx/responsive';

import styled from 'styled-components';
import { DatapointAggregates, Datapoints } from '@cognite/sdk';
import { useMetrics } from 'hooks/useMetrics';
import { DATA_EXPLORATION_COMPONENT } from 'constants/metrics';

export type TIME_OPTION_KEY =
  | '10Y'
  | '5Y'
  | '2Y'
  | '1Y'
  | '1M'
  | '1W'
  | '1D'
  | '12H'
  | '6H'
  | '1H'
  | '15M';

export const TIME_SELECT: {
  [key in TIME_OPTION_KEY]: {
    label: string;
    getTime: () => [Date, Date];
  };
} = {
  '10Y': {
    label: '10Y',
    getTime: () => [
      dayjs().subtract(10, 'years').startOf('seconds').toDate(),
      dayjs().startOf('seconds').toDate(),
    ],
  },
  '5Y': {
    label: '5Y',
    getTime: () => [
      dayjs().subtract(5, 'years').startOf('seconds').toDate(),
      dayjs().startOf('seconds').toDate(),
    ],
  },
  '2Y': {
    label: '2Y',
    getTime: () => [
      dayjs().subtract(2, 'years').startOf('seconds').toDate(),
      dayjs().startOf('seconds').toDate(),
    ],
  },
  '1Y': {
    label: '1Y',
    getTime: () => [
      dayjs().subtract(1, 'years').startOf('seconds').toDate(),
      dayjs().startOf('seconds').toDate(),
    ],
  },
  '1M': {
    label: '1M',
    getTime: () => [
      dayjs().subtract(1, 'months').startOf('seconds').toDate(),
      dayjs().startOf('seconds').toDate(),
    ],
  },
  '1W': {
    label: '1W',
    getTime: () => [
      dayjs().subtract(7, 'days').startOf('seconds').toDate(),
      dayjs().startOf('seconds').toDate(),
    ],
  },
  '1D': {
    label: '1D',
    getTime: () => [
      dayjs().subtract(1, 'days').startOf('seconds').toDate(),
      dayjs().startOf('seconds').toDate(),
    ],
  },
  '12H': {
    label: '12H',
    getTime: () => [
      dayjs().subtract(12, 'hours').startOf('seconds').toDate(),
      dayjs().startOf('seconds').toDate(),
    ],
  },
  '6H': {
    label: '6H',
    getTime: () => [
      dayjs().subtract(6, 'hours').startOf('seconds').toDate(),
      dayjs().startOf('seconds').toDate(),
    ],
  },
  '1H': {
    label: '1H',
    getTime: () => [
      dayjs().subtract(1, 'hours').startOf('seconds').toDate(),
      dayjs().startOf('seconds').toDate(),
    ],
  },
  '15M': {
    label: '15M',
    getTime: () => [
      dayjs().subtract(15, 'minutes').startOf('seconds').toDate(),
      dayjs().startOf('seconds').toDate(),
    ],
  },
};

export type TimeseriesChartProps = {
  timeseriesId: number;
  height?: number;
  numberOfPoints?: number;
  showContextGraph?: boolean;
  timeOptions?: TIME_OPTION_KEY[];
  defaultOption?: TIME_OPTION_KEY;
  cacheToDate?: boolean;
  showCustomRangePicker?: boolean;
  enableTooltipPreview?: boolean;
  disableStep?: boolean;
  disabled?: boolean;
  onDataFetched?: (data?: DatapointAggregates | Datapoints) => void;
} & Omit<
  LineChartProps,
  | 'values'
  | 'focusedValues'
  | 'zoom'
  | 'scaleType'
  | 'onZoomChanged'
  | 'width'
  | 'height'
> &
  DateRangeProps;

export const TimeseriesChart = ({
  timeseriesId,
  height,
  numberOfPoints = 20,
  timeOptions = ['15M', '1H', '6H', '12H', '1D', '1M', '1Y', '2Y', '5Y', '10Y'],
  defaultOption,
  cacheToDate = true,
  showCustomRangePicker = false,
  dateRange,
  onDateRangeChange,
  disabled = false,
  disableStep = false,
  onDataFetched,
  ...otherProps
}: TimeseriesChartProps) => {
  const sdk = useSDK();
  const [timePeriod, setTimePeriod] = useState<TIME_OPTION_KEY | undefined>(
    defaultOption || (dateRange ? undefined : timeOptions[0])
  );
  const trackUsage = useMetrics();
  const resourceType = ResourceTypes.TimeSeries;

  const [presetZoom, setPresetZoomDomain] = useState<[Date, Date]>(
    dateRange || TIME_SELECT[timePeriod || timeOptions[0]].getTime()
  );

  const timeSelectOptions = useMemo(() => {
    return timeOptions.map((key) => ({ label: key, value: key }));
  }, [timeOptions]);

  useEffect(() => {
    if (dateRange) {
      setPresetZoomDomain(dateRange);
      setTimePeriod(undefined);
    }
  }, [dateRange]);

  useEffect(() => {
    if (!timePeriod && onDateRangeChange) {
      onDateRangeChange(presetZoom);
    }
  }, [onDateRangeChange, presetZoom, timePeriod]);

  useEffect(() => {
    if (timePeriod) {
      setPresetZoomDomain(TIME_SELECT[timePeriod].getTime());
    }
  }, [timePeriod, cacheToDate]);

  const {
    data: overallData,
    isFetched,
    isFetching,
  } = useQuery(
    [
      ...baseCacheKey('timeseries'),
      'datapoints',
      timeseriesId,
      {
        start: presetZoom[0].getTime(),
        end: presetZoom[1].getTime(),
      },
      calculateGranularity(
        presetZoom.map((el) => el.valueOf()),
        numberOfPoints
      ),
      numberOfPoints,
      ['count', 'min', 'max', 'average'],
    ],
    async () =>
      (
        await sdk.datapoints.retrieve({
          items: [{ id: timeseriesId }],
          end: presetZoom[1].valueOf(),
          start: presetZoom[0].valueOf(),
          granularity: calculateGranularity(
            presetZoom.map((el) => el.valueOf()),
            numberOfPoints
          ),
          limit: numberOfPoints,
          aggregates: ['count', 'min', 'max', 'average'],
        })
      )[0],
    {
      staleTime: Infinity,
      enabled: !disabled,
      onSuccess: (data) => onDataFetched?.(data),
      onError: () => onDataFetched?.(undefined),
    }
  );

  return (
    <>
      <ParentSize>
        {(parent) =>
          isFetching && !isFetched ? (
            <div
              style={{
                height: height || parent.height,
                width: parent.width,
              }}
            >
              <Loader />
            </div>
          ) : (
            <LineChart
              width={parent.width}
              height={height || parent.height - 30}
              values={((overallData?.datapoints ?? []) as any[]).filter(
                (el) => el.average !== undefined
              )}
              domain={presetZoom}
              {...otherProps}
            />
          )
        }
      </ParentSize>

      <SpacedRow>
        {!disableStep && timeOptions.length > 1 && (
          <StyledSelect
            title="Step:"
            value={
              timePeriod && {
                label: timePeriod,
                value: timePeriod,
              }
            }
            options={timeSelectOptions}
            onChange={({ value }: OptionType<TIME_OPTION_KEY>) => {
              if (value) {
                setTimePeriod(value);
              }
              trackUsage(DATA_EXPLORATION_COMPONENT.SELECT.TIME_PERIOD, {
                resourceType,
                value,
              });
            }}
            width={250}
          />
        )}
        {showCustomRangePicker && (
          <RangePicker
            buttonProps={{
              type: timePeriod ? 'secondary' : 'primary',
              variant: 'outline',
            }}
            initialRange={presetZoom}
            onRangeChanged={(range) => {
              setTimePeriod(undefined);
              setPresetZoomDomain(range);
              trackUsage(DATA_EXPLORATION_COMPONENT.SELECT.TIME_RANGE, {
                resourceType,
                value: range,
              });
            }}
          />
        )}
      </SpacedRow>
    </>
  );
};

/**
 * Calculates the `granularity` for a timeseries request
 *
 * @param domain Domain [utc int, utc int]
 * @param pps points to show
 */
export const calculateGranularity = (domain: number[], pps: number) => {
  const diff = domain[1] - domain[0];
  for (let i = 1; i <= 60; i += 1) {
    const points = diff / (1000 * i);
    if (points < pps) {
      return `${i === 1 ? '' : i}s`;
    }
  }
  for (let i = 1; i <= 60; i += 1) {
    const points = diff / (1000 * 60 * i);
    if (points < pps) {
      return `${i === 1 ? '' : i}m`;
    }
  }
  for (let i = 1; i < 24; i += 1) {
    const points = diff / (1000 * 60 * 60 * i);
    if (points < pps) {
      return `${i === 1 ? '' : i}h`;
    }
  }
  for (let i = 1; i < 100; i += 1) {
    const points = diff / (1000 * 60 * 60 * 24 * i);
    if (points < pps) {
      return `${i === 1 ? '' : i}day`;
    }
  }
  return 'day';
};

const StyledSelect = styled(Select)`
  .cogs-select__menu {
    height: 200px;
  }
`;
