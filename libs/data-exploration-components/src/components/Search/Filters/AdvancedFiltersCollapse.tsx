import React, { useState, useEffect } from 'react';
import { Colors, Icon } from '@cognite/cogs.js';
import { Collapse } from 'antd';
import styled from 'styled-components';
import { ResourceType } from '@data-exploration-components/types';
import { countByFilter } from '@data-exploration-components/utils';

const COLLAPSE_KEY = 'adavanced-filters-collapse';

const metadataCreatedTimeLastUpdatedTime = [
  'metadata',
  'createdTime',
  'lastUpdatedTime',
];
const metadataCreatedTimeLastUpdatedTimeAssetSubtreeIds = [
  'assetSubtreeIds',
  ...metadataCreatedTimeLastUpdatedTime,
];

const advancedAssetFilterKeys = [
  ...metadataCreatedTimeLastUpdatedTimeAssetSubtreeIds,
];

const advancedTimeseriesFilterKeys = [
  'unit',
  ...metadataCreatedTimeLastUpdatedTimeAssetSubtreeIds,
];

const advancedFileFilterKeys = [
  'labels',
  'uploadedTime',
  'directoryPrefix',
  'source',
  'sourceCreatedTime',
  ...metadataCreatedTimeLastUpdatedTimeAssetSubtreeIds,
];

const advancedSequenceFilterKeys = ['metadata'];

const advancedEventFilterKeys = [
  'subtype',
  'source',
  ...metadataCreatedTimeLastUpdatedTimeAssetSubtreeIds,
];

const getAdvancedFilterMap = (resourceType: ResourceType) => {
  switch (resourceType) {
    case 'asset':
      return advancedAssetFilterKeys;
    case 'event':
      return advancedEventFilterKeys;
    case 'timeSeries':
      return advancedTimeseriesFilterKeys;
    case 'file':
      return advancedFileFilterKeys;
    case 'sequence':
      return advancedSequenceFilterKeys;
    default:
      return [];
  }
};

export const AdvancedFiltersCollapse = ({
  resourceType,
  filter,
  children,
}: {
  resourceType: ResourceType;
  filter: any;
  children: React.ReactNode;
}) => {
  const [activeCollapseKey, setActiveCollapseKey] = useState<
    string | string[]
  >();

  const advancedFilters = Object.entries(filter).reduce((accl, filterItem) => {
    if (getAdvancedFilterMap(resourceType).includes(filterItem[0])) {
      return { ...accl, [filterItem[0]]: filterItem[1] };
    }
    return accl;
  }, {});
  const count = countByFilter(advancedFilters);

  useEffect(() => {
    if (count > 0) {
      setActiveCollapseKey(COLLAPSE_KEY);
    }
  }, [count]);

  const renderExpandIcon = () => {
    if (activeCollapseKey === COLLAPSE_KEY) {
      return <Icon type="ChevronDownSmall" />;
    }
    return <Icon type="ChevronRightSmall" />;
  };

  return (
    <StyledCollapse>
      <Collapse
        ghost
        accordion
        expandIcon={renderExpandIcon}
        expandIconPosition="end"
        activeKey={activeCollapseKey}
        onChange={(key) => setActiveCollapseKey(key)}
      >
        <Collapse.Panel header="More filters" key={COLLAPSE_KEY}>
          {children}
        </Collapse.Panel>
      </Collapse>
    </StyledCollapse>
  );
};

const StyledCollapse = styled.div`
  margin-top: 10px;
  .ant-collapse.ant-collapse {
    .ant-collapse-item {
      .ant-collapse-header {
        padding-left: 0;
        .ant-collapse-header-text {
          color: ${Colors['text-icon--interactive--default']};
        }
        .ant-collapse-expand-icon {
          .cogs-icon {
            right: unset;
            left: 80px;
            color: ${Colors['text-icon--interactive--default']};
          }
        }
      }
      .ant-collapse-content {
        .ant-collapse-content-box {
          padding-left: 0;
          padding-right: 0;
          padding-top: 0;
        }
      }
    }
  }
`;

export const TempCommonMultiSelectFix = styled.div`
  && {
    .cogs-select__multi-value {
      background-color: var(--cogs-surface--status-neutral--muted--default);
      color: var(--cogs-text-icon--status-neutral);
      border-radius: 4px;

      .cogs-select__multi-value__label {
        color: var(--cogs-text-icon--status-neutral);
        font-weight: 500;
      }
    }
  }
`;

export const TempMultiSelectFix = styled.div`
  && {
    .cogs-select__multi-value {
      background-color: var(--cogs-surface--status-success--muted--default);
      color: var(--cogs-text-icon--status-success);
      border-radius: 4px;

      .cogs-select__multi-value__label {
        color: var(--cogs-text-icon--status-success);
        font-weight: 500;
      }
    }
  }
`;