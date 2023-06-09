import React, { FC } from 'react';

import { ResourceDetailsTemplate } from '@data-exploration/components';

import { Collapse, Title } from '@cognite/cogs.js';

import { EMPTY_OBJECT, SelectableItemsProps } from '@data-exploration-lib/core';
import {
  useAssetsByIdQuery,
  useDocumentSearchResultQuery,
  useEventsByIdsQuery,
  useEventsSearchResultQuery,
  useSequenceSearchResultQuery,
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

interface Props {
  eventId: number;
  isSelected: boolean;
  onClose?: () => void;
  selectedRows?: ResourceSelection;
  selectionMode?: 'single' | 'multiple';
}
export const EventDetails: FC<
  Props & Pick<SelectableItemsProps, 'onSelect'>
> = ({
  eventId,
  isSelected,
  onSelect,
  selectionMode,
  selectedRows,
  onClose,
}) => {
  const {
    isLoading: isParentEventLoading,
    data: event,
    isFetched: isEventFetched,
  } = useEventsByIdsQuery([{ id: eventId }]);

  const parentEvent = event?.[0];

  const assetIds: number[] = parentEvent?.assetIds || [];
  const isQueryEnabled = assetIds.length > 0;

  const filter = {
    assetSubtreeIds: assetIds.map((value) => ({
      value,
    })),
  };

  const { data: assets = [], isLoading: isAssetsLoading } = useAssetsByIdQuery(
    assetIds.map((id) => ({ id })),
    { enabled: isEventFetched && !!assetIds && assetIds.length > 0 }
  );

  const {
    hasNextPage: hasEventNextPage,
    fetchNextPage: hasEventFetchNextPage,
    isLoading: isEventsLoading,
    data: events,
  } = useEventsSearchResultQuery({ eventsFilters: filter }, undefined, {
    enabled: isQueryEnabled,
  });

  const {
    hasNextPage: hasTimeseriesNextPage,
    fetchNextPage: hasTimeseriesFetchNextPage,
    isLoading: isTimeseriesLoading,
    data: timeseries,
  } = useTimeseriesSearchResultQuery({ filter }, undefined, {
    enabled: isQueryEnabled,
  });

  const {
    hasNextPage: hasDocumentsNextPage,
    fetchNextPage: hasDocumentsFetchNextPage,
    isLoading: isDocumentsLoading,
    results: relatedDocuments = [],
  } = useDocumentSearchResultQuery(
    {
      filter,
    },
    { enabled: isQueryEnabled }
  );

  const {
    hasNextPage: hasSequencesNextPage,
    fetchNextPage: hasSequencesFetchNextPage,
    isLoading: isSequencesLoading,
    data: sequences = [],
  } = useSequenceSearchResultQuery(
    {
      filter,
    },
    undefined,
    { enabled: isQueryEnabled }
  );

  const enableDetailTableSelection = selectionMode === 'multiple';
  return (
    <ResourceDetailsTemplate
      title={parentEvent?.type || ''}
      icon="Events"
      isSelected={isSelected}
      onClose={onClose}
      onSelectClicked={onSelect}
    >
      <StyledCollapse accordion ghost defaultActiveKey="event-details">
        <Collapse.Panel key="event-details" header={<h4>{DETAILS}</h4>}>
          {parentEvent ? (
            <EventInfo event={parentEvent} />
          ) : (
            <Title level={5}>{NO_DETAILS_AVAILABLE}</Title>
          )}
        </Collapse.Panel>
        <Collapse.Panel key="event-asset-detail" header={<h4>{ASSETS}</h4>}>
          <AssetDetailsTable
            id="asset-resource-event-detail-table"
            data={assets}
            isDataLoading={isParentEventLoading || isAssetsLoading}
            enableSelection={enableDetailTableSelection}
            selectedRows={selectedRows?.asset || EMPTY_OBJECT}
            onRowSelection={(updater, currentAssets) =>
              onSelect?.(updater, currentAssets, 'asset')
            }
          />
        </Collapse.Panel>
        <Collapse.Panel
          key="event-timeseries-detail"
          header={<h4>{TIME_SERIES}</h4>}
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
          />
        </Collapse.Panel>
        <Collapse.Panel key="event-documents-detail" header={<h4>{FILES}</h4>}>
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
          />
        </Collapse.Panel>
        <Collapse.Panel key="event-events-detail" header={<h4>{EVENTS}</h4>}>
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
          />
        </Collapse.Panel>
        <Collapse.Panel
          key="event-sequence-detail"
          header={<h4>{SEQUENCES}</h4>}
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
      </StyledCollapse>
    </ResourceDetailsTemplate>
  );
};