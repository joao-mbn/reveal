import styled from 'styled-components';
import { EditButton } from 'styles/StyledButton';
import { Colors, Title } from '@cognite/cogs.js';
import React, { PropsWithChildren } from 'react';
import { sideBarLabelColor } from 'styles/StyledVariables';

export const StyledTitle = styled(Title)`
  border-bottom: 1px solid ${Colors['greyscale-grey2'].hex()};
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  button {
    font-weight: bold;
    color: ${sideBarLabelColor};
  }
`;

interface DetailHeadingEditProps {
  onClick: () => void;
  canEdit: boolean;
}

export const DetailHeadingEditBtn = ({
  onClick,
  children,
  canEdit,
}: PropsWithChildren<DetailHeadingEditProps>) => {
  return (
    <StyledTitle level={3}>
      <EditButton disabled={!canEdit} onClick={canEdit && onClick} $full>
        {children}
      </EditButton>
    </StyledTitle>
  );
};
