import styled from 'styled-components/macro';

export const Flex = styled.div`
  display: flex;
`;

export const FlexColumn = styled(Flex)`
  flex-direction: column;
  width: 100%;
`;

export const FlexRow = styled(Flex)`
  flex-direction: row;
`;
