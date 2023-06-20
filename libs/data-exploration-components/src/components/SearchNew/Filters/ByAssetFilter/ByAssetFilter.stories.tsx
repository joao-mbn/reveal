import React, { useState } from 'react';

import { ComponentStory } from '@storybook/react';

import { ByAssetFilterV2 } from './ByAssetFilter';

export default {
  title: 'Search Results/Filters/ByAssetFilterV2',
  component: ByAssetFilterV2,
  argTypes: {
    title: {
      type: 'string',
    },
  },
};
export const Example: ComponentStory<typeof ByAssetFilterV2> = (args) => {
  const [values, setValues] = useState<
    { label?: string; value: number }[] | undefined
  >(undefined);
  return (
    <ByAssetFilterV2
      {...args}
      value={values?.map(({ value }) => value)}
      setValue={setValues}
    />
  );
};

Example.args = {
  title: 'Asset',
};

// FIXME: Write it in a unit test

// Example.play = async ({ canvasElement }) => {
//   const canvas = within(canvasElement);
//   const select = canvasElement.querySelector('.cogs-select__control');
//   await expect(select).toBeInTheDocument();

//   await userEvent.click(select!);
//   const option = canvas.getByText(assets[0].name!, {
//     exact: false,
//     selector: '.cogs-tooltip__content',
//   });
//   await expect(option!).not.toBeNull();
//   await expect(option!).toBeVisible();

//   await userEvent.click(option!);
//   await waitFor(() => {
//     const selection = canvas.getByText(assets[0].name!, {
//       selector: '.cogs-select__multi-value__label',
//     });
//     expect(selection).not.toBeNull();
//     expect(selection).toBeVisible();
//   });
// };
