import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import {
  selectIsPollingComplete,
  selectIsProcessingStarted,
  selectAllProcessFiles,
} from '@vision/modules/Process/store/selectors';
import { setSummaryModalVisibility } from '@vision/modules/Process/store/slice';
import { AppDispatch } from '@vision/store';
import { RootState } from '@vision/store/rootReducer';
import { PopulateProcessFiles } from '@vision/store/thunks/Process/PopulateProcessFiles';
import { Modal } from 'antd';

import { createLink } from '@cognite/cdf-utilities';
import { Button } from '@cognite/cogs.js';

import { SummaryModal } from './SummaryModal/SummaryModal';

export const ProcessFooter = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const isPollingFinished = useSelector((state: RootState) => {
    return selectIsPollingComplete(state.processSlice);
  });

  const isProcessingStarted = useSelector((state: RootState) => {
    return selectIsProcessingStarted(state.processSlice);
  });

  const processFiles = useSelector((state: RootState) =>
    selectAllProcessFiles(state)
  );

  const clearOnFinishProcessing = async () => {
    dispatch(setSummaryModalVisibility(false));
    await dispatch(PopulateProcessFiles([])); // wait until state clears unless warning will be shown
    navigate(createLink('/vision/explore'));
  };

  const handleShowSummaryModal = () => {
    dispatch(setSummaryModalVisibility(true));
  };

  const handleSkipClick = () => {
    Modal.confirm({
      title: 'Just so you know',
      content:
        'By skipping processing you will be taken back to the home page. Your files are uploaded to Cognite Data Fusion and can be processed later.',
      onOk: async () => {
        await clearOnFinishProcessing();
      },
    });
  };

  const showComplete =
    !processFiles.length || (processFiles.length && isProcessingStarted);
  const showSkip = processFiles.length && !isProcessingStarted;

  return (
    <>
      <SummaryModal />
      <FooterContainer>
        {showComplete ? (
          <Button
            onClick={handleShowSummaryModal}
            disabled={!processFiles.length || !isPollingFinished}
            style={{ zIndex: 1 }}
          >
            Finish session
          </Button>
        ) : null}
        {showSkip ? (
          <Button
            onClick={handleSkipClick}
            disabled={!isPollingFinished}
            style={{ zIndex: 1 }}
          >
            Finish session without processing
          </Button>
        ) : null}
      </FooterContainer>
    </>
  );
};

const FooterContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 50px;
  padding: 0 20px;
`;
