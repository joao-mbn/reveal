import React, { useState } from 'react';
import { CogniteEvent } from '@cognite/sdk';
import {
  SearchResultToolbar,
  useResourceResults,
} from 'containers/SearchResults';
import { convertResourceType, ResourceItem } from 'types';
import { EventNewTable } from 'containers/Events';

import { RelatedResourceType } from 'hooks/RelatedResourcesHooks';
import { Loader } from '@cognite/cogs.js';
import { ColumnToggleProps } from 'components/ReactTable';
import { useEventsSearchResultQuery } from 'domain/events/internal/queries/useEventsSearchResultQuery';
import { InternalEventsFilters } from 'domain/events';
import { TableSortBy } from 'components/ReactTable/V2';
import { AppliedFiltersTags } from 'components/AppliedFiltersTags/AppliedFiltersTags';

export const EventSearchResults = ({
  query = '',
  filter = {},
  onClick,
  count,
  showCount = false,
  enableAdvancedFilters,
  onFilterChange,
}: {
  query?: string;
  filter?: InternalEventsFilters;
  showCount?: boolean;
  showRelatedResources?: boolean;
  relatedResourceType?: RelatedResourceType;
  parentResource?: ResourceItem;
  count?: number;
  enableAdvancedFilters?: boolean;
  onClick: (item: CogniteEvent) => void;
  onFilterChange?: (newValue: Record<string, unknown>) => void;
} & ColumnToggleProps<CogniteEvent>) => {
  const api = convertResourceType('event');
  const { canFetchMore, fetchMore, isFetched, items } =
    useResourceResults<CogniteEvent>(api, query, filter);

  const [sortBy, setSortBy] = useState<TableSortBy[]>([]);
  const { data, isLoading, hasNextPage, fetchNextPage } =
    useEventsSearchResultQuery({
      query,
      eventsFilters: filter,
      eventsSortBy: sortBy,
    });

  const loading = enableAdvancedFilters ? isLoading : !isFetched;
  if (loading) {
    return <Loader />;
  }

  return (
    <EventNewTable
      id="event-search-results"
      tableHeaders={
        <SearchResultToolbar
          api={query.length > 0 ? 'search' : 'list'}
          type="event"
          filter={filter}
          showCount={showCount}
          query={query}
          count={count}
        />
      }
      tableSubHeaders={
        <AppliedFiltersTags
          filter={filter}
          onFilterChange={onFilterChange}
          icon="Events"
        />
      }
      data={enableAdvancedFilters ? data : items}
      enableSorting
      sorting={sortBy}
      onSort={setSortBy}
      fetchMore={enableAdvancedFilters ? fetchNextPage : fetchMore}
      showLoadButton
      hasNextPage={enableAdvancedFilters ? hasNextPage : canFetchMore}
      onRowClick={(event: CogniteEvent) => onClick(event)}
    />
  );
};
