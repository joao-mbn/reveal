import React, { useState } from 'react';

import { assets } from '@data-exploration-components/stubs/assets';
import { ComponentStory } from '@storybook/react';

import { AggregatedFilterV2 } from './AggregatedFilter';

export default {
  title: 'Search Results/Filters/AggregatedFilterV2',
  component: AggregatedFilterV2,
  argTypes: {
    title: {
      type: 'string',
    },
    aggregator: {
      type: 'string',
    },
  },
};

export const Example: ComponentStory<typeof AggregatedFilterV2> = (args) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  return <AggregatedFilterV2 {...args} value={value} setValue={setValue} />;
};

Example.args = {
  title: 'Source',
  aggregator: 'source',
  items: assets,
};

// FIXME: Write it in a unit test

// Example.play = async ({ canvasElement }) => {
//   const canvas = within(canvasElement);
//   const checkIfExistsAndVisible = (el: HTMLElement) => {
//     expect(el).not.toBeNull();
//     expect(el).toBeVisible();
//   };

//   const select = canvasElement.querySelector('.aggregated-filter-select > div');
//   await expect(select).toBeInTheDocument();

//   await userEvent.click(select!);
//   const option = canvas.getByText(assets[0].source!, {
//     ignore: '[id^="aria-"]',
//   });
//   await waitFor(() => {
//     checkIfExistsAndVisible(option);
//   });

//   await userEvent.click(option!);
//   const selection = canvas.getByText(assets[0].source!, {
//     selector: '[class*="-singleValue"]',
//   });
//   await waitFor(() => {
//     checkIfExistsAndVisible(selection);
//   });
// };
