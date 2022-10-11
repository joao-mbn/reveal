import React from 'react';
import { ResourceType } from 'types';
import { Colors, Label, Tabs } from '@cognite/cogs.js';
import styled from 'styled-components/macro';
import { useResultCount } from 'components/ResultCount/ResultCount';

const resourceTypeMap: Record<ResourceType, string> = {
  asset: 'Assets',
  file: 'Files',
  document: 'Documents',
  event: 'Events',
  timeSeries: 'Time series',
  sequence: 'Sequences',
  threeD: '3D',
};

const defaultResourceTypes: ResourceType[] = [
  'asset',
  'timeSeries',
  'file',
  'document',
  'event',
  'sequence',
  'threeD',
];

type Props = {
  resourceTypes?: ResourceType[];
  currentResourceType: ResourceType;
  isDocumentEnabled?: boolean;
  query?: string;
  filter?: any;
  showCount?: boolean;
  setCurrentResourceType: (newResourceType: ResourceType) => void;
};

const ResourceTypeTab = ({
  currentResourceType,
  query,
  showCount = false,
}: Omit<Props, 'setCurrentResourceType' | 'isDocumentEnabled'>) => {
  const result = useResultCount({
    filter: {},
    query,
    api: query && query.length > 0 ? 'search' : 'list',
    type: currentResourceType,
  });

  return (
    <TabContainer>
      <ResourceTypeTitle>
        {resourceTypeMap[currentResourceType]}
      </ResourceTypeTitle>
      {showCount && (
        <Label size="small" variant="unknown">
          {result.count}
        </Label>
      )}
    </TabContainer>
  );
};
export const ResourceTypeTabs = ({
  currentResourceType,
  setCurrentResourceType,
  resourceTypes = defaultResourceTypes,
  isDocumentEnabled = false,
  ...rest
}: Props) => {
  return (
    <StyledTabs
      activeKey={currentResourceType}
      onChange={tab => setCurrentResourceType(tab as ResourceType)}
    >
      {resourceTypes.map(resourceType => {
        // This basically hides the 'Documents' tab with the help of a feature flag controlled from subapp.
        if (!isDocumentEnabled && resourceType === 'document') {
          return null;
        }

        return (
          <Tabs.TabPane
            key={resourceType}
            tab={
              <ResourceTypeTab currentResourceType={resourceType} {...rest} />
            }
          />
        );
      })}
    </StyledTabs>
  );
};

const StyledTabs = styled(Tabs)`
  .rc-tabs-nav-wrap {
    border-bottom: 1px solid ${Colors['greyscale-grey3'].hex()};
  }
`;

const TabContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ResourceTypeTitle = styled.div`
  margin-right: 8px;
`;
