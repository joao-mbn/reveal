import styled from 'styled-components/macro';
import { EditableChip } from '@platypus-app/components/EditableChip';

export const NameWrapper = styled.div`
  margin-bottom: 16px;
`;

export const StyledEditableChip = styled(EditableChip)`
  display: inline-block;
  margin-bottom: 24px;
`;

export const InputDetail = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 0 0;

  .cogs-icon-Warning {
    margin-right: 6px;
  }
`;
