/* eslint-disable no-promise-executor-return */
import configureStory from 'storybook/configureStory';
import { Meta } from '@storybook/react';
import { ExtendedStory } from 'utils/test/storybook';
import { CdfClient } from 'utils';
import sinon from 'sinon';
import { MockEvents } from '__mocks/events';

import EventsCard, { EventsCardProps } from './EventsCard';

const meta: Meta<EventsCardProps> = {
  title: 'Cards / Events Card',
  component: EventsCard,
  argTypes: {
    assetId: {
      name: 'Asset ID',
      defaultValue: 1,
    },
    onEventClick: {
      name: 'On Event Click',
      action: 'clicked',
      description: 'On event click',
    },
    onHeaderClick: {
      name: 'On Header Click',
      action: 'clicked',
      description: 'On header click',
    },
  },
};

export default meta;

const mockList = () => {
  const stub = sinon.stub();
  stub.callsFake(() => {
    return Promise.resolve({ items: MockEvents.multiple(5) });
  });
  return stub;
};

const Template: ExtendedStory<EventsCardProps> = (args) => (
  <EventsCard {...args} />
);

export const Standard = Template.bind({});
Standard.story = configureStory({
  mockCdfClient: (client: CdfClient) => {
    client.cogniteClient.events.list = mockList();
    return client;
  },
});
