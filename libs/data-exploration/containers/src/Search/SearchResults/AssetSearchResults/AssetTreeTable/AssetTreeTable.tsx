import React, { useEffect, useState, useMemo, Suspense } from 'react';

import {
  EmptyState,
  HighlightCell,
  HierarchyExtraRow,
  SubCellMatchingLabels,
  Table,
  ThreeDModelCell,
  getTableColumns,
} from '@data-exploration/components';
import { ColumnDef } from '@tanstack/react-table';
import { ExpandedState } from '@tanstack/table-core';
import gt from 'lodash/gt';

import { Icon } from '@cognite/cogs.js';
import { Asset } from '@cognite/sdk';

import {
  DASH,
  getHiddenColumns,
  InternalAssetFilters,
  useGetSearchConfigFromLocalStorage,
  useTranslation,
} from '@data-exploration-lib/core';
import {
  InternalAssetTreeData,
  useRootAssetsQuery,
  useSearchAssetTree,
} from '@data-exploration-lib/domain-layer';

import { useAssetsMetadataColumns } from '../useAssetsMetadataColumns';

import { useRootPath } from './hooks';

const visibleColumns = ['name', 'rootId'];

export const AssetTreeTable = ({
  filter = {},
  query,
  onAssetClicked,
  onAssetSeeMoreClicked,
  selectedRows,
  tableHeaders,
  scrollIntoViewRow,
  tableSubHeaders,
}: {
  filter: InternalAssetFilters;
  query?: string;
  onAssetClicked: (item: Asset) => void;
  onAssetSeeMoreClicked: (item: Asset) => void;
  hierachyRootId?: number;
  disableScroll?: boolean;
  tableHeaders?: React.ReactElement;
  selectedRows?: Record<string, boolean>;
  scrollIntoViewRow?: string | number; //Scroll into center row when the selectedRows changes
  tableSubHeaders?: React.ReactElement;
}) => {
  const { t } = useTranslation();

  const [rootExpanded, setRootExpanded] = useState<ExpandedState>({});
  const [searchExpanded, setSearchExpanded] = useState<ExpandedState>({});

  const { metadataColumns, setMetadataKeyQuery } = useAssetsMetadataColumns();

  const rootExpandedKeys = useMemo(() => {
    return Object.keys(rootExpanded).reduce((previousValue, currentValue) => {
      return [...previousValue, Number(currentValue)];
    }, [] as number[]);
  }, [rootExpanded]);

  const assetSearchConfig = useGetSearchConfigFromLocalStorage('asset');

  const rootAssetTree = useRootAssetsQuery(rootExpandedKeys);
  const {
    data: searchAssetTree,
    fetchNextPage,
    hasNextPage,
  } = useSearchAssetTree(
    {
      query,
      assetFilter: filter,
      sortBy: [],
    },
    assetSearchConfig
  );

  const startFromRoot = useMemo(() => {
    return (
      (!query || query === '') &&
      Object.values(filter).filter(Boolean).length === 0
    );
  }, [query, filter]);

  const assetId = useMemo(() => {
    if (selectedRows && Object.keys(selectedRows).length === 1) {
      return Number(Object.keys(selectedRows)[0]);
    }

    return undefined;
  }, [selectedRows]);

  const { data: rootPath, isFetched: rootPathFetched } = useRootPath(assetId);

  useEffect(() => {
    if (startFromRoot && rootPath && rootPathFetched) {
      setRootExpanded(
        rootPath.reduce((previousValue, currentValue) => {
          return {
            ...previousValue,
            [currentValue]: true,
          };
        }, {})
      );
    }
  }, [rootPathFetched, rootPath, startFromRoot]);

  useEffect(() => {
    if (
      (!query || query === '') &&
      Object.values(filter).filter(Boolean).length === 0
    ) {
      setSearchExpanded({});
    } else {
      // this automatically expands all rows
      setSearchExpanded(true);
    }
  }, [query, filter]);

  const tableColumns = getTableColumns(t);

  const columns = React.useMemo(
    () =>
      [
        {
          header: t('NAME', 'Name'),
          accessorKey: 'name',
          enableHiding: false,
          cell: ({ row, getValue }) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: `${row.depth * 2}rem`,
              }}
            >
              {row.getCanExpand() && (
                <Icon
                  type={row.getIsExpanded() ? 'ChevronUp' : 'ChevronDown'}
                  {...{
                    onClick: (event: any) => {
                      event.preventDefault();
                      event.stopPropagation();
                      row.toggleExpanded();
                    },
                    style: {
                      cursor: 'pointer',
                      marginRight: '8px',
                      height: '16px',
                      flexShrink: 0,
                    },
                  }}
                />
              )}
              <HighlightCell
                text={getValue<string>() || DASH}
                lines={1}
                query={query}
              />
            </div>
          ),
          meta: {
            isExpandable: true,
          },
        },
        tableColumns.description(query),
        tableColumns.externalId(query),
        {
          id: 'childCount',
          header: startFromRoot
            ? t('DIRECT_CHILDREN', 'Direct children')
            : t('RESULTS_UNDER_ASSET', 'Results under asset'),
          accessorKey: 'aggregates',
          cell: ({ getValue }) => {
            return (
              <span>
                {getValue() && getValue<{ childCount: number }>()?.childCount
                  ? getValue<{ childCount: number }>()?.childCount
                  : DASH}
              </span>
            );
          },
          size: 300,
        },
        {
          id: 'threeDModels',
          header: t('3D_AVAILABILITY', '3D availability'),
          cell: ({ row }) => <ThreeDModelCell assetId={row.original.id} />,
          size: 300,
        },
        tableColumns.source(query),
        tableColumns.dataSet,
        ...metadataColumns,
      ] as ColumnDef<InternalAssetTreeData>[],
    [query, startFromRoot, metadataColumns]
  );

  const getData = () => {
    if (startFromRoot) {
      return rootAssetTree || [];
    }

    return searchAssetTree;
  };

  const hiddenColumns = getHiddenColumns(columns, visibleColumns);

  return (
    <Suspense fallback={<EmptyState isLoading={true} />}>
      <Table<InternalAssetTreeData>
        id="asset-tree-table"
        data={getData()}
        columns={columns}
        tableHeaders={tableHeaders}
        enableExpanding
        selectedRows={selectedRows}
        showLoadButton={!startFromRoot}
        scrollIntoViewRow={scrollIntoViewRow}
        hasNextPage={hasNextPage}
        fetchMore={fetchNextPage}
        getCanRowExpand={
          startFromRoot
            ? (row) => {
                return gt(row.original.aggregates?.childCount, 0);
              }
            : undefined
        }
        getSubrowData={(originalRow) => {
          return originalRow.children;
        }}
        expandedRows={startFromRoot ? rootExpanded : searchExpanded}
        onRowClick={onAssetClicked}
        tableSubHeaders={tableSubHeaders}
        hiddenColumns={hiddenColumns}
        onRowExpanded={(expanded) => {
          if (startFromRoot) {
            setRootExpanded(expanded);
          } else {
            setSearchExpanded(expanded);
          }
        }}
        renderSubRowComponent={(row) =>
          HierarchyExtraRow(row, onAssetSeeMoreClicked, t)
        }
        renderCellSubComponent={SubCellMatchingLabels}
        onChangeSearchInput={setMetadataKeyQuery}
      />
    </Suspense>
  );
};