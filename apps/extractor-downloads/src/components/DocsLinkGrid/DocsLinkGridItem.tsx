import { PropsWithChildren } from 'react';

import styled from 'styled-components';

import { Button, Colors, Icon, Title } from '@cognite/cogs.js';

export type DocsLinkGridItemProps = {
  href: string;
  onClick?: () => void;
};

const DocsLinkGridItem = styled(
  (props: PropsWithChildren<DocsLinkGridItemProps>) => (
    <a target="_blank" href={props.href} rel="noreferrer">
      <StyledButton {...props}>
        <Title level={6}>{props.children}</Title>
        <Icon type="ExternalLink" />
      </StyledButton>
    </a>
  )
)`
  background-color: ${Colors['decorative--grayscale--200']};
  border-radius: 6px;

  && {
    color: ${Colors['text-icon--medium']};

    &:hover {
      background-color: ${Colors['surface--strong']};

      > * {
        color: ${Colors['surface--action--strong--default']};
      }
    }
  }
`;

const StyledButton = styled(Button)`
  && {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 24px;
  }
`;

export default DocsLinkGridItem;