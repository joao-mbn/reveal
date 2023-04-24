import styled from 'styled-components/macro';
import { Button, TopBar, Body, Flex } from '@cognite/cogs.js';

export const StyledTopBarRight = styled(TopBar.Right)`
  display: flex;
  align-items: center;
  padding-right: 12px;

  .cogs-notification-dot__bubble {
    background: var(--cogs-decorative--gradient--dawn);
  }
`;

export const StyledTopBarLeft = styled(TopBar.Left)`
  display: flex;
  align-items: center;
  padding-right: 10px;
`;

export const StyledTopBar = styled(TopBar)`
  && {
    height: 56px;
  }
`;

export const StyledTitleButton = styled(Button)`
  && {
    width: 36px;
    height: 36px;
    padding: 10px !important;
  }
`;

export const StyledTitle = styled(Body)`
  && {
    color: var(--cogs-text-icon--medium);
    user-select: text;
  }
`;

export const StyledExternalId = styled(Body)`
  && {
    color: var(--cogs-text-icon--muted);
    margin-left: 4px;
    user-select: text;
  }
`;

export const StyledFlex = styled(Flex)`
  padding: 0 10px;
`;

export const SideBarMenu = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center !important;
  width: 56px; // fit to the navbar's 56px + 1px of border
  padding: 10px;
  border-right: solid 1px var(--cogs-greyscale-grey3);
`;

export const SideBarItem = styled(Button)`
  margin-bottom: 8px !important;
  width: 36px !important;
  height: 36px !important;
  padding: 10px !important;
`;

export const Splitter = styled.div`
  border-top: solid 1px var(--cogs-greyscale-grey4);
  height: 4px;
  margin-bottom: 8px;
`;