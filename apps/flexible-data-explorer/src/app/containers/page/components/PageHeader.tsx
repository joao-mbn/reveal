import React, { PropsWithChildren } from 'react';

import styled from 'styled-components';

import { Body, Button, Skeleton, Title } from '@cognite/cogs.js';

import zIndex from '../../../utils/zIndex';

interface Props {
  title?: string;
  subtitle?: string;
  onBackClick?: () => void;
  loading?: boolean;
  alignActions?: 'right' | 'left';
}

export const PageHeader: React.FC<PropsWithChildren<Props>> = ({
  children,
  title,
  subtitle,
  onBackClick,
  loading,
  alignActions = 'right',
}) => {
  const hasContent = title || subtitle || loading;

  return (
    <Header>
      <Content>
        {onBackClick && (
          <Button
            icon="ArrowLeft"
            size="small"
            aria-label="Back button"
            onClick={onBackClick}
          />
        )}

        {hasContent && (
          <Wrapper>
            {loading ? (
              <Skeleton.Paragraph lines={2} />
            ) : (
              <>
                <Title level={4}>{title}</Title>
                <Body>{subtitle}</Body>
              </>
            )}
          </Wrapper>
        )}

        <Actions align={alignActions}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { loading } as any);
            }
            return null;
          })}
        </Actions>
      </Content>
    </Header>
  );
};

const Header = styled.div`
  min-height: 80px;
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  left: 0;
  overflow: auto;
  background: linear-gradient(180deg, #fafafa 0%, rgba(243, 244, 248, 0) 100%);
  backdrop-filter: blur(8px);
  z-index: ${zIndex.PAGE_HEADER};
  padding: 0 16px;
`;

const Actions = styled.div<{ align?: 'left' | 'right' }>`
  ${({ align }) =>
    align === 'left' ? 'margin-right: auto;' : 'margin-left: auto;'}
  gap: 8px;
  display: flex;
`;

const Content = styled.div`
  width: 1024px;
  flex-direction: row;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Wrapper = styled.span`
  min-width: 100px;
`;