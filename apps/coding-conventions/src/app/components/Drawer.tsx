import { Drawer as CogsDrawer, Flex, Title } from '@cognite/cogs.js';
import styled from 'styled-components';

export const Drawer = styled(CogsDrawer)`
  .cogs-drawer-content {
    padding: 0;
  }
  .cogs-drawer-footer {
    display: none;
  }
  .cogs-drawer-header {
    display: none;
  }
`;

interface Props {
  title?: string;
}
export const DrawerHeader: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  children,
}) => {
  return (
    <Header>
      <Title level={4}>{title}</Title>
      <Flex gap={8} alignItems="center">
        {children}
      </Flex>
    </Header>
  );
};

const Header = styled.div`
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  height: 70px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  gap: 8px;
`;
