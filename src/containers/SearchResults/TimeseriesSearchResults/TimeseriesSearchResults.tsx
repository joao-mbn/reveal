import React from 'react';
import { TimeseriesFilter, Timeseries } from '@cognite/sdk';
import {
  SelectableItemsProps,
  DateRangeProps,
  TableStateProps,
  ResourceItem,
  convertResourceType,
} from 'types';
import { TimeseriesNewTable } from 'containers/Timeseries';
import { EnsureNonEmptyResource } from 'components';

import { RelatedResourceType } from 'hooks/RelatedResourcesHooks';

import { Flex, Loader } from '@cognite/cogs.js';

import { SearchResultToolbar, useResourceResults } from '..';

export const TimeseriesSearchResults = ({
  query = '',
  filter = {},
  showCount = false,
  count,
  onClick,
  relatedResourceType,
}: {
  query?: string;
  showCount?: boolean;
  initialView?: string;
  filter?: TimeseriesFilter;
  showRelatedResources?: boolean;
  relatedResourceType?: RelatedResourceType;
  parentResource?: ResourceItem;
  count?: number;
  showDatePicker?: boolean;
  onClick: (item: Timeseries) => void;
} & SelectableItemsProps &
  DateRangeProps &
  TableStateProps) => {
  const api = convertResourceType('timeSeries');

  const { canFetchMore, fetchMore, isFetched, items } =
    useResourceResults<Timeseries>(api, query, filter);
  // TODO Needs refactoring for hiding emppty datasets

  if (!isFetched) {
    return <Loader />;
  }

  return (
    <>
      <EnsureNonEmptyResource api="timeSeries">
        <Flex justifyContent="space-between" alignItems="center"></Flex>

        <TimeseriesNewTable
          tableHeaders={
            <SearchResultToolbar
              showCount={showCount}
              api={query?.length > 0 ? 'search' : 'list'}
              type="timeSeries"
              filter={filter}
              count={count}
              query={query}
            />
          }
          data={items}
          fetchMore={fetchMore}
          showLoadButton
          hasNextPage={canFetchMore}
          onRowClick={timseries => onClick(timseries)}
          relatedResourceType={relatedResourceType}
        />
      </EnsureNonEmptyResource>
    </>
  );
};
