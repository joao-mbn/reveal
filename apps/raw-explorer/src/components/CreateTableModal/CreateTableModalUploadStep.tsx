import React from 'react';

import styled from 'styled-components';

import { useTranslation } from '@raw-explorer/common/i18n';
import Message, { MessageType } from '@raw-explorer/components/Message/Message';
import {
  SIDE_PANEL_TRANSITION_DURATION,
  SIDE_PANEL_TRANSITION_FUNCTION,
} from '@raw-explorer/utils/constants';

import { Body, Button, Colors, Icon, Overline } from '@cognite/cogs.js';

type CreateTableModalUploadStepProps = {
  fileName?: string;
  onCancel: () => void;
  progression?: number;
  isUploadError?: boolean;
  isUploadSuccess?: boolean;
};

const CreateTableModalUploadStep = ({
  fileName,
  onCancel,
  progression = 0,
  isUploadError,
  isUploadSuccess,
}: CreateTableModalUploadStepProps): JSX.Element => {
  const { t } = useTranslation();
  const percentage = isUploadSuccess ? 100 : progression;

  let messageContent = t('create-table-modal-file-upload-message_ongoing');
  let messageType: MessageType = 'info';
  if (isUploadError) {
    messageContent = t('create-table-modal-file-upload-message_error');
    messageType = 'error';
  } else if (isUploadSuccess) {
    messageContent = t('create-table-modal-file-upload-message_success');
    messageType = 'success';
  }

  return (
    <>
      <Message message={messageContent} type={messageType} />
      <StyledUploadStepWrapper>
        <StyledDocumentIcon type="Document" size={40} />
        <StyledProgressionWrapper>
          <StyledProgressionInfo>
            <StyledFileName level={3} strong>
              {fileName}
            </StyledFileName>
            <StyledUploadPercentage level={3}>
              {t('create-table-modal-file-upload-percentage', { percentage })}
            </StyledUploadPercentage>
          </StyledProgressionInfo>
          <StyledProgressionBarWrapper>
            <StyledProgressionBar
              $isUploadSuccess={isUploadSuccess}
              $percentage={percentage}
            />
          </StyledProgressionBarWrapper>
        </StyledProgressionWrapper>
        {!isUploadSuccess && !isUploadError && (
          <StyledCloseButton icon="Close" onClick={onCancel} type="ghost" />
        )}
      </StyledUploadStepWrapper>
    </>
  );
};

const StyledDocumentIcon = styled(Icon)`
  color: ${Colors['border--muted']};
  margin-right: 16px;
`;

const StyledUploadStepWrapper = styled.div`
  align-items: center;
  border: 1px solid ${Colors['border--interactive--default']};
  border-radius: 6px;
  display: flex;
  margin-top: 16px;
  padding: 16px;
`;

const StyledProgressionWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const StyledProgressionInfo = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 6px;
`;

const StyledFileName = styled(Body)`
  color: ${Colors['text-icon--strong']};
`;

const StyledUploadPercentage = styled(Overline)`
  color: ${Colors['text-icon--muted']};
  margin-left: auto;
`;

const StyledProgressionBarWrapper = styled.div`
  background-color: ${Colors['surface--interactive--disabled']};
  border-radius: 4px;
  height: 8px;
  width: 100%;
`;

const StyledProgressionBar = styled.div<{
  $isUploadSuccess?: boolean;
  $percentage: number;
}>`
  background-color: ${({ $isUploadSuccess }) =>
    $isUploadSuccess
      ? '#2E8551'
      : Colors['surface--status-neutral--muted--default']};
  border-radius: 4px;
  height: 8px;
  transition: width ${SIDE_PANEL_TRANSITION_DURATION}s
    ${SIDE_PANEL_TRANSITION_FUNCTION};
  width: ${({ $percentage }) => $percentage}%;
`;

const StyledCloseButton = styled(Button)`
  margin-left: 8px;
`;

export default CreateTableModalUploadStep;