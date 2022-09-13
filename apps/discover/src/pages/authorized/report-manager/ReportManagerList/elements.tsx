import styled from 'styled-components/macro';
import layers from 'utils/zindex';

import { Icon } from '@cognite/cogs.js';

export const TableContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 20px;
`;
export const HeaderContainer = styled.div`
  display: flex;
`;
export const FloatingBox = styled.div`
  position: absolute;
  top: 150px;
`;
export const CellText = styled.div``;
export const CellIcon = styled.div`
  align-items: center;
  display: flex;
`;
export const HeadContainer = styled.thead`
  height: 44px;
  color: rgba(0, 0, 0, 0.7);
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
`;
export const HeaderPadded = styled.div`
  padding-left: 1.4rem;
`;
export const PaddedRow = styled.div`
  padding-left: ${(props: { depth: number }) => `${props.depth * 1.5}rem`};
`;
export const ExpandableRow = styled(PaddedRow)`
  cursor: pointer;
`;
export const MainRowContainer = styled.tr`
  height: 44px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
`;
export const SubRowContainer = styled.tr`
  background: #fafafa;
  padding: 12px 0px 12px 16px;
  box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.15);
  height: 52px;
`;
export const StyledIcon = styled(Icon)`
  svg {
    height: 13px;
  }
`;
// Hover cell (the one that pops out from the right)
export const HoverContentWrapper = styled.span`
  align-items: center;
  background: inherit;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  height: 100%;
  justify-content: center;
  opacity: 1;
  padding: 0 !important;
  pointer-events: none;
  position: sticky;
  right: 0;
  top: 0;
  transform: translateX(-4px);
  transition-delay: 0.025s;
  transition-timing-function: ease-out;
  transition: 0.2s;
  &:hover {
    z-index: ${layers.APP_FRAME};
  }
  z-index: ${layers.TABLE_ROW_HOVER};
`;
