import * as React from 'react';

import { LineChart, LineChartProps } from '../../../LineChart';
import { TimeseriesChartMetadata } from '../../domain/internal/types';
import { useTranslation } from '../../i18n/useTranslation';

import { CONFIG, LAYOUT } from './constants';
import { formatHoverLineInfo } from './helpers/formatHoverLineInfo';
import { formatTooltipContent } from './helpers/formatTooltipContent';

export interface TimeseriesChartLargeProps extends LineChartProps {
  metadata: TimeseriesChartMetadata;
}

export const TimeseriesChartLarge: React.FC<TimeseriesChartLargeProps> = ({
  metadata,
  ...props
}) => {
  const { t } = useTranslation();

  const { dataFetchMode, unit } = metadata;

  return (
    <LineChart
      {...props}
      variant="large"
      yAxis={{
        name: unit,
      }}
      layout={{
        ...LAYOUT,
        showMarkers: dataFetchMode === 'raw',
      }}
      config={CONFIG}
      formatTooltipContent={(tooltipProps) =>
        formatTooltipContent(tooltipProps, unit, t)
      }
      formatHoverLineInfo={formatHoverLineInfo}
    />
  );
};
