import { Dropdown, Icon } from '@cognite/cogs.js';
import styled from 'styled-components/macro';
import Layers from 'utils/z-index';

export const Header = styled.header`
  height: 60px;
  background: var(--cogs-greyscale-grey1);
  border-bottom: 1px solid var(--cogs-greyscale-grey4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  .actions {
    display: flex;
    margin-right: 24px;
    .cogs-btn {
      margin-left: 8px;
    }
  }
  .daterange {
    display: flex;
    justify-self: flex-start;
    padding: 0 24px;
    align-items: center;
  }
`;

export const TopPaneWrapper = styled.div`
  flex: 1 1 0%;
  /* left side shouldn't have scrollbars at all */
  overflow: hidden;
  height: 100%;
`;

export const BottomPaneWrapper = styled.div`
  /* overflow: auto; */
  width: 100%;
  height: 100%;
  background: rgb(255, 255, 255);
`;

export const ChartViewContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100%;
  width: ${(props: { showSearch: boolean }) =>
    props.showSearch ? '70%' : '100%'};
  min-width: ${(props: { showSearch: boolean }) =>
    props.showSearch ? '650px' : '900px'};
`;

export const ChartContainer = styled.div`
  position: relative;
  display: flex;
  height: 100%;
`;

export const SourceTableWrapper = styled.div`
  flex-grow: 1;
  max-height: 100%;
  min-width: 350px;
  border-top: 1px solid var(--cogs-greyscale-grey4);
  overflow-y: auto;
`;

export const SourceTable = styled.table`
  border: 0;
  border-collapse: collapse;
  width: 100%;

  th {
    box-shadow: inset 0 -1px 0 var(--cogs-greyscale-grey4);
  }

  td {
    border-bottom: 1px solid var(--cogs-greyscale-grey4);
  }

  td,
  th {
    padding-left: 10px;

    &.bordered {
      border-right: 1px solid var(--cogs-greyscale-grey4);
    }

    &.col-unit {
      padding-right: 8px;
      .unit-btn {
        min-width: 120px;
        height: 28px;
        justify-content: space-between;
      }
    }
  }

  th {
    position: sticky;
    top: -1px;
    color: var(--cogs-greyscale-grey7);
    background-color: var(--cogs-white);
    z-index: ${Layers.TABLE_HEADER};
    margin-bottom: -1px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
  }

  tbody > tr:hover {
    background: var(--cogs-greyscale-grey3);
  }
`;

export const SourceRow = styled.tr`
  background: ${(props) =>
    props['aria-selected'] ? 'var(--cogs-midblue-7)' : '#ffffff'};
  &&:hover {
    background: var(--cogs-greyscale-grey3);
  }
`;

export const SourceCircle = styled.span`
  height: 20px;
  width: 20px;
  background-color: ${(props) => props.color || 'lightgreen'};
  margin: 20px;
  margin-left: 5px;
  border-radius: 50%;
  flex-shrink: 0;
  opacity: ${(props: { fade?: boolean }) => (props.fade ? '0.2' : '1')};
`;

export const SourceSquare = styled.span`
  height: 20px;
  width: 20px;
  background-color: ${(props) => props.color || 'lightgreen'};
  margin: 20px;
  margin-left: 5px;
  flex-shrink: 0;
  opacity: ${(props: { fade?: boolean }) => (props.fade ? '0.2' : '1')};
`;

export const SourceItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 42px;
  text-overflow: ellipsis;
  cursor: pointer;

  opacity: ${(props: { isActive?: boolean; disabled?: boolean }) =>
    props.disabled ? 0.4 : 1};

  &:hover {
    & > :last-child {
      visibility: visible;
    }
  }
`;

export const SourceStatus = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
  height: 100%;
  display: flex;
  align-items: center;
`;

export const SourceName = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const SourceDescription = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 240px;

  > .cogs-tooltip__content {
    width: 100%;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    vertical-align: top;
  }
`;

export const SourceTag = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 210px;
`;

export const ChartWrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;

  > div {
    height: 100%;
    width: 100%;
  }
`;

export const StyledVisibilityIcon = styled(Icon)`
  margin-left: 7px;
  margin-right: 20px;
  vertical-align: middle;
`;

export const StyledStatusIcon = styled(Icon)`
  vertical-align: middle;
  margin-top: 0;
  margin-left: 0;
  margin-right: 10px;
  display: flex;
  align-items: center;
`;

export const StyledErrorIcon = styled(Icon)`
  margin-right: 5px;
  padding: 6px;
  height: 34px;
  width: 34px;
  border-radius: 50%;
  background-color: var(--cogs-red-5);
  color: var(--cogs-red-2);
`;

export const DropdownWithoutMaxWidth = styled(Dropdown)`
  &.tippy-box {
    max-width: none !important;
  }
`;
