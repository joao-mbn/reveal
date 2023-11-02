import React, { FC } from 'react';

import {
  DefaultPreviewFilter,
  ResourceDetailsTemplate,
} from '@data-exploration/components';

import { Collapse, Title } from '@cognite/cogs.js';

import {
  EMPTY_OBJECT,
  InternalAssetFilters,
  InternalEventsFilters,
  InternalTimeseriesFilters,
  ResourceSelectionMode,
  ResourceType,
  SelectableItemsProps,
  useTranslation,
} from '@data-exploration-lib/core';
import {
  useAssetsSearchResultQuery,
  useEventsByIdsQuery,
  useEventsSearchResultQuery,
  useSequenceSearchResultQuery,
  useShamefulDocumentsQuery,
  useTimeseriesSearchResultQuery,
} from '@data-exploration-lib/domain-layer';

import {
  AssetDetailsTable,
  EventDetailsTable,
  FileDetailsTable,
  SequenceDetailsTable,
  TimeseriesDetailsTable,
} from '../../DetailsTable';
import { EventInfo } from '../../Info';
import { ResourceSelection } from '../../ResourceSelector';
import { AssetTableFilters } from '../../Search/SearchResults/AssetSearchResults/AssetTableFilters';
import { EventTableFilters } from '../../Search/SearchResults/EventSearchResults/EventTableFilters';
import { FileTableFiltersDocument } from '../../Search/SearchResults/FileSearchResults/FileTableFilters';
import { TimeseriesTableFilters } from '../../Search/SearchResults/TimeseriesSearchResults/TimeseriesTableFilters';
import {
  ASSETS,
  DETAILS,
  EVENTS,
  FILES,
  NO_DETAILS_AVAILABLE,
  SEQUENCES,
  TIME_SERIES,
} from '../constant';
import { StyledCollapse } from '../elements';
import { useLocalFilterState } from '../hooks';
import { getResourcesVisibility } from '../utils';

interface Props {
  eventId: number;
  isSelected: boolean;
  closable?: boolean;
  onClose?: () => void;
  selectedRows?: ResourceSelection;
  selectionMode?: ResourceSelectionMode;
  visibleResources?: ResourceType[];
  showSelectButton?: boolean;
  isDocumentsApiEnabled?: boolean;
}
export const EventDetails: FC<
  Props & Pick<SelectableItemsProps, 'onSelect'>
> = ({
  eventId,
  isSelected,
  onSelect,
  selectionMode,
  selectedRows,
  closable,
  onClose,
  visibleResources = [],
  showSelectButton,
  isDocumentsApiEnabled = true,
}) => {
  const {
    isLoading: isParentEventLoading,
    data: event,
    isFetched: isEventFetched,
  } = useEventsByIdsQuery([{ id: eventId }]);

  const {
    isAssetVisible,
    isTimeseriesVisible,
    isFileVisible,
    isEventVisible,
    isSequenceVisible,
  } = getResourcesVisibility(visibleResources);

  const parentEvent = event?.[0];
  const { t } = useTranslation();

  const assetIds: number[] = parentEvent?.assetIds || [];
  const isQueryEnabled = assetIds.length > 0;

  const filter = {
    assetSubtreeIds: assetIds.map((value) => ({
      value,
    })),
  };

  const {
    query: fileQuery,
    setQuery: setFileQuery,
    debouncedQuery: debouncedFileSearchQuery,
    setFilter: setFileFilter,
    composedFilter: composedFileFilter,
    sortBy: fileSortBy,
    setSortBy: setFileSortBy,
  } = useLocalFilterState<any>({ baseFilter: filter });

  const {
    query: timeseriesQuery,
    setQuery: setTimeseriesQuery,
    debouncedQuery: debouncedTimeseriesSearchQuery,
    setFilter: setTimeseriesFilter,
    composedFilter: composedTimeseriesFilter,
    sortBy: timeseriesSortBy,
    setSortBy: setTimeseriesSortBy,
  } = useLocalFilterState<InternalTimeseriesFilters>({ baseFilter: filter });

  const {
    query: eventQuery,
    setQuery: setEventQuery,
    debouncedQuery: debouncedEventSearchQuery,
    setFilter: setEventFilter,
    composedFilter: composedEventFilter,
    sortBy: eventSortBy,
    setSortBy: setEventSortBy,
  } = useLocalFilterState<InternalEventsFilters>({ baseFilter: filter });

  const {
    query: assetQuery,
    setQuery: setAssetQuery,
    debouncedQuery: debouncedAssetSearchQuery,
    setFilter: setAssetFilter,
    composedFilter: composedAssetFilter,
    sortBy: assetSortBy,
    setSortBy: setAssetSortBy,
  } = useLocalFilterState<InternalAssetFilters>({ baseFilter: filter });

  const {
    data: relatedAssets = [],
    hasNextPage: assetsHasNextPage,
    fetchNextPage: assetsFetchNextPage,
    isInitialLoading: isAssetsLoading,
  } = useAssetsSearchResultQuery(
    {
      query: debouncedAssetSearchQuery,
      assetFilter: composedAssetFilter,
      sortBy: assetSortBy,
      limit: 10,
    },
    { enabled: isEventFetched && isAssetVisible && assetIds.length > 0 }
  );

  const {
    hasNextPage: hasEventNextPage,
    fetchNextPage: hasEventFetchNextPage,
    isInitialLoading: isEventsLoading,
    data: events,
  } = useEventsSearchResultQuery(
    {
      eventsFilters: composedEventFilter,
      eventsSortBy: eventSortBy,
      query: debouncedEventSearchQuery,
    },
    undefined,
    {
      enabled: isQueryEnabled && isEventVisible,
    }
  );

  const {
    hasNextPage: hasTimeseriesNextPage,
    fetchNextPage: hasTimeseriesFetchNextPage,
    isInitialLoading: isTimeseriesLoading,
    data: timeseries,
  } = useTimeseriesSearchResultQuery(
    {
      query: debouncedTimeseriesSearchQuery,
      filter: composedTimeseriesFilter,
      sortBy: timeseriesSortBy,
    },
    undefined,
    {
      enabled: isQueryEnabled && isTimeseriesVisible,
    }
  );

  const {
    results: relatedDocuments = [],
    hasNextPage: hasDocumentsNextPage,
    fetchNextPage: hasDocumentsFetchNextPage,
    isInitialLoading: isDocumentsLoading,
  } = useShamefulDocumentsQuery(
    {
      sortBy: fileSortBy,
      query: debouncedFileSearchQuery,
      filter: composedFileFilter,
      limit: 10,
    },
    {
      isDocumentsApiEnabled,
      isEnabled: isQueryEnabled && isFileVisible,
    }
  );

  const {
    hasNextPage: hasSequencesNextPage,
    fetchNextPage: hasSequencesFetchNextPage,
    isInitialLoading: isSequencesLoading,
    data: sequences = [],
  } = useSequenceSearchResultQuery(
    {
      filter,
    },
    undefined,
    { enabled: isQueryEnabled && isSequenceVisible }
  );

  const enableDetailTableSelection = selectionMode === 'multiple';

  return (
    <ResourceDetailsTemplate
      title={parentEvent?.type || ''}
      icon="Events"
      selectionMode={selectionMode}
      isSelected={isSelected}
      closable={closable}
      onClose={onClose}
      onSelectClicked={onSelect}
      showSelectButton={showSelectButton}
    >
      <StyledCollapse accordion ghost defaultActiveKey="event-details">
        <Collapse.Panel
          key="event-details"
          header={<h4>{t('DETAILS', DETAILS)}</h4>}
        >
          {parentEvent ? (
            <EventInfo event={parentEvent} />
          ) : (
            <Title level={5}>
              {t('NO_DETAILS_AVAILABLE', NO_DETAILS_AVAILABLE)}
            </Title>
          )}
        </Collapse.Panel>
        {isAssetVisible && (
          <Collapse.Panel
            key="event-asset-detail"
            header={<h4>{t('ASSETS', ASSETS)}</h4>}
          >
            <AssetDetailsTable
              id="asset-resource-event-detail-table"
              data={relatedAssets}
              hasNextPage={assetsHasNextPage}
              fetchMore={assetsFetchNextPage}
              isDataLoading={isParentEventLoading || isAssetsLoading}
              enableSelection={enableDetailTableSelection}
              selectedRows={selectedRows?.asset || EMPTY_OBJECT}
              onRowSelection={(updater, currentAssets) =>
                onSelect?.(updater, currentAssets, 'asset')
              }
              enableSorting
              sorting={assetSortBy}
              onSort={setAssetSortBy}
              tableHeaders={
                <DefaultPreviewFilter
                  query={assetQuery}
                  onQueryChange={setAssetQuery}
                >
                  <AssetTableFilters
                    filter={composedAssetFilter}
                    onFilterChange={setAssetFilter}
                  />
                </DefaultPreviewFilter>
              }
            />
          </Collapse.Panel>
        )}
        {isTimeseriesVisible && (
          <Collapse.Panel
            key="event-timeseries-detail"
            header={<h4>{t('TIMESERIES', TIME_SERIES)}</h4>}
          >
            <TimeseriesDetailsTable
              id="timeseries-resource-event-detail-table"
              data={timeseries}
              hasNextPage={hasTimeseriesNextPage}
              fetchMore={hasTimeseriesFetchNextPage}
              isDataLoading={isParentEventLoading || isTimeseriesLoading}
              enableSelection={enableDetailTableSelection}
              selectedRows={selectedRows?.timeSeries || EMPTY_OBJECT}
              onRowSelection={(updater, currentTimeseries) =>
                onSelect?.(updater, currentTimeseries, 'timeSeries')
              }
              enableSorting
              sorting={timeseriesSortBy}
              onSort={setTimeseriesSortBy}
              tableHeaders={
                <DefaultPreviewFilter
                  query={timeseriesQuery}
                  onQueryChange={setTimeseriesQuery}
                >
                  <TimeseriesTableFilters
                    filter={composedTimeseriesFilter}
                    onFilterChange={setTimeseriesFilter}
                  />
                </DefaultPreviewFilter>
              }
            />
          </Collapse.Panel>
        )}
        {isFileVisible && (
          <Collapse.Panel
            key="event-documents-detail"
            header={<h4>{t('FILES', FILES)}</h4>}
          >
            <FileDetailsTable
              id="documents-resource-event-detail-table"
              data={relatedDocuments}
              hasNextPage={hasDocumentsNextPage}
              fetchMore={hasDocumentsFetchNextPage}
              isDataLoading={isParentEventLoading || isDocumentsLoading}
              enableSelection={enableDetailTableSelection}
              selectedRows={selectedRows?.file || EMPTY_OBJECT}
              onRowSelection={(updater, currentFiles) =>
                onSelect?.(updater, currentFiles, 'file')
              }
              enableSorting={isDocumentsApiEnabled}
              sorting={fileSortBy}
              onSort={setFileSortBy}
              tableHeaders={
                isDocumentsApiEnabled ? (
                  <DefaultPreviewFilter
                    query={fileQuery}
                    onQueryChange={setFileQuery}
                  >
                    <FileTableFiltersDocument
                      filter={composedFileFilter}
                      onFilterChange={setFileFilter}
                    />
                  </DefaultPreviewFilter>
                ) : undefined
              }
            />
          </Collapse.Panel>
        )}
        {isEventVisible && (
          <Collapse.Panel
            key="event-events-detail"
            header={<h4>{t('EVENTS', EVENTS)}</h4>}
          >
            <EventDetailsTable
              id="event-resource-event-detail-table"
              data={events}
              hasNextPage={hasEventNextPage}
              fetchMore={hasEventFetchNextPage}
              isDataLoading={isParentEventLoading || isEventsLoading}
              enableSelection={enableDetailTableSelection}
              selectedRows={selectedRows?.event || EMPTY_OBJECT}
              onRowSelection={(updater, currentEvents) =>
                onSelect?.(updater, currentEvents, 'event')
              }
              enableSorting
              sorting={eventSortBy}
              onSort={setEventSortBy}
              tableHeaders={
                <DefaultPreviewFilter
                  query={eventQuery}
                  onQueryChange={setEventQuery}
                >
                  <EventTableFilters
                    filter={composedEventFilter}
                    onFilterChange={setEventFilter}
                  />
                </DefaultPreviewFilter>
              }
            />
          </Collapse.Panel>
        )}
        {isSequenceVisible && (
          <Collapse.Panel
            key="event-sequence-detail"
            header={<h4>{t('SEQUENCES', SEQUENCES)}</h4>}
          >
            <SequenceDetailsTable
              id="sequence-resource-event-detail-table"
              data={sequences}
              hasNextPage={hasSequencesNextPage}
              fetchMore={hasSequencesFetchNextPage}
              isDataLoading={isParentEventLoading || isSequencesLoading}
              enableSelection={enableDetailTableSelection}
              selectedRows={selectedRows?.sequence || EMPTY_OBJECT}
              onRowSelection={(updater, currentSequences) =>
                onSelect?.(updater, currentSequences, 'sequence')
              }
            />
          </Collapse.Panel>
        )}
      </StyledCollapse>
    </ResourceDetailsTemplate>
  );
};
