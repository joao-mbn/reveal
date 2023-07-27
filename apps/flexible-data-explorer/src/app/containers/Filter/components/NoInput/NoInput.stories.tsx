import { ComponentStory } from '@storybook/react';

import { NoInput } from './NoInput';

export default {
  title: 'FlexibleDataExplorer/Containers/Search/Filter/Components/NoInput',
  component: NoInput,
};

export const Example: ComponentStory<typeof NoInput> = (args) => (
  <NoInput {...args} />
);