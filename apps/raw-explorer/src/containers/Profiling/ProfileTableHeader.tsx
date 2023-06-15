import React from 'react';

import styled from 'styled-components';

import { useTranslation } from '@raw-explorer/common/i18n';
import { ZIndexLayer } from '@raw-explorer/utils/zIndex';

import { Colors, Icon } from '@cognite/cogs.js';

import { SortableColumn } from '.';
import { TableCell } from './ProfileRow';

type Props = {
  sortKey: SortableColumn;
  setSortKey: (sortKey: SortableColumn) => void;
  sortReversed: boolean;
  setSortReversed: (sortReversed: boolean) => void;
};

export default function ProfileTableHeader(props: Props): JSX.Element {
  const { t } = useTranslation();
  const { sortKey, setSortKey, sortReversed, setSortReversed } = props;
  const onSortClick = (key: SortableColumn) => {
    const reverse = sortKey === key;
    setSortKey(key);
    if (reverse) setSortReversed(!sortReversed);
  };
  return (
    <StyledTableHeader>
      <tr>
        <TableCell $width={44}>
          <span onClick={() => onSortClick('type')}>
            <Icon type="ReorderDefault" />
          </span>
        </TableCell>
        <TableCell>
          {t('profiling-table-header-column')}
          <span onClick={() => onSortClick('label')}>
            <Icon type="ReorderDefault" />
          </span>
        </TableCell>
        <TableCell>
          {t('profiling-table-header-empty')}
          <span onClick={() => onSortClick('nullCount')}>
            <Icon type="ReorderDefault" />
          </span>
        </TableCell>
        <TableCell>
          {t('profiling-table-header-distinct')}
          <span onClick={() => onSortClick('distinctCount')}>
            <Icon type="ReorderDefault" />
          </span>
        </TableCell>
        <TableCell $width={150}>
          {t('profiling-table-header-frequency')}
        </TableCell>
        <TableCell>
          {t('profiling-table-header-min')}
          <span onClick={() => onSortClick('min')}>
            <Icon type="ReorderDefault" />
          </span>
        </TableCell>
        <TableCell>
          {t('profiling-table-header-max')}
          <span onClick={() => onSortClick('max')}>
            <Icon
              type="ReorderDefault"
              //
            />
          </span>
        </TableCell>
        <TableCell>{t('profiling-table-header-mean')}</TableCell>
        <TableCell $width={68}>
          <StyledExpandTableHeaderIcon type="ChevronDown" />
        </TableCell>
      </tr>
      <StyledTableHeaderBackground />
      <StyledTableHeaderWhiteBorder />
      <StyledTableHeaderGrayBorder />
    </StyledTableHeader>
  );
}

const StyledTableHeader = styled.thead`
  position: sticky;
  top: 12px;
  background-color: ${Colors['surface--medium']};
  color: ${Colors['text-icon--medium']};
  z-index: ${ZIndexLayer.Dropdown}; /** lower values causes histograms to render above the scrolled header **/
  .styled-cell {
    border-top: 1px solid ${Colors['border--muted']};
    border-bottom: 1px solid ${Colors['border--muted']};
    border-left: 1px solid ${Colors['border--muted']};
  }
  .styled-cell:first-child {
    border-radius: 8px 0 0 0;
  }
  .styled-cell:last-child {
    border-right: 1px solid ${Colors['border--muted']};
    border-radius: 0 8px 0 0;
  }
  td .cogs-icon {
    cursor: pointer;
  }
`;

const StyledExpandTableHeaderIcon = styled(Icon)`
  cursor: pointer;
  margin: 0 10px;
`;

const StyledTableHeaderBackground = styled.tr`
  position: absolute;
  top: -12px;
  background-color: ${Colors['surface--muted']};
  width: 100%;
  height: 12px;
`;

const StyledTableHeaderWhiteBorder = styled.tr`
  position: absolute;
  top: 0px;
  width: 100%;
  height: 8px;
  border: 1px solid ${Colors['surface--muted']};
  border-bottom-width: 0;
  border-top-width: 0;
`;

const StyledTableHeaderGrayBorder = styled.tr`
  position: absolute;
  top: 0px;
  width: 100%;
  height: 8px;
  border: 1px solid ${Colors['border--interactive--default']};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-width: 0;
`;