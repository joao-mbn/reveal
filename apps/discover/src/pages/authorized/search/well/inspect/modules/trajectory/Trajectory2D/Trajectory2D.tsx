import React, { useEffect, useState } from 'react';

import { NoUnmountShowHide } from 'components/NoUnmountShowHide';
import { useDeepMemo } from 'hooks/useDeep';
import { useUserPreferencesMeasurement } from 'hooks/useUserPreferences';
import { useWellConfig } from 'modules/wellSearch/hooks/useWellConfig';

import { FullSizedTrajectoryView, TrajectoryGrid } from '../elements';

import { TrajectoryChart } from './TrajectoryChart';
import { TrajectoryChartProps, Trajectory2DProps } from './types';
import { generateChartData } from './utils/generateChartData';

export const Trajectory2D: React.FC<Trajectory2DProps> = ({
  selectedTrajectoryData,
  selectedTrajectories,
}) => {
  const { data: config } = useWellConfig();
  const { data: userPreferredUnit } = useUserPreferencesMeasurement();

  const [expandedChart, setExpandedChart] = useState<TrajectoryChartProps>();
  const [autosizeGridView, setAutosizeGridView] = useState<boolean>(true);

  /**
   * Enable autosizing for grid view charts.
   * Since the autosizing is disabled when the full sized view is expanded,
   * the grid view is not resized even after the window size is changed.
   * Hence, this event listener enables autosizing for gird view if the window is resized.
   */
  useEffect(() => {
    const enableAutosizeGridView = () => {
      setAutosizeGridView(true);
    };
    window.addEventListener('resize', enableAutosizeGridView);
    return () => window.removeEventListener('resize', enableAutosizeGridView);
  }, []);

  const chartConfigs = useDeepMemo(
    () => config?.trajectory?.charts || [],
    [config?.trajectory?.charts]
  );

  const charts = useDeepMemo(
    () =>
      generateChartData(
        selectedTrajectoryData,
        selectedTrajectories,
        chartConfigs,
        userPreferredUnit,
        config
      ),
    [
      selectedTrajectoryData,
      selectedTrajectories,
      chartConfigs,
      userPreferredUnit,
      config,
    ]
  );

  const handleExpandFullSizedView = ({ data, index }: TrajectoryChartProps) => {
    setExpandedChart({ data, index });
    /**
     * Disable autosizing for grid view charts.
     * This is to prevent triggering an unnecessary resize after the full sized view is collapsed.
     */
    setAutosizeGridView(false);
  };

  const handleCollapseFullSizedView = () => {
    setExpandedChart(undefined);
  };

  const renderTrajectoryFullSizedView = () => {
    if (!expandedChart) {
      return null;
    }

    const { data, index } = expandedChart;

    return (
      <FullSizedTrajectoryView>
        <TrajectoryChart
          data={data}
          index={index}
          onCollapse={handleCollapseFullSizedView}
        />
      </FullSizedTrajectoryView>
    );
  };

  if (!config) {
    return null;
  }

  return (
    <>
      <NoUnmountShowHide show={!expandedChart} fullHeight>
        <TrajectoryGrid>
          {charts.map((data, index) => (
            <TrajectoryChart
              // eslint-disable-next-line react/no-array-index-key
              key={`chart_${index}`}
              data={data}
              index={index}
              autosize={autosizeGridView}
              onExpand={() => handleExpandFullSizedView({ data, index })}
            />
          ))}
        </TrajectoryGrid>
      </NoUnmountShowHide>

      {renderTrajectoryFullSizedView()}
    </>
  );
};
