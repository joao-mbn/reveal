import { Timeseries } from '@cognite/sdk';
import React, { useEffect, useMemo, useState } from 'react';
import { DateRangeProps, RelationshipLabels } from 'types';
import { NewTable as Table, TableProps } from 'components/ReactTable/Table';
import { TIME_SELECT } from 'containers';
import { TimeseriesChart } from '..';
import { Body } from '@cognite/cogs.js';
import { Column } from 'react-table';

export type TimeseriesWithRelationshipLabels = Timeseries & RelationshipLabels;

const visibleColumns = ['name', 'description', 'data', 'lastUpdatedTime'];

export const TimeseriesNewTable = ({
  dateRange: dateRangeProp,
  ...props
}: Omit<TableProps<TimeseriesWithRelationshipLabels>, 'columns'> &
  RelationshipLabels &
  DateRangeProps) => {
  const [dateRange, setDateRange] = useState(
    dateRangeProp || TIME_SELECT['1Y'].getTime()
  );

  useEffect(() => {
    if (dateRangeProp) {
      setDateRange(dateRangeProp);
    }
  }, [dateRangeProp]);

  const { data, ...rest } = props;
  const columns = useMemo(() => {
    const sparkLineColumn: Column<Timeseries & { data: any }> = {
      Header: 'Preview',
      accessor: 'data',
      width: 400,

      Cell: ({ row }) => {
        const timeseries = row.original;
        if (timeseries.isString) {
          return <Body level={2}>N/A for string time series</Body>;
        }
        return (
          <TimeseriesChart
            height={100}
            showSmallerTicks
            timeseriesId={timeseries.id}
            numberOfPoints={100}
            showAxis="horizontal"
            timeOptions={[]}
            showContextGraph={false}
            showPoints={false}
            enableTooltip={false}
            showGridLine="none"
            minRowTicks={2}
            enableTooltipPreview
            dateRange={dateRange}
            onDateRangeChange={() => {}}
          />
        );
      },
    };
    return [
      Table.Columns.name,
      Table.Columns.description,
      Table.Columns.unit,
      sparkLineColumn,
      Table.Columns.lastUpdatedTime,
      Table.Columns.created,
      Table.Columns.id,
      Table.Columns.isString,
      Table.Columns.isStep,
      Table.Columns.dataSet,
      Table.Columns.assets,
    ] as Column<Timeseries>[];
  }, [dateRange]);

  return (
    <Table
      columns={columns}
      data={data}
      isStickyHeader
      visibleColumns={visibleColumns}
      {...rest}
    />
  );
};
