import React, { useMemo } from 'react';

import {
  SubCellMatchingLabels,
  SummaryCardWrapper,
  Table,
} from '@data-exploration/components';
import { useSequencesMetadataColumns } from '@data-exploration/containers';
import { SummaryHeader } from '@data-exploration-components/components/SummaryHeader/SummaryHeader';
import { getSummaryCardItems } from '@data-exploration-components/components/SummaryHeader/utils';
import {
  EMPTY_OBJECT,
  getHiddenColumns,
  InternalSequenceFilters,
  useGetSearchConfigFromLocalStorage,
} from '@data-exploration-lib/core';
import {
  useSequenceSearchResultWithMatchingLabelsQuery,
  InternalSequenceDataWithMatchingLabels,
} from '@data-exploration-lib/domain-layer';
import { ColumnDef } from '@tanstack/react-table';

import { Asset, Sequence } from '@cognite/sdk';

export const SequenceSummary = ({
  query = '',
  filter = EMPTY_OBJECT,
  onAllResultsClick,
  onRowClick,
  onRootAssetClick,
  isAdvancedFiltersEnabled = false,
}: {
  query?: string;
  filter: InternalSequenceFilters;
  onAllResultsClick?: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onRowClick?: (row: Sequence) => void;
  onRootAssetClick?: (rootAsset: Asset, resourceId?: number) => void;
  isAdvancedFiltersEnabled?: boolean;
}) => {
  const sequenceSearchConfig = useGetSearchConfigFromLocalStorage('sequence');

  const { isLoading, data } = useSequenceSearchResultWithMatchingLabelsQuery(
    {
      filter,
      query,
    },
    sequenceSearchConfig
  );

  const { metadataColumns, setMetadataKeyQuery } =
    useSequencesMetadataColumns();

  const columns = useMemo(
    () =>
      [
        Table.Columns.name(),
        Table.Columns.description(),
        Table.Columns.externalId(),
        Table.Columns.columns,
        Table.Columns.lastUpdatedTime,
        Table.Columns.created,
        Table.Columns.id(query),
        Table.Columns.rootAsset(onRootAssetClick),
        Table.Columns.dataSet,
        ...metadataColumns,
      ] as ColumnDef<Sequence>[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metadataColumns]
  );

  const hiddenColumns = getHiddenColumns(columns, ['name', 'description']);

  return (
    <SummaryCardWrapper>
      <Table<InternalSequenceDataWithMatchingLabels>
        columns={columns}
        hiddenColumns={hiddenColumns}
        data={getSummaryCardItems(data)}
        columnSelectionLimit={2}
        id="sequence-summary-table"
        isDataLoading={isLoading}
        tableHeaders={
          <SummaryHeader
            icon="Sequences"
            title="Sequence"
            onAllResultsClick={onAllResultsClick}
          />
        }
        enableColumnResizing={false}
        onRowClick={onRowClick}
        renderCellSubComponent={
          isAdvancedFiltersEnabled ? SubCellMatchingLabels : undefined
        }
        query={query}
        onChangeSearchInput={setMetadataKeyQuery}
      />
    </SummaryCardWrapper>
  );
};