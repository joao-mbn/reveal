import React from 'react';
import styled from 'styled-components';
import { assets } from '@data-exploration-components/stubs/assets';
import { ComponentStory } from '@storybook/react';
import { AssetTable } from './AssetTable';

export default {
  title: 'Assets/AssetTable',
  component: AssetTable,
  decorators: [(storyFn: any) => <Container>{storyFn()}</Container>],
  argTypes: {
    query: {
      type: 'string',
      defaultValue: '',
    },
  },
};

export const Example: ComponentStory<typeof AssetTable> = (args) => (
  <AssetTable {...args} />
);
Example.args = {
  data: assets,
};

export const ExampleSingleSelect: ComponentStory<typeof AssetTable> = (
  args
) => <AssetTable {...args} />;
ExampleSingleSelect.args = {
  data: assets,
};

const Container = styled.div`
  height: 600px;
`;