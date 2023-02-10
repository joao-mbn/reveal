import React, { useMemo } from 'react';

import {
  Table,
  TableProps,
} from '@data-exploration-components/components/Table/Table';

import { DocumentNamePreview } from './DocumentNamePreview';
import { DocumentContentPreview } from './DocumentContentPreview';
import { ColumnDef, Row } from '@tanstack/react-table';
import {
  InternalDocument,
  useDocumentsMetadataKeys,
} from '@data-exploration-lib/domain-layer';
import {
  DASH,
  getMetadataValueByKey,
} from '@data-exploration-components/utils';
import { useGetHiddenColumns } from '@data-exploration-components/hooks';
import { Body } from '@cognite/cogs.js';

import {
  TimeDisplay,
  ResourceTableColumns,
} from '@data-exploration-components/components';

export type DocumentWithRelationshipLabels = InternalDocument;

// TODO: Might need to add RelationshipLabels at some point.
export type DocumentTableProps = Omit<
  TableProps<DocumentWithRelationshipLabels>,
  'columns'
> & {
  query?: string;
};

const visibleColumns = [
  'name',
  'content',
  'type',
  'modifiedTime',
  'createdTime',
  'rootAsset',
];

export const DocumentsTable = (props: DocumentTableProps) => {
  const { query } = props;
  const { data: metadataKeys } = useDocumentsMetadataKeys();

  const metadataColumns = useMemo(() => {
    return (metadataKeys || []).map((key: string) =>
      ResourceTableColumns.metadata(key, (row: any) =>
        getMetadataValueByKey(key, row?.sourceFile?.metadata)
      )
    );
  }, [metadataKeys]);

  const columns = useMemo(
    () =>
      [
        {
          ...Table.Columns.name(),
          enableHiding: false,
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
              <DocumentContentPreview document={row.original} query={''} />
            );
          },
          enableSorting: false,
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
          enableSorting: false,
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
          ...Table.Columns.rootAsset(),
          accessorFn: (doc) => doc?.assetIds?.length && doc.assetIds[0],
        },
        Table.Columns.assets,
        Table.Columns.externalId(),
        Table.Columns.id(),
        ...metadataColumns,
      ] as ColumnDef<DocumentWithRelationshipLabels>[],
    [query, metadataColumns]
  );

  // const updatedColumns =
  //   getNewColumnsWithRelationshipLabels<DocumentWithRelationshipLabels>(
  //     columns,
  //     relatedResourceType === 'relationship'
  //   );

  const hiddenColumns = useGetHiddenColumns(columns, visibleColumns);

  return (
    <Table
      {...props}
      columns={columns}
      hiddenColumns={hiddenColumns}
      data={props.data}
    />
  );
};
