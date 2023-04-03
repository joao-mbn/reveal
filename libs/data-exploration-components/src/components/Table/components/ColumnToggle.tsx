import { Column, Updater, ColumnOrderState } from '@tanstack/table-core';
import has from 'lodash/has';
import React, { useState, Suspense, useMemo } from 'react';
import {
  Button,
  Checkbox,
  Dropdown,
  Flex,
  Input,
  Menu,
  Chip,
  SegmentedControl,
  Infobar,
  Detail,
  Body,
} from '@cognite/cogs.js';

import styled from 'styled-components';
import { TableData } from '../Table';

import {
  DragDropContainer,
  DragHandleIcon,
  WithDragHandleProps,
} from '@data-exploration-components/components/DragDropContainer';
import { HighlightCell } from './HighlightCell';
import { useMetrics } from '../../../hooks/useMetrics';
import { DATA_EXPLORATION_COMPONENT } from '../../../constants/metrics';
import { MetadataHeaderText } from '../elements';
import { MAX_COLUMN_SELECTION } from '@cognite/data-exploration';

export interface ColumnToggleProps<T extends TableData = any> {
  allColumns: () => Column<T, unknown>[];
  onColumnOrderChanged: (updater: Updater<ColumnOrderState>) => void;
  onResetSelectedColumns: () => void;
  columnSelectionLimit?: number;
  onChangeSearchInput?: (value: string) => void;
}

const style = {
  backgroundColor: 'white',
};

//Modified the example from here https://github.com/react-dnd/react-dnd/blob/main/packages/examples/src/04-sortable/simple/Card.tsx
export const MenutItemDrag: React.FC<
  React.PropsWithChildren<WithDragHandleProps<{ isDragEnabled?: boolean }>>
> = ({ dragHandleProps, children, isDragEnabled }) => {
  return (
    <FlexWrapper className="cogs-menu-item" style={style}>
      {isDragEnabled && (
        <DragHandleIcon.Vertical dragHandleProps={dragHandleProps} />
      )}
      {children}
    </FlexWrapper>
  );
};

export function ColumnToggle<T extends TableData = any>({
  allColumns,
  onColumnOrderChanged,
  onResetSelectedColumns,
  columnSelectionLimit = MAX_COLUMN_SELECTION,
  onChangeSearchInput,
}: ColumnToggleProps<T>) {
  const [searchInput, setSearchInput] = useState('');
  const [tab, setTab] = useState('All');

  const elementOrders = allColumns().map((column) => column.id);
  const trackUsage = useMetrics();

  const handleTabClick = (key: string) => {
    setTab(key);
    trackUsage(DATA_EXPLORATION_COMPONENT.SELECT.COLUMN_SELECTION_TAB, {
      tab: key,
    });
  };

  const filteredColumns = allColumns().filter((column) =>
    column.columnDef.header
      ?.toString()
      .toLowerCase()
      .includes(searchInput.toLowerCase())
  );
  const isSearchResultEmpty = filteredColumns.length === 0;

  const selectedColumns = filteredColumns.filter((column) =>
    column.getIsVisible()
  );

  const selectedTabColumns = useMemo(() => {
    return tab === 'All' ? filteredColumns : selectedColumns;
  }, [tab, filteredColumns, selectedColumns]);

  const selectedColumnsCount = allColumns().reduce((accumulator, item) => {
    return item.getIsVisible() ? accumulator + 1 : accumulator;
  }, 0);
  const isSelectedCountLimitExceedingMaxValue =
    selectedColumnsCount >= columnSelectionLimit;

  const handleColumnChange =
    (column: Column<T>) => (_: any, nextState?: boolean | string) => {
      if (nextState === true && selectedColumnsCount >= columnSelectionLimit) {
        return;
      }

      column.toggleVisibility();
      trackUsage(DATA_EXPLORATION_COMPONENT.SELECT.COLUMN_SELECTION, {
        column: column?.id,
        isSelected: !column.getIsVisible(),
      });
    };
  const isSelectedItemsEmpty = tab === 'Selected' && selectedColumnsCount === 0;

  const shouldDisableUnselectedColumnOnMaxLimit = (column: Column<T>) =>
    isSelectedCountLimitExceedingMaxValue && !column.getIsVisible();

  return (
    <Dropdown
      content={
        <Suspense fallback="...loading">
          <StyledMenu>
            <SegmentedControl
              fullWidth
              onButtonClicked={handleTabClick}
              currentKey={tab}
            >
              <StyledSegmentedButton key="All">All</StyledSegmentedButton>
              <StyledSegmentedButton key="Selected">
                Selected
                <StyledCountLabel
                  size="small"
                  label={String(selectedColumnsCount)}
                />
              </StyledSegmentedButton>
            </SegmentedControl>

            <StyledInput
              type="search"
              clearable={{ callback: () => setSearchInput('') }}
              placeholder="Filter by name"
              fullWidth
              variant="noBorder"
              value={searchInput}
              onChange={(e) => {
                const searchInputValue = e.target.value;
                setSearchInput(searchInputValue);
                onChangeSearchInput?.(searchInputValue);
              }}
            />

            {!isSearchResultEmpty && searchInput && (
              <SearchResultText>Results for "{searchInput}":</SearchResultText>
            )}

            <MenuItemsWrapper>
              <DragDropContainer
                direction="vertical"
                id="column-toggle"
                elementsOrder={elementOrders}
                onDragEnd={onColumnOrderChanged}
                isCustomPortal
              >
                {selectedTabColumns.map((column) => {
                  return (
                    <MenutItemDrag key={column.id} isDragEnabled={!searchInput}>
                      <StyledLabel>
                        <Checkbox
                          name={column.id}
                          checked={column.getIsVisible()}
                          onChange={handleColumnChange(column)}
                          className="cogs-checkbox__checkbox"
                          disabled={
                            !column.getCanHide() ||
                            shouldDisableUnselectedColumnOnMaxLimit(column)
                          }
                        />
                        <Flex direction="column">
                          <StyledHeader
                            text={column.columnDef.header?.toString()}
                          />
                          {has(column.columnDef?.meta, 'isMetadata') && (
                            <MetadataHeaderText>Metadata</MetadataHeaderText>
                          )}
                        </Flex>
                      </StyledLabel>
                    </MenutItemDrag>
                  );
                })}
              </DragDropContainer>
            </MenuItemsWrapper>

            {(isSelectedItemsEmpty || isSearchResultEmpty) && (
              <EmptyStateContainer alignItems="center" justifyContent="center">
                <EmptyText>No options</EmptyText>
              </EmptyStateContainer>
            )}

            {!isSearchResultEmpty && isSelectedCountLimitExceedingMaxValue && (
              <Footer>
                <WarningInfobar>
                  Due to{' '}
                  {columnSelectionLimit === 2 ? 'usability' : 'performance'}{' '}
                  reasons, the max amount of columns that can be selected is{' '}
                  {columnSelectionLimit}.{' '}
                  <StyledResetSpan onClick={onResetSelectedColumns}>
                    Reset to default
                  </StyledResetSpan>
                </WarningInfobar>
              </Footer>
            )}
          </StyledMenu>
        </Suspense>
      }
    >
      <Button icon="SplitView" aria-label="Column Selection" />
    </Dropdown>
  );
}

const StyledResetSpan = styled.span`
  text-decoration: underline;
  font-weight: 500;
  &:hover {
    cursor: pointer;
  }
`;

const StyledMenu = styled(Menu)`
  min-width: 256px;
  max-width: 256px;
  width: 100%;
  max-height: 456px;
  overflow: auto;

  .btn-reset {
    background: inherit !important;
  }
`;

const StyledHeader = styled(HighlightCell)`
  max-width: 170px;
  text-overflow: ellipsis;
`;

const StyledLabel = styled.label`
  gap: 8px;
  display: flex;
  align-items: center;
  font: inherit;
`;

const FlexWrapper = styled.div`
  display: flex;
  min-height: 36px;
  align-items: center;
`;
const StyledInput = styled(Input)`
  padding-top: 8px;
  padding-bottom: 8px;
`;

const StyledCountLabel = styled(Chip)`
  margin-left: 6px;
`;

const Footer = styled(Menu.Footer)`
  padding: 0 !important;
`;

const WarningInfobar = styled(Infobar).attrs({ type: 'warning' })`
  border-radius: 6px;
  border: 1px solid rgba(255, 187, 0, 0.2);
`;

const SearchResultText = styled(Detail)`
  font-weight: 400 !important;
  color: var(--cogs-text-icon--muted) !important;
  padding: 8px;
`;

const StyledSegmentedButton = styled(SegmentedControl.Button)`
  width: 50% !important;
`;

const EmptyText = styled(Body).attrs({ level: 2, strong: true })`
  color: var(--cogs-text-icon--muted) !important;
`;

const EmptyStateContainer = styled(Flex)`
  padding: 16px;
`;

const MenuItemsWrapper = styled.div`
  height: 100%;
  overflow: auto;
`;