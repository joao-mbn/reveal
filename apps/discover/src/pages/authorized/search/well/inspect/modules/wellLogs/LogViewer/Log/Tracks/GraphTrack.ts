import { GraphTrackEnum } from 'domain/wells/measurements0/constants';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { graphLegendConfig, GraphTrack } from '@cognite/videx-wellog';
import { PlotConfig } from '@cognite/videx-wellog/dist/tracks/graph/interfaces';

import { NO_LOGS_LEGEND_MESSAGE } from 'pages/authorized/search/well/inspect/constants';

import { LogData } from '../interfaces';

import { getRandomTrackColor } from './trackColorizer';
import {
  disableGraphTrack,
  getTrackConfig,
  setupElementsAppenderOnTrack,
} from './utils';

export const getGraphTrack = (
  trackLogData: LogData,
  trackName: GraphTrackEnum
) => {
  const plots = Object.keys(trackLogData).map<PlotConfig>(
    (columnExternalId) => {
      const { measurementType, domain } = trackLogData[columnExternalId];
      const trackConfig = getTrackConfig(measurementType);

      return {
        id: columnExternalId,
        type: 'line',
        options: {
          scale: trackConfig?.scale || 'linear',
          width: trackConfig?.width,
          color: trackConfig?.color || getRandomTrackColor(),
          dash: trackConfig?.dash,
          filterToScale: false,
          domain,
          dataAccessor: (data: LogData) =>
            get(data, `${columnExternalId}.values`, []),
          legendInfo: (data: LogData) => ({
            label: `${columnExternalId} (${get(
              data,
              `${columnExternalId}.unit`,
              NO_LOGS_LEGEND_MESSAGE
            )})`,
          }),
        },
      };
    }
  );

  const graphTrack = new GraphTrack(trackName, {
    label: trackName,
    abbr: trackName,
    data: trackLogData,
    legendConfig: graphLegendConfig,
    plots,
  });

  if (isEmpty(plots)) {
    setupElementsAppenderOnTrack(graphTrack, disableGraphTrack);
  }

  return graphTrack;
};
