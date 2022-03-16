import configureStory from 'storybook/configureStory';
import { Meta } from '@storybook/react';
import { ExtendedStory } from 'utils/test/storybook';
import { MockDatapoints } from '__mocks/datapoints';
import { Timeseries } from '@cognite/sdk';
import { CdfClient } from 'utils';

import TimeSeriesSidebar from './TimeSeriesSidebar';
import { TimeSeriesSidebarProps } from '.';

const meta: Meta<TimeSeriesSidebarProps> = {
  title: 'Time Series / Sidebar',
  component: TimeSeriesSidebar,
  argTypes: {
    timeSeries: {
      name: 'Time Series',
      defaultValue: {
        id: 1,
        name: 'LOR_KARLSTAD_WELL_05_Well_ASSOC_GAS_CAPACITY',
        description: 'Some description',
        unit: 'M3',
        metadata: {
          product_type: 'ASSOC_GAS',
          ValueType: 'IPSC',
          SourceFrequency: 'PerMonth',
          SourceAggregationModel: 'DailyAverage',
        },
      } as unknown as Timeseries,
      control: {
        type: 'object',
      },
    },
    showPreview: {
      name: 'Show Preview',
      defaultValue: true,
      control: {
        type: 'boolean',
      },
    },
    showHeader: {
      name: 'Show Header',
      defaultValue: true,
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;

const Template: ExtendedStory<TimeSeriesSidebarProps> = (args) => (
  <TimeSeriesSidebar {...args} />
);

export const Standard = Template.bind({});
Standard.story = configureStory({
  mockCdfClient: (client: CdfClient) => {
    // client.cogniteClient.setProject('project');
    client.cogniteClient.datapoints.retrieve = () => {
      return Promise.resolve([MockDatapoints.datapoint(50)]);
    };
    client.cogniteClient.datapoints.retrieveLatest = () => {
      return Promise.resolve([MockDatapoints.datapoint(50)]);
    };
    return client;
  },
});
