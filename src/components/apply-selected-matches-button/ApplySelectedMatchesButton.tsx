import { notification } from '@cognite/cdf-utilities';
import { Button, Flex } from '@cognite/cogs.js';
import { useTranslation } from 'common/i18n';
import { Prediction } from 'hooks/entity-matching-predictions';
import { useUpdateAssetIds } from 'hooks/update';
import styled from 'styled-components';
import { SourceType } from 'types/api';

type Props = {
  predictionJobId: number;
  predictions: Prediction[] | undefined;
  sourceIds: number[] | undefined;
  sourceType: SourceType;
};

const ApplySelectedMatchesButton = ({
  predictionJobId,
  predictions,
  sourceIds,
  sourceType,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { mutate, isLoading } = useUpdateAssetIds(sourceType, predictionJobId);

  const selectedPredictions = predictions?.filter((prediction) =>
    sourceIds?.includes(prediction.source.id)
  );

  const applySelected = () => {
    if (selectedPredictions) {
      mutate(
        selectedPredictions?.map(({ source, match }) => ({
          id: source.id,
          update: {
            assetId: { set: match.target.id },
          },
        })),
        {
          onSuccess: () => {
            notification.success({
              message: t('notification-success'),
              description: t('save-to-cdf-success'),
            });
          },
          onError: () => {
            notification.error({
              message: t('error'),
              description: t('save-to-cdf-error'),
            });
          },
        }
      );
    }
  };

  return (
    <Flex>
      <StyledButton
        type="primary"
        onClick={applySelected}
        loading={isLoading}
        disabled={!sourceIds?.length}
      >
        {t('apply-selected-matches')}
      </StyledButton>
    </Flex>
  );
};

const StyledButton = styled(Button)`
  white-space: nowrap;
  padding: 10px 10px;
  width: 200px;
`;

export default ApplySelectedMatchesButton;
