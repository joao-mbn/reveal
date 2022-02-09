import styled from 'styled-components';

export const WrapperTable = styled.div`
  height: 100%;
  overflow: auto;
  .row {
    padding: 12px 16px;
    &:nth-child(2n) {
      background: var(--cogs-greyscale-grey2);
    }
  }

  .field {
    font-weight: 500;
    display: block;
  }
`;
