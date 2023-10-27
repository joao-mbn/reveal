import { isNumeric } from '@fdx/shared/utils/number';

import { TimeseriesChart } from '@cognite/plotting-components';

import { PreviewContainer } from './elements';

// Fix me: move to common place...
const getTimeseriesId = (id: string | number) => {
  if (typeof id === 'number' || isNumeric(id)) {
    return { id: Number(id) };
  }

  return { externalId: id };
};

interface Props {
  id: string | number;
}
export const TimeSeriesViewer: React.FC<Props> = ({ id }) => {
  return (
    <PreviewContainer disableOverflow>
      <TimeseriesChart
        timeseries={getTimeseriesId(id)}
        variant="small"
        numberOfPoints={100}
        height={140}
        styles={{
          width: 300,
        }}
        dataFetchOptions={{
          mode: 'aggregate',
        }}
        autoRange
      />
    </PreviewContainer>
  );
};