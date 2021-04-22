import React from 'react';
import { Menu } from '@cognite/cogs.js';
import { useChart, useUpdateChart } from 'hooks/firebase';
import { ChartTimeSeries } from 'reducers/charts/types';
import {
  updateTimeseries,
  removeTimeseries,
  convertTimeseriesToWorkflow,
} from 'utils/charts';
import { useLoginStatus } from 'hooks';
import { AppearanceDropdown } from 'components/AppearanceDropdown';

type Props = {
  chartId: string;
  id: string;
  closeMenu?: () => void;
  startRenaming?: () => void;
};
export default function TimeSeriesMenu({
  id,
  chartId,
  closeMenu,
  startRenaming,
}: Props) {
  const { data: login } = useLoginStatus();
  const { data: chart } = useChart(chartId);
  const { mutate } = useUpdateChart();

  const ts = chart?.timeSeriesCollection?.find((t) => t.id === id);

  if (!chart || !login?.user || !ts) {
    return null;
  }

  const update = (diff: Partial<ChartTimeSeries>, close: boolean = true) => {
    mutate(updateTimeseries(chart, id, diff));
    if (closeMenu && close) {
      closeMenu();
    }
  };
  const remove = () => mutate(removeTimeseries(chart, id));
  const convert = () => mutate(convertTimeseriesToWorkflow(chart, id));
  return (
    <Menu>
      <Menu.Submenu content={<AppearanceDropdown update={update} />}>
        <span>Appearance</span>
      </Menu.Submenu>
      <Menu.Item
        onClick={() => {
          if (startRenaming) startRenaming();
          if (closeMenu) closeMenu();
        }}
        appendIcon="Edit"
      >
        <span>Rename</span>
      </Menu.Item>
      <Menu.Item onClick={() => remove()} appendIcon="Delete">
        <span>Remove</span>
      </Menu.Item>
      <Menu.Item onClick={() => convert()} appendIcon="Timeseries">
        <span>Convert to calculation</span>
      </Menu.Item>
    </Menu>
  );
}
