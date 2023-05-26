import React from 'react';

import styled from 'styled-components';

import { events } from '@data-exploration-lib/core';
import { action } from '@storybook/addon-actions';
import { ComponentStory } from '@storybook/react';

import { EventTable } from './EventTable';

export default {
  title: 'Events/EventTable',
  component: EventTable,
  decorators: [(storyFn: any) => <Container>{storyFn()}</Container>],
  argTypes: { query: { control: 'text' } },
};

export const Example: ComponentStory<typeof EventTable> = (args) => (
  <EventTable {...args} />
);
Example.args = {
  data: events,
  onRowClick: action('onRowClicked'),
};

const Container = styled.div`
  height: 600px;
`;