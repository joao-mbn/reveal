import { ColumnDef, Row } from '@tanstack/react-table';
import {
  InternalDocument,
  InternalDocumentFilter,
  useDocumentSearchResultQuery,
  useDocumentsMetadataKeys,
} from '@data-exploration-lib/domain-layer';

import {
  ResourceTableColumns,
  SummaryCardWrapper,
  Table,
} from '@data-exploration-components/components/Table';
import React, { useMemo } from 'react';

import { getSummaryCardItems } from '@data-exploration-components/components/SummaryHeader/utils';
import {
  DocumentWithRelationshipLabels,
  DocumentNamePreview,
  DocumentContentPreview,
} from '@data-exploration-components/containers';
import { SummaryHeader } from '@data-exploration-components/components/SummaryHeader/SummaryHeader';
import {
  DASH,
  getMetadataValueByKey,
} from '@data-exploration-components/utils';
import { Body } from '@cognite/cogs.js';
import { TimeDisplay } from '@data-exploration-components/components';
import { useGetHiddenColumns } from '@data-exploration-components/hooks';
import { Asset } from '@cognite/sdk';

export const DocumentSummary = ({
  query = '',
  filter = {},
  onAllResultsClick,
  onRowClick,
  onRootAssetClick,
}: {
  query?: string;
  filter?: InternalDocumentFilter;
  onAllResultsClick?: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onRowClick?: (row: InternalDocument) => void;
  onRootAssetClick?: (rootAsset: Asset, resourceId?: number) => void;
}) => {
  const { results, isLoading } = useDocumentSearchResultQuery({
    query,
    filter,
  });
  const { data: metadataKeys } = useDocumentsMetadataKeys();

  const metadataColumns = useMemo(() => {
    return (metadataKeys || []).map((key: string) =>
      ResourceTableColumns.metadata(key, (row) =>
        getMetadataValueByKey(key, row?.sourceFile?.metadata)
      )
    );
  }, [metadataKeys]);

  const columns = useMemo(
    () =>
      [
        {
          ...Table.Columns.name(),
          cell: ({ row }: { row: Row<DocumentWithRelationshipLabels> }) => {
            const fileNamePreviewProps = {
              fileName: row.original.name || '',
              file: row.original,
            };
            return (
              <DocumentNamePreview {...fileNamePreviewProps} query={query} />
            );
          },
        },
        {
          accessorKey: 'content',
          header: 'Content',
          cell: ({ row }: { row: Row<InternalDocument> }) => {
            return (
              <DocumentContentPreview document={row.original} query={query} />
            );
          },
        },
        {
          accessorKey: 'author',
          id: 'author',
          header: 'Author',
          cell: ({ row }: { row: Row<InternalDocument> }) => {
            return <Body level={2}>{row.original.author || DASH}</Body>;
          },
        },
        {
          id: 'directory',
          header: 'Directory',
          cell: ({ row }) => {
            return (
              <Body level={2}>
                {row.original?.sourceFile?.directory || DASH}
              </Body>
            );
          },
        },
        {
          // You do not have to add an id field if accessor is given a string.
          accessorKey: 'type',
          header: 'File type',
          cell: ({ row }: { row: Row<InternalDocument> }) => {
            return <Body level={2}>{row.original.type}</Body>;
          },
        },
        {
          accessorKey: 'modifiedTime',
          header: 'Last updated',
          cell: ({ row }: { row: Row<InternalDocument> }) => (
            <Body level={2}>
              <TimeDisplay value={row.original.modifiedTime} />
            </Body>
          ),
        },
        Table.Columns.created,
        {
          ...Table.Columns.rootAsset(onRootAssetClick),
          accessorFn: (doc) => doc?.assetIds?.length && doc.assetIds[0],
        },
        Table.Columns.externalId(query),
        Table.Columns.id(query),
        {
          ...Table.Columns.dataset,
          accessorFn: (document) => document.sourceFile.datasetId,
        },
        ...metadataColumns,
      ] as ColumnDef<DocumentWithRelationshipLabels>[],
    [query, metadataColumns, onRootAssetClick]
  );
  const hiddenColumns = useGetHiddenColumns(columns, ['name', 'content']);
  return (
    <SummaryCardWrapper>
      <Table
        id="document-summary-table"
        columns={columns}
        hiddenColumns={hiddenColumns}
        data={getSummaryCardItems(results)}
        columnSelectionLimit={2}
        isDataLoading={isLoading}
        tableHeaders={
          <SummaryHeader
            icon="Document"
            title="Files"
            onAllResultsClick={onAllResultsClick}
          />
        }
        enableColumnResizing={false}
        onRowClick={onRowClick}
      />
    </SummaryCardWrapper>
  );
};
