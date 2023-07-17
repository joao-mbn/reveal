import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';

/* eslint-disable no-nested-ternary */
import dayjs from 'dayjs';
import range from 'lodash/range';

import { Button, ButtonProps } from '@cognite/cogs.js';

import {
  DatePickerButtonWrapper,
  MonthSelect,
  MonthWrapper,
  OptionStyle,
  SpacedRowHeader,
  YearSelect,
  YearWrapper,
} from './elements';

export type StartEndRange = {
  type: 'StartEnd';
  startDate: Date;
  endDate: Date;
};
export type PivotRange = {
  type: 'Pivot';
  date: Date;
  direction: 'before' | 'after' | 'both';
  amount: number | string;
  unit: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
};

export type DatePickerRange = StartEndRange | PivotRange;

export const determinePivotRange = (
  startDate: Date,
  endDate: Date
): PivotRange => {
  const startDay = dayjs(startDate);
  const endDay = dayjs(endDate);

  let amount = 0;
  let unit: PivotRange['unit'] = 'year';
  const units: PivotRange['unit'][] = [
    'year',
    'month',
    'week',
    'day',
    'hour',
    'minute',
  ];
  units.some((item) => {
    amount = endDay.diff(startDay, item);
    unit = item;
    if (amount !== 0) {
      return true;
    }
    return false;
  });

  return {
    type: 'Pivot',
    date: endDate,
    direction: 'before',
    amount,
    unit,
  };
};

export const getPivotRangeAsDates = ({
  date,
  direction,
  amount,
  unit,
}: PivotRange): [Date, Date] => {
  const amountInNumber = Number(amount);
  switch (direction) {
    case 'before': {
      return [dayjs(date).subtract(amountInNumber, unit).toDate(), date];
    }
    case 'after': {
      return [date, dayjs(date).add(amountInNumber, unit).toDate()];
    }
  }
  return [
    dayjs(date).subtract(amountInNumber, unit).toDate(),
    dayjs(date).add(amountInNumber, unit).toDate(),
  ];
};

export interface DatePickerInputProps
  extends Omit<ButtonProps, 'ref' | 'alignVertically'> {
  date: Date;
  onDateChange: (_date: Date) => void;
}
export const DatePickerInput = ({
  date,
  onDateChange,
  ...props
}: {
  date: Date;
  onDateChange: (_date: Date) => void;
} & Omit<ButtonProps, 'ref' | 'alignVertically'>) => (
  <DatePickerButtonWrapper icon="Calendar" type="tertiary" {...props}>
    <ReactDatePicker
      open={false}
      dateFormat="yyyy-MM-dd HH:mm"
      onChange={(value) => onDateChange(value as Date)}
      selected={date}
      showTimeInput
    />
  </DatePickerButtonWrapper>
);

const years = range(dayjs(0).get('year'), dayjs().get('year') + 1, 1).reverse();
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const renderCustomHeader = (
  isYearDisabled: (currYear: number) => boolean = () => false,
  isMonthDisabled: (currYear: number, currentMonth: number) => boolean = () =>
    false
): ReactDatePickerProps['renderCustomHeader'] =>
  (({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => {
    const year = dayjs(date).get('year');
    const month = dayjs(date).get('month');
    return (
      <SpacedRowHeader>
        <Button
          type="ghost"
          size="small"
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          icon="ArrowLeft"
          aria-label="arrow-left"
        />
        <YearWrapper>
          <YearSelect
            data-testid="yearSelect"
            onChange={(value) => {
              changeYear(years[value.target.selectedIndex]);
            }}
            value={year}
            className="cogs-select__control"
          >
            {years.map((currentYear) => (
              <OptionStyle
                value={currentYear}
                disabled={isYearDisabled(currentYear)}
              >
                {currentYear}
              </OptionStyle>
            ))}
          </YearSelect>
        </YearWrapper>
        <MonthWrapper>
          <MonthSelect
            data-testid="monthSelect"
            onChange={(value) => {
              changeMonth(value.target.selectedIndex);
            }}
            value={months[month]}
            className="cogs-select__control"
          >
            {months.map((currentMonth, index) => (
              <OptionStyle
                value={currentMonth}
                disabled={isMonthDisabled(year, index)}
              >
                {currentMonth}
              </OptionStyle>
            ))}
          </MonthSelect>
        </MonthWrapper>
        <Button
          type="ghost"
          size="small"
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          icon="ArrowRight"
          aria-label="arrow-right"
        />
      </SpacedRowHeader>
    );
  }) as ReactDatePickerProps['renderCustomHeader'];
