import React, { FC, useMemo } from 'react';

import styled from 'styled-components';

import { ResourceDetailsTemplate } from '@data-exploration/components';

import { Collapse, Title } from '@cognite/cogs.js';
import { TimeseriesChart } from '@cognite/plotting-components';

import {
  EMPTY_OBJECT,
  ResourceType,
  SelectableItemsProps,
  ViewType,
} from '@data-exploration-lib/core';
import {
  useAssetsByIdQuery,
  useDocumentSearchResultQuery,
  useEventsListQuery,
  useSequenceListQuery,
  useTimeseriesByIdsQuery,
  useTimeseriesListQuery,
} from '@data-exploration-lib/domain-layer';

import {
  AssetDetailsTable,
  EventDetailsTable,
  FileDetailsTable,
  SequenceDetailsTable,
  TimeseriesDetailsTable,
} from '../../DetailsTable';
import { TimeseriesInfo } from '../../Info';
import { ResourceSelection } from '../../ResourceSelector';
import { EVENTS, FILES, SEQUENCES, TIME_SERIES } from '../constant';
import { getResourcesVisibility } from '../utils';

interface Props {
  timeseriesId: number;
  isSelected: boolean;
  onClose?: () => void;
  selectionMode?: 'single' | 'multiple';
  selectedRows?: ResourceSelection;
  visibleResources?: ResourceType[];
}
export const TimeseriesDetails: FC<
  Props & Pick<SelectableItemsProps, 'onSelect'>
> = ({
  timeseriesId,
  isSelected,
  onClose,
  onSelect,
  selectedRows,
  selectionMode,
  visibleResources = [],
}) => {
  const {
    data,
    isFetched: isTimeseriesFetched,
    isLoading: isParentTimeseriesLoading,
  } = useTimeseriesByIdsQuery([{ id: timeseriesId }]);
  const timeseries = useMemo(() => {
    return data ? data[0] : undefined;
  }, [data]);

  const {
    isAssetVisible,
    isTimeseriesVisible,
    isFileVisible,
    isEventVisible,
    isSequenceVisible,
  } = getResourcesVisibility(visibleResources);

  const assetIds = timeseries?.assetId ? [timeseries.assetId] : [];

  const isQueryEnabled = assetIds.length > 0;
  const { data: relatedAssets = [], isLoading: isAssetsLoading } =
    useAssetsByIdQuery(
      assetIds.map((id) => ({ id })),
      { enabled: isTimeseriesFetched && isQueryEnabled }
    );
  const {
    hasNextPage: hasEventNextPage,
    fetchNextPage: hasEventFetchNextPage,
    isLoading: isEventsLoading,
    data: events,
  } = useEventsListQuery(
    { filter: { assetIds } },
    { enabled: isQueryEnabled && isEventVisible }
  );

  const {
    hasNextPage: hasTimeseriesNextPage,
    fetchNextPage: hasTimeseriesFetchNextPage,
    isLoading: isTimeseriesLoading,
    data: relatedTimeseries,
  } = useTimeseriesListQuery(
    { filter: { assetIds } },
    { enabled: isQueryEnabled && isTimeseriesVisible }
  );

  const {
    hasNextPage: hasDocumentsNextPage,
    fetchNextPage: hasDocumentsFetchNextPage,
    isLoading: isDocumentsLoading,
    results: relatedDocuments = [],
  } = useDocumentSearchResultQuery(
    {
      filter: {
        assetSubtreeIds: assetIds.map((value) => ({
          value,
        })),
      },
    },
    { enabled: isQueryEnabled && isFileVisible }
  );

  const {
    hasNextPage: hasSequencesNextPage,
    fetchNextPage: hasSequencesFetchNextPage,
    isLoading: isSequencesLoading,
    data: sequences = [],
  } = useSequenceListQuery(
    {
      filter: {
        assetIds,
      },
    },
    { enabled: isQueryEnabled && isSequenceVisible }
  );

  const enableDetailTableSelection = selectionMode === 'multiple';
  return (
    <ResourceDetailsTemplate
      title={timeseries ? timeseries.name || '' : ''}
      icon="Timeseries"
      isSelected={isSelected}
      onClose={onClose}
      onSelectClicked={onSelect}
    >
      <StyledCollapse accordion ghost defaultActiveKey="preview">
        {timeseries ? (
          <Collapse.Panel key="preview" header={<h4>Preview</h4>}>
            <TimeseriesChart
              timeseriesId={timeseries.id}
              height={300}
              numberOfPoints={100}
              variant="medium"
              dataFetchOptions={{
                mode: 'aggregate',
              }}
              autoRange
            />
          </Collapse.Panel>
        ) : null}
        <Collapse.Panel key="timeseries-details" header={<h4>Details</h4>}>
          {timeseries ? (
            <TimeseriesInfo timeseries={timeseries} />
          ) : (
            <Title level={5}>No Details Available</Title>
          )}
        </Collapse.Panel>
        {isAssetVisible && (
          <Collapse.Panel header={<h4>Assets</h4>}>
            <AssetDetailsTable
              id="related-asset-timeseries-details"
              data={relatedAssets}
              isLoadingMore={isAssetsLoading}
              enableSelection={enableDetailTableSelection}
              selectedRows={selectedRows?.asset || EMPTY_OBJECT}
              onRowSelection={(updater, currentAssets) =>
                onSelect?.(updater, currentAssets, ViewType.Asset)
              }
            />
          </Collapse.Panel>
        )}
        {isTimeseriesVisible && (
          <Collapse.Panel
            key="event-timeseries-detail"
            header={<h4>{TIME_SERIES}</h4>}
          >
            <TimeseriesDetailsTable
              id="timeseries-resource-event-detail-table"
              data={relatedTimeseries}
              hasNextPage={hasTimeseriesNextPage}
              fetchMore={hasTimeseriesFetchNextPage}
              isDataLoading={isParentTimeseriesLoading || isTimeseriesLoading}
              enableSelection={enableDetailTableSelection}
              selectedRows={selectedRows?.timeSeries || EMPTY_OBJECT}
              onRowSelection={(updater, currentTimeseries) =>
                onSelect?.(updater, currentTimeseries, ViewType.TimeSeries)
              }
            />
          </Collapse.Panel>
        )}
        {isFileVisible && (
          <Collapse.Panel
            key="timeseries-documents-detail"
            header={<h4>{FILES}</h4>}
          >
            <FileDetailsTable
              id="documents-resource-timeseries-detail-table"
              data={relatedDocuments}
              hasNextPage={hasDocumentsNextPage}
              fetchMore={hasDocumentsFetchNextPage}
              isDataLoading={isParentTimeseriesLoading || isDocumentsLoading}
              enableSelection={enableDetailTableSelection}
              selectedRows={selectedRows?.file || EMPTY_OBJECT}
              onRowSelection={(updater, currentFiles) =>
                onSelect?.(updater, currentFiles, ViewType.File)
              }
            />
          </Collapse.Panel>
        )}
        {isEventVisible && (
          <Collapse.Panel
            key="timeseries-events-detail"
            header={<h4>{EVENTS}</h4>}
          >
            <EventDetailsTable
              id="event-resource-timeseries-detail-table"
              data={events}
              hasNextPage={hasEventNextPage}
              fetchMore={hasEventFetchNextPage}
              isDataLoading={isParentTimeseriesLoading || isEventsLoading}
              enableSelection={enableDetailTableSelection}
              selectedRows={selectedRows?.event || EMPTY_OBJECT}
              onRowSelection={(updater, currentEvents) =>
                onSelect?.(updater, currentEvents, ViewType.Event)
              }
            />
          </Collapse.Panel>
        )}
        {isSequenceVisible && (
          <Collapse.Panel
            key="timeseries-sequence-detail"
            header={<h4>{SEQUENCES}</h4>}
          >
            <SequenceDetailsTable
              id="sequence-resource-timeseries-detail-table"
              data={sequences}
              hasNextPage={hasSequencesNextPage}
              fetchMore={hasSequencesFetchNextPage}
              isDataLoading={isParentTimeseriesLoading || isSequencesLoading}
              enableSelection={enableDetailTableSelection}
              selectedRows={selectedRows?.sequence || EMPTY_OBJECT}
              onRowSelection={(updater, currentSequences) =>
                onSelect?.(updater, currentSequences, ViewType.Sequence)
              }
            />
          </Collapse.Panel>
        )}
      </StyledCollapse>
    </ResourceDetailsTemplate>
  );
};

const StyledCollapse = styled(Collapse)`
  overflow: auto;
`;