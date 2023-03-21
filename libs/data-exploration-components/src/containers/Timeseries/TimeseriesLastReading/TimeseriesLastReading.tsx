import { Body } from '@cognite/cogs.js';
import { TimeDisplay } from '@data-exploration-components/components';
import { useTimeseriesLatestDatapointQuery } from '@data-exploration-components/hooks/Timeseries/useTimeseriesLatestDatapointQuery';
import React from 'react';

interface Props {
  timeseriesId: number;
}
export const TimeseriesLastReading: React.FC<Props> = ({ timeseriesId }) => {
  const { data } = useTimeseriesLatestDatapointQuery(timeseriesId);

  const datapoint = data?.datapoints?.[0];
  if (!datapoint) {
    return null;
  }

  return (
    <Body level={2}>
      <TimeDisplay value={datapoint.timestamp} relative withTooltip />
    </Body>
  );
};