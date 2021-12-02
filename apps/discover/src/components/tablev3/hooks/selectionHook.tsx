/* eslint-disable @typescript-eslint/ban-types */
import { HeaderProps, Hooks } from 'react-table';

import get from 'lodash/get';

import { Checkbox } from '@cognite/cogs.js';

import { TableProps } from '../types';

export const SELECTION_COLUMN_ID = 'selection';

type SelectionHookProps<T extends Object> = Pick<
  TableProps<T>,
  'handleRowSelect' | 'handleRowsSelect' | 'checkIfCheckboxEnabled'
>;
export const selectionHook =
  <T extends Object>({
    handleRowSelect,
    handleRowsSelect,
    checkIfCheckboxEnabled,
  }: SelectionHookProps<T>) =>
  (hooks: Hooks<T>) => {
    hooks.visibleColumns.push((restOfColumns) => [
      // Let's make a column for selection
      {
        id: SELECTION_COLUMN_ID,
        disableResizing: true,
        width: '30px',
        // The header can use the table's getToggleAllRowsSelectedProps method
        // to render a checkbox
        // @ts-expect-error unknown issue
        Header: ({ getToggleAllRowsSelectedProps, rows }: HeaderProps<T>) => {
          const selectedRowCount = rows.filter(
            (row: any) => row.isSelected
          ).length;
          const allSelected = selectedRowCount === rows.length;
          const {
            checked: _unused1,
            onChange: _unused2,
            ...rest
          } = getToggleAllRowsSelectedProps();
          const onCheckboxChanged = (nextState: boolean) => {
            if (handleRowsSelect) {
              handleRowsSelect(nextState);
            }
          };
          const isSelected = allSelected || false;
          const isIndeterminate = !allSelected && !!selectedRowCount;
          return (
            <Checkbox
              {...rest}
              checked={isSelected || isIndeterminate}
              indeterminate={isIndeterminate}
              onChange={onCheckboxChanged}
            />
          );
        },
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({ row }: Hooks<T>) => {
          const {
            checked,
            onChange: _unused3,
            ...rest
          } = row.getToggleRowSelectedProps();
          const isSelected = row.selected || checked || false;
          const onCheckboxChanged = (nextState: boolean) => {
            if (handleRowSelect) {
              handleRowSelect(row, nextState);
            }
          };
          const isCheckboxEnabled = checkIfCheckboxEnabled
            ? checkIfCheckboxEnabled(row)
            : true;

          return (
            <Checkbox
              {...rest}
              checked={isSelected}
              indeterminate={get(row, 'isIndeterminate', false)}
              onChange={onCheckboxChanged}
              disabled={!isCheckboxEnabled}
            />
          );
        },
      },
      ...restOfColumns,
    ]);
  };
