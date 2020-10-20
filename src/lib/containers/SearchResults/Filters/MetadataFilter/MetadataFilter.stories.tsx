import React from 'react';
import styled from 'styled-components';
import { DataExplorationProvider } from 'lib/context';
import { select } from '@storybook/addon-knobs';
import { ResourceType } from 'lib/types';
import { assets } from 'stubs/assets';
import { MetadataFilter } from './MetadataFilter';

export default {
  title: 'Search Results/Filters/General/MetadataFilter',
  component: MetadataFilter,
  decorators: [
    (storyFn: any) => (
      <Container>
        <DataExplorationProvider sdk={sdkMock}>
          {storyFn()}
        </DataExplorationProvider>
      </Container>
    ),
  ],
};
const sdkMock = {
  post: async () => ({ data: { items: [] } }),
};
export const Example = () => (
  <MetadataFilter
    items={assets}
    resourceType={select<ResourceType>(
      'api',
      ['asset', 'timeSeries', 'sequence', 'file', 'event'],
      'asset'
    )}
  />
);

const Container = styled.div`
  padding: 20px;
  min-height: 400px;
  display: flex;
`;
