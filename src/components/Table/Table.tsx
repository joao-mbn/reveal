import { ExpandedState } from '@tanstack/table-core';
import isEmpty from 'lodash/isEmpty';
import React, { useEffect, useMemo, useRef } from 'react';

import {
  Row,
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getSortedRowModel,
  getExpandedRowModel,
  SortingState,
  OnChangeFn,
} from '@tanstack/react-table';
import { DASH, useLocalStorageState } from '../../utils';
import { isElementHorizontallyInViewport } from '../../utils/isElementHorizontallyInViewport';
import { ColumnToggle } from './ColumnToggle';

import {
  TableContainer,
  ColumnSelectorWrapper,
  StyledTable,
  LoadMoreButtonWrapper,
  Tr,
  ThWrapper,
  Th,
  Td,
  Thead,
  ContainerInside,
  StyledFlex,
  ResizerWrapper,
  SubTableWrapper,
  Tbody,
} from './elements';

import { Body, Detail, Flex } from '@cognite/cogs.js';

import { SortIcon } from './SortIcon';
import { ResourceTableColumns } from './columns';
import { LoadMore, LoadMoreProps } from './LoadMore';
import { EmptyState } from 'components/EmpyState/EmptyState';

export interface TableProps<T extends Record<string, any>>
  extends LoadMoreProps {
  id: string;
  data: T[];
  isDataLoading?: boolean;
  columns: ColumnDef<T>[];
  selectedRows?: Record<string, boolean>;
  expandedRows?: ExpandedState;
  enableSorting?: boolean;
  stickyHeader?: boolean;
  showLoadButton?: boolean;
  enableExpanding?: boolean;
  tableHeaders?: React.ReactElement;
  tableSubHeaders?: React.ReactElement;
  enableColumnResizing?: boolean;
  hideColumnToggle?: boolean;
  hiddenColumns?: string[];
  scrollIntoViewRow?: string | number; //Scroll into center row when the selectedRows changes
  onSort?: OnChangeFn<SortingState>;
  sorting?: SortingState;
  onRowClick?: (
    row: T,
    evt?: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  getCanRowExpand?: (row: Row<T>) => boolean;
  getSubrowData?: (originalRow: T, index: number) => undefined | T[];
  onRowExpanded?: OnChangeFn<ExpandedState>;
}

export type TableData = Record<string, any>;

Table.Columns = ResourceTableColumns;

export function Table<T extends TableData>({
  id,
  data,
  columns,
  onRowClick = () => {},
  onSort,
  enableSorting = false,
  expandedRows,
  selectedRows,
  scrollIntoViewRow,
  stickyHeader = true,
  enableColumnResizing = true,
  sorting,
  showLoadButton = false,
  hasNextPage,
  isDataLoading,
  isLoadingMore,
  tableHeaders,
  tableSubHeaders,
  fetchMore,
  hiddenColumns,
  hideColumnToggle,
  getCanRowExpand,
  getSubrowData,
  enableExpanding,
  onRowExpanded,
}: TableProps<T>) {
  const defaultColumn: Partial<ColumnDef<T, unknown>> = useMemo(
    () => ({
      minSize: 200,
      size: 400,
    }),
    []
  );

  const tbodyRef = useRef<HTMLDivElement>(null);

  // To add the navigation in the row
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    row: Row<T>
  ) => {
    event.stopPropagation();
    if (tbodyRef.current) {
      const currentRow = tbodyRef.current?.children.namedItem(row.id);

      switch (event.key) {
        case 'ArrowUp':
          // @ts-ignore
          currentRow?.previousElementSibling?.focus();
          break;
        case 'ArrowDown':
          // @ts-ignore
          currentRow?.nextElementSibling?.focus();
          break;
        case 'Enter':
          onRowClick(row.original);
          break;
        default:
          break;
      }
    }
  };

  const [columnVisibility, setColumnVisibility] = useLocalStorageState(
    id,
    (hiddenColumns || []).reduce((previousValue, currentValue) => {
      return {
        ...previousValue,
        [currentValue]: false,
      };
    }, {})
  );

  const getRowId = React.useCallback(
    (originalRow: T, index: number, parent?: Row<T>) => {
      return (
        originalRow.id ||
        originalRow.key ||
        (parent ? [parent.id, index].join('.') : index)
      );
    },
    []
  );

  const { getHeaderGroups, getRowModel, getAllLeafColumns, setColumnOrder } =
    useReactTable<T>({
      data,
      columns: columns,
      state: {
        sorting,
        columnVisibility,
        expanded: expandedRows,
        rowSelection: selectedRows || {},
      },
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      onSortingChange: onSort,
      onColumnVisibilityChange: setColumnVisibility,
      onExpandedChange: onRowExpanded,
      enableSorting: enableSorting,
      manualSorting: !!onSort,
      columnResizeMode: 'onChange',
      enableHiding: true,
      enableExpanding: enableExpanding,
      defaultColumn: defaultColumn,
      getRowCanExpand: getCanRowExpand,
      getSubRows: getSubrowData,
      getRowId: getRowId,
      autoResetExpanded: false,
      enableSortingRemoval: true,
      // https://github.com/TanStack/table/issues/4289
      // Fixes the weird behavior with the sorting actions on undefined and async data.
      sortDescFirst: false,
    });

  useEffect(() => {
    if (scrollIntoViewRow) {
      const rowElement = document.querySelector(
        `[id="${id}"] [id="${scrollIntoViewRow}"]`
      );
      if (rowElement && !isElementHorizontallyInViewport(rowElement)) {
        rowElement.scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'center',
        });
      }
    }
  }, [id, scrollIntoViewRow]);

  const handleToggleAllVisibility = (visible: boolean) => {
    setColumnVisibility(
      getAllLeafColumns().reduce((previousValue, currentValue) => {
        if (currentValue.getCanHide()) {
          return { ...previousValue, [currentValue.id]: visible };
        }
        return previousValue;
      }, {})
    );
  };

  const loadMoreProps = { isLoadingMore, hasNextPage, fetchMore };

  const renderTableContent = () => {
    if (isDataLoading) {
      return <EmptyState isLoading title="Loading results" />;
    }

    if (!data || data.length === 0) {
      return <EmptyState body="Please, refine your filters" />;
    }

    return (
      <ContainerInside>
        <StyledTable id={id} className="data-exploration-table">
          <Thead isStickyHeader={stickyHeader}>
            {getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th
                    {...{
                      key: header.id,
                      colSpan: header.colSpan,
                      style: {
                        width: header.getSize(),
                      },
                    }}
                  >
                    <ThWrapper>
                      <Flex direction="column" gap={6}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.columnDef.meta && (
                          <Detail>Metadata</Detail>
                        )}
                      </Flex>
                      <SortIcon
                        canSort={header.column.getCanSort()}
                        isSorted={header.column.getIsSorted()}
                        onClick={() => {
                          header.column.toggleSorting();
                        }}
                      />
                      {enableColumnResizing ? (
                        <ResizerWrapper
                          {...{
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                            className: `resizer ${
                              header.column.getIsResizing() ? 'isResizing' : ''
                            }`,
                          }}
                        />
                      ) : null}
                    </ThWrapper>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody ref={tbodyRef}>
            {getRowModel().rows.map(row => {
              return (
                <Tr
                  key={row.id}
                  id={row.id}
                  tabIndex={0}
                  onClick={evt => onRowClick(row.original, evt)}
                  onKeyDown={evt => handleKeyDown(evt, row)}
                  className={row.getIsSelected() ? 'selected' : ''}
                >
                  {row.getVisibleCells().map(cell => {
                    return (
                      <Td
                        {...{
                          key: cell.id,
                          style: {
                            width: cell.column.getSize(),
                          },
                        }}
                      >
                        <Body level={2}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          ) || DASH}
                        </Body>
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </StyledTable>
        {showLoadButton && (
          <LoadMoreButtonWrapper justifyContent="center" alignItems="center">
            <LoadMore {...loadMoreProps} />
          </LoadMoreButtonWrapper>
        )}
      </ContainerInside>
    );
  };

  return (
    <TableContainer>
      {tableHeaders || !isEmpty(hiddenColumns) ? (
        <ColumnSelectorWrapper>
          {tableHeaders}
          {!hideColumnToggle && (
            <StyledFlex>
              <ColumnToggle<T>
                onColumnOrderChanged={setColumnOrder}
                allColumns={getAllLeafColumns()}
                toggleAllColumnsVisible={handleToggleAllVisibility}
              />
            </StyledFlex>
          )}
        </ColumnSelectorWrapper>
      ) : null}

      {tableSubHeaders && <SubTableWrapper>{tableSubHeaders}</SubTableWrapper>}

      {renderTableContent()}
    </TableContainer>
  );
}
