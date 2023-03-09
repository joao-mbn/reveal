import { Button, Colors, Flex } from '@cognite/cogs.js';
import QueryStatusIcon from 'components/QueryStatusIcon';
import { Prediction } from 'hooks/contextualization-api';
import { useUpdateTimeseries } from 'hooks/timeseries';
import styled from 'styled-components';
import QuickMatchResultsTable from './QuickMatchResultsTable';

type Props = {
  predictions: Prediction[];
};
export default function EntityMatchingResult({ predictions }: Props) {
  const { mutate, isLoading, status } = useUpdateTimeseries();
  const applyAll = () => {
    mutate(
      predictions.map(({ source, matches }) => ({
        id: source.id,
        update: {
          assetId: { set: matches[0].target.id },
        },
      }))
    );
  };
  return (
    <Flex
      direction="column"
      justifyContent="flex-end"
      style={{ padding: '20px' }}
    >
      <StyledButton
        type="primary"
        disabled={isLoading}
        onClick={() => applyAll()}
        $status={status}
      >
        Apply all <QueryStatusIcon status={status} />
      </StyledButton>
      <QuickMatchResultsTable predictions={predictions} />
    </Flex>
  );
}

const StyledButton = styled(Button)<{ $status?: string }>`
  width: 150px;
  padding: 10px;

  background-color: ${({ $status }) =>
    $status === 'success' &&
    Colors['surface--status-success--strong--default']};
`;
