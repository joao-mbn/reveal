import { useMemo } from 'react';

import {
  getTableColumns,
  SubCellMatchingLabels,
  Table,
  TableProps,
  ThreeDModelCell,
} from '@data-exploration/components';
import { ColumnDef } from '@tanstack/react-table';
import noop from 'lodash/noop';

import { getHiddenColumns, useTranslation } from '@data-exploration-lib/core';
import {
  AssetWithRelationshipLabels,
  InternalAssetDataWithMatchingLabels,
} from '@data-exploration-lib/domain-layer';

import { useAssetsMetadataColumns } from '../useAssetsMetadataColumns';

const visibleColumns = ['name', 'rootId'];
export const AssetTable = ({
  onRowClick = noop,
  data,
  query,
  ...rest
}: Omit<TableProps<AssetWithRelationshipLabels>, 'columns'>) => {
  const { metadataColumns, setMetadataKeyQuery } = useAssetsMetadataColumns();
  const { t } = useTranslation();
  const tableColumns = getTableColumns(t);

  const columns = useMemo(
    () =>
      [
        {
          ...tableColumns.name(query),
          enableHiding: false,
        },
        tableColumns.description(query),
        tableColumns.externalId(query),
        tableColumns.rootAsset((rootAsset) => onRowClick(rootAsset)),
        {
          accessorKey: 'id',
          header: t('3D_AVAILABILITY', '3D availability'),
          cell: ({ getValue }) => (
            <ThreeDModelCell assetId={getValue<number>()} />
          ),
          size: 300,
          enableSorting: false,
        },
        tableColumns.created,
        {
          ...tableColumns.labels,
          enableSorting: false,
        },
        tableColumns.source(query),
        { ...tableColumns.dataSet, enableSorting: true },
        ...metadataColumns,
      ] as ColumnDef<AssetWithRelationshipLabels>[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metadataColumns, query]
  );

  const hiddenColumns = getHiddenColumns(columns, visibleColumns);

  return (
    <Table<InternalAssetDataWithMatchingLabels>
      data={data || []}
      columns={columns}
      onRowClick={onRowClick}
      hiddenColumns={hiddenColumns}
      renderCellSubComponent={SubCellMatchingLabels}
      onChangeSearchInput={setMetadataKeyQuery}
      {...rest}
    />
  );
};