import styled from 'styled-components/macro';
import { sizes } from 'styles/layout';
import { Menu, TopBar } from '@cognite/cogs.js';
import layers from 'utils/zindex';

export const BaseContainer = styled.div`
  text-align: center;
  min-height: calc(100vh - 134px);
`;

export const Container = styled(BaseContainer)`
  padding-top: 32px;
  padding-bottom: 32px;
`;

export const StyledTopBar = styled(TopBar)`
  z-index: ${layers.MAXIMUM};
  position: sticky;
  top: 0;
`;

export const Code = styled.code`
  background: var(--cogs-greyscale-grey3);
`;

export const LogOutButtonContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding-right: ${sizes.small};
`;

export const LogoContainer = styled.div`
  width: 280px;
  height: 100%;
  border-right: 1px solid #e8e8e8;
`;

export const StyledMenu = styled(Menu)`
  margin-left: 16px;
  min-width: 189px;
`;
