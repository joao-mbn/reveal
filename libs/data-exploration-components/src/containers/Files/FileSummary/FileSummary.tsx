import { ColumnDef } from '@tanstack/react-table';

import {
  ResourceTableColumns,
  Table,
} from '@data-exploration-components/components/Table';
import React, { useMemo } from 'react';
import { getSummaryCardItems } from '@data-exploration-components/components/SummaryHeader/utils';
import {
  useResourceResults,
  FileTable,
} from '@data-exploration-components/containers';
import { convertResourceType } from '@data-exploration-components/types';
import { FileInfo } from '@cognite/sdk';
import {
  InternalFilesFilters,
  useDocumentsMetadataKeys,
} from '@data-exploration-lib/domain-layer';
import { SummaryHeader } from '@data-exploration-components/components/SummaryHeader/SummaryHeader';
import { FileNamePreview } from '../FileTable/FileNamePreview';
import { useGetHiddenColumns } from '@data-exploration-components/hooks';

export const FileSummary = ({
  query = '',
  filter = {},
  onAllResultsClick,
  onRowClick,
}: {
  query?: string;
  filter?: InternalFilesFilters;
  onAllResultsClick?: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onRowClick?: (row: FileInfo) => void;
}) => {
  const api = convertResourceType('file');
  const { items: results, isFetching: isLoading } =
    useResourceResults<FileInfo>(api, query, filter);

  const { data: metadataKeys } = useDocumentsMetadataKeys();

  const metadataColumns: ColumnDef<FileInfo>[] = useMemo(() => {
    return (metadataKeys || []).map((key: string) =>
      ResourceTableColumns.metadata(key)
    );
  }, [metadataKeys]);

  const columns = useMemo(
    () =>
      [
        {
          ...Table.Columns.name(),
          cell: ({ getValue, row }) => {
            const fileName = getValue<string>();
            const fileNamePreviewProps = {
              fileName,
              file: row.original,
              query,
            };
            return <FileNamePreview {...fileNamePreviewProps} />;
          },
        },
        Table.Columns.mimeType,
        Table.Columns.externalId(query),
        Table.Columns.id(query),
        Table.Columns.uploadedTime,
        Table.Columns.lastUpdatedTime,
        Table.Columns.created,
        Table.Columns.dataSet,
        Table.Columns.source,
        Table.Columns.assets,
        Table.Columns.labels,
        ...metadataColumns,
      ] as ColumnDef<FileInfo>[],
    [query, metadataColumns]
  );
  const hiddenColumns = useGetHiddenColumns(columns, ['name', 'content']);

  return (
    <Table
      columns={columns}
      hiddenColumns={hiddenColumns}
      data={getSummaryCardItems(results)}
      isDataLoading={isLoading}
      id="file-summary-table"
      onRowClick={onRowClick}
      columnSelectionLimit={2}
      enableColumnResizing={false}
      tableHeaders={
        <SummaryHeader
          icon="Document"
          title="Files"
          onAllResultsClick={onAllResultsClick}
        />
      }
    />
  );
};
