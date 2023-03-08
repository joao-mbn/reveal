import { useCallback, useMemo } from 'react';

import { Layout as PlotlyLayout } from 'plotly.js';

import { Config } from '../types';
import { getFixedRangeConfig } from '../utils/getFixedRangeConfig';
import { getSelectDirection } from '../utils/getSelectDirection';
import { useAxisDirection } from './useAxisDirection';
import { getPlotAreaCursor } from '../utils/getPlotAreaCursor';

export const useLayoutFixedRangeConfig = (
  config: Config,
  isCursorOnPlotArea: boolean
) => {
  const { scrollZoom, selectionZoom, pan } = config;

  const scrollZoomDirection = useAxisDirection(scrollZoom);
  const selectionZoomDirection = useAxisDirection(selectionZoom);
  const panDirection = useAxisDirection(pan);

  const getAxisFixedRange = useCallback(
    (axis: 'x' | 'y') => {
      if (scrollZoomDirection && isCursorOnPlotArea) {
        return getFixedRangeConfig(scrollZoomDirection, axis);
      }
      if (panDirection) {
        return getFixedRangeConfig(panDirection, axis);
      }
      return false;
    },
    [isCursorOnPlotArea, panDirection, scrollZoomDirection]
  );

  const fixedRange = useMemo(() => {
    return {
      x: getAxisFixedRange('x'),
      y: getAxisFixedRange('y'),
    };
  }, [getAxisFixedRange]);

  const fixedRangeLayoutConfig: Partial<PlotlyLayout> = useMemo(() => {
    return {
      dragmode: selectionZoomDirection ? 'select' : false,
      selectdirection: getSelectDirection(selectionZoomDirection),
    };
  }, [selectionZoomDirection]);

  const cursor = useMemo(() => {
    return getPlotAreaCursor(selectionZoomDirection);
  }, [selectionZoomDirection]);

  return {
    fixedRange,
    fixedRangeLayoutConfig,
    cursor,
  };
};
