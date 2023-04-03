import { PlotData } from 'plotly.js';

import times from 'lodash/times';

import {
  DEFAULT_LINE_COLOR,
  HOVER_MARKER_BORDER_WIDTH,
  LINE_WIDTH,
  MARKER_SIZE,
} from '../constants';
import { LineChartProps, Variant } from '../types';
import { getDataAsArray } from './getDataAsArray';
import { getLineName } from './getLineName';

export const adaptToPlotlyPlotData = (
  data: LineChartProps['data'],
  showMarkers: boolean,
  variant?: Variant
): Partial<PlotData>[] => {
  const mode = showMarkers ? 'lines+markers' : 'lines';

  let markerSize = showMarkers ? MARKER_SIZE : 0;
  let markerOutlineWidth = HOVER_MARKER_BORDER_WIDTH;

  if (variant === 'small') {
    markerSize /= 2;
    markerOutlineWidth /= 2;
  }

  return getDataAsArray(data).map(
    ({ x, y, color, name, customData }, index) => {
      const lineColor = color || DEFAULT_LINE_COLOR;
      const markerSizes = times(x.length).map(() => markerSize);
      const markerLineColors = times(x.length).map(() => 'transparent');

      return {
        mode,
        x,
        y,
        line: {
          width: LINE_WIDTH,
          color: lineColor,
        },
        marker: {
          size: markerSizes,
          opacity: 1,
          line: {
            width: markerOutlineWidth,
            color: markerLineColors,
          },
        },
        name: getLineName(name, index),
        hoverinfo: 'none',
        unselected: {
          marker: {
            opacity: 1,
          },
        },
        customData,
      };
    }
  );
};