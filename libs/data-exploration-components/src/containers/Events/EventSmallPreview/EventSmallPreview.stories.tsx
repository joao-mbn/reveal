import React from 'react';

import { events } from '@data-exploration-components/stubs/events';

import { EventSmallPreview } from './EventSmallPreview';

export default {
  title: 'Events/EventSmallPreview',
  component: EventSmallPreview,
};
export const Example = () => <EventSmallPreview eventId={events[0].id} />;