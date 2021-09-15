/* eslint-disable @cognite/no-number-z-index */
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/rootReducer';
import {
  setDetectionModelParameters,
  selectIsPollingComplete,
  setProcessViewFileUploadModalVisibility,
  setSelectedDetectionModels,
  setSelectFromExploreModalVisibility,
  revertDetectionModelParameters,
  resetDetectionModelParameters,
  selectAllProcessFiles,
  addProcessUploadedFileId,
  clearUploadedFiles,
  setProcessFileIds,
} from 'src/modules/Process/processSlice';
import { message, notification } from 'antd';
import { toastProps } from 'src/utils/ToastUtils';
import React, { useEffect, useState } from 'react';
import { Button, Title, Modal } from '@cognite/cogs.js';
import { DetectionModelSelect } from 'src/modules/Process/Components/DetectionModelSelect';
import { isVideo } from 'src/modules/Common/Components/FileUploader/utils/FileUtils';
import { FileState, selectFileCount } from 'src/modules/Common/filesSlice';
import { VisionAPIType } from 'src/api/types';
import { getContainer } from 'src/utils';
import { FileUploadModal } from 'src/modules/Common/Components/FileUploaderModal/FileUploaderModal';
import { ExploreModal } from 'src/modules/Common/Components/ExploreModal/ExploreModal';
import { TableDataItem } from 'src/modules/Common/types';
import { FileFilterProps } from '@cognite/cdf-sdk-singleton';
import {
  clearExplorerStateOnTransition,
  selectExplorerAllSelectedFiles,
  selectExplorerSelectedFileIds,
  setExplorerFileSelectState,
  setExplorerFilter,
  setExplorerFocusedFileId,
  setExplorerQueryString,
} from 'src/modules/Explorer/store/explorerSlice';
import { DetectAnnotations } from 'src/store/thunks/DetectAnnotations';
import { AppDispatch } from 'src/store';
import { ModelConfiguration } from '../ModelConfiguration';

export const ProcessToolBar = () => {
  const dispatch: AppDispatch = useDispatch();

  const processFiles = useSelector((state: RootState) =>
    selectAllProcessFiles(state)
  );

  const isPollingFinished = useSelector((state: RootState) => {
    return selectIsPollingComplete(state.processSlice);
  });

  const processFileCount = useSelector(({ filesSlice }: RootState) =>
    selectFileCount(filesSlice)
  );

  const showDrawer = useSelector(
    (state: RootState) => state.processSlice.showFileMetadataDrawer
  );

  const selectedDetectionModels = useSelector(
    (state: RootState) => state.processSlice.selectedDetectionModels
  );

  const showFileUploadModal = useSelector(
    ({ processSlice }: RootState) => processSlice.showFileUploadModal
  );

  const uploadedFileIds = useSelector(
    ({ processSlice }: RootState) => processSlice.uploadedFileIds
  );

  const onDetectClick = () => {
    if (!selectedDetectionModels.length) {
      message.error('Please select ML models to use for detection');
      return;
    }

    if (processFiles.filter((file) => isVideo(file)).length) {
      notification.warning({
        message: 'Skipping video files',
        description:
          'Automatic contextualization is currently not supported for videos.',
      });
    }
    dispatch(
      DetectAnnotations({
        fileIds: processFiles
          .filter((file) => !isVideo(file))
          .map(({ id }) => id),
        detectionModels: selectedDetectionModels,
      })
    );
  };

  const onChange = (models: Array<VisionAPIType>) => {
    dispatch(setSelectedDetectionModels(models));
  };

  const [isModalOpen, setModalOpen] = useState(false);

  const onUploadSuccess = (fileId: number) => {
    dispatch(addProcessUploadedFileId(fileId));
  };
  const onFinishUpload = async () => {
    dispatch(
      setProcessFileIds([
        ...processFiles.map((file) => file.id),
        ...uploadedFileIds,
      ])
    );
    dispatch(clearUploadedFiles());
  };

  const disableAddFiles = !isPollingFinished;
  const disableModelSelection = !processFiles.length || !isPollingFinished;
  const fileUploadActive = !processFiles.length;
  const modelSelectorActive =
    !!processFiles.length &&
    !selectedDetectionModels.length &&
    isPollingFinished;

  // ExploreModal
  const showSelectFromExploreModal = useSelector(
    ({ processSlice }: RootState) => processSlice.showExploreModal
  );
  const exploreModalClickedFileId = useSelector(
    (state: RootState) => state.explorerReducer.focusedFileId
  );
  const exploreModalSearchQuery = useSelector(
    (state: RootState) => state.explorerReducer.query
  );
  const filter = useSelector(
    ({ explorerReducer }: RootState) => explorerReducer.filter
  );
  const selectedExploreModalFiles: FileState[] = useSelector(
    (state: RootState) => {
      return selectExplorerAllSelectedFiles(state.explorerReducer);
    }
  );
  const selectedFileIds = useSelector((state: RootState) =>
    selectExplorerSelectedFileIds(state.explorerReducer)
  );
  const handleExploreSearchChange = (text: string) => {
    dispatch(setExplorerQueryString(text));
  };

  const handleExplorerModalItemClick = ({
    /* eslint-disable @typescript-eslint/no-unused-vars */
    menuActions,
    rowKey,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ...file
  }: TableDataItem) => {
    dispatch(setExplorerFocusedFileId(file.id));
  };
  const handleExploreModalRowSelect = (
    item: TableDataItem,
    selected: boolean
  ) => {
    dispatch(setExplorerFileSelectState(item.id, selected));
  };
  const setFilter = (newFilter: FileFilterProps) => {
    dispatch(setExplorerFilter(newFilter));
  };
  const handleUseFiles = () => {
    const availableFileIds = processFiles.map((file) => file.id);
    const allProcessFileIds = [...availableFileIds];
    selectedExploreModalFiles.forEach((selectedExploreFile) => {
      if (
        !availableFileIds.find((fileId) => fileId === selectedExploreFile.id)
      ) {
        allProcessFileIds.push(selectedExploreFile.id);
      }
    });

    dispatch(setProcessFileIds(allProcessFileIds));
    dispatch(setSelectFromExploreModalVisibility(false));
  };

  useEffect(() => {
    if (isPollingFinished || showDrawer) {
      notification.close('inProgressToast');
    } else {
      notification.info({
        ...toastProps,
        duration: 0,
      });
    }
  }, [isPollingFinished, showDrawer]);

  const detectionModelConfiguration = () => {
    return (
      <ConfiguratioModelFooter>
        <Button
          type="tertiary"
          onClick={() => {
            dispatch(resetDetectionModelParameters());
          }}
        >
          Reset to default
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setModalOpen(false);
            dispatch(setDetectionModelParameters());
          }}
        >
          Save & close
        </Button>
      </ConfiguratioModelFooter>
    );
  };

  return (
    <>
      <FileUploadModal
        onUploadSuccess={onUploadSuccess}
        onFinishUpload={onFinishUpload}
        showModal={showFileUploadModal}
        processFileCount={processFileCount}
        onCancel={() =>
          dispatch(setProcessViewFileUploadModalVisibility(false))
        }
      />
      <ExploreModal
        showModal={showSelectFromExploreModal}
        selectedId={exploreModalClickedFileId}
        query={exploreModalSearchQuery}
        filter={filter}
        selectedCount={selectedFileIds.length}
        setFilter={setFilter}
        onSearch={handleExploreSearchChange}
        onItemClick={handleExplorerModalItemClick}
        onRowSelect={handleExploreModalRowSelect}
        onCloseModal={() => {
          dispatch(setSelectFromExploreModalVisibility(false));
          dispatch(clearExplorerStateOnTransition());
        }}
        onUseFiles={handleUseFiles}
        processFileCount={processFileCount}
      />

      <Container>
        <StyledModal
          getContainer={getContainer}
          title={<Title level={3}>Processing and annotation settings</Title>}
          footer={detectionModelConfiguration()}
          visible={isModalOpen}
          width={967}
          closable={false}
          closeIcon={
            <div style={{ paddingTop: '12px' }}>
              <Button icon="Close" iconPlacement="right" type="ghost">
                Close
              </Button>
            </div>
          }
          onCancel={() => {
            setModalOpen(false);
            dispatch(revertDetectionModelParameters());
          }}
          style={{
            background: '#fafafa',
            borderRadius: '10px',
          }}
        >
          <ModelConfiguration />
        </StyledModal>
        <ToolContainer>
          <ProcessToolBarElement
            disabled={disableAddFiles}
            active={fileUploadActive}
          >
            <ElementTitle>
              <Title level={6}>Add files</Title>
            </ElementTitle>
            <ElementContent>
              <Button
                type="tertiary"
                icon="Upload"
                disabled={disableAddFiles}
                onClick={() =>
                  dispatch(setProcessViewFileUploadModalVisibility(true))
                }
                style={{ background: 'white' }}
              >
                Upload
              </Button>
              <Button
                type="tertiary"
                icon="AddToList"
                disabled={disableAddFiles}
                style={{ marginLeft: 8, background: 'white' }}
                onClick={() =>
                  dispatch(setSelectFromExploreModalVisibility(true))
                }
              >
                Select from files
              </Button>
            </ElementContent>
          </ProcessToolBarElement>
        </ToolContainer>
        <ToolContainer>
          <ProcessToolBarElement
            disabled={disableModelSelection}
            active={modelSelectorActive}
          >
            <ElementTitle>
              <Title level={6}>Select ML model(s)</Title>
              <ModelSettingsButton
                icon="Settings"
                aria-label="model settings"
                disabled={disableModelSelection}
                onClick={() => {
                  setModalOpen(true);
                }}
              />
            </ElementTitle>
            <ElementContent>
              <ModelOptions>
                <ModelSelector>
                  <DetectionModelSelect
                    value={selectedDetectionModels}
                    onChange={onChange}
                    isDisabled={disableModelSelection}
                  />
                </ModelSelector>
                <Button
                  type="primary"
                  disabled={!isPollingFinished}
                  onClick={onDetectClick}
                >
                  Detect
                </Button>
              </ModelOptions>
            </ElementContent>
          </ProcessToolBarElement>
        </ToolContainer>
      </Container>
    </>
  );
};
const Container = styled.div`
  display: grid;
  width: 100%;
  padding-top: 20px;
  padding-bottom: 15px;
  grid-gap: 25px;
  grid-template-columns: max-content auto;
`;

const StyledModal = styled(Modal)`
  .cogs-modal-footer {
    border-top: 0;
  }
  .cogs-modal-header {
    border-bottom: 0;
  }
`;

type ToolBarElemProps = {
  disabled: boolean;
  active: boolean;
};
const ProcessToolBarElement = styled.div<ToolBarElemProps>`
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  background: ${(props) =>
    props.active ? 'rgba(74, 103, 251, 0.1)' : '#fafafa'};
  border: 0.5px solid ${(props) => (props.active ? '#4a67fb' : '#dcdcdc')};
`;
const ToolContainer = styled.div`
  display: flex;
  width: fit-content;
  z-index: 1;
`;
const ElementTitle = styled.div`
  display: flex;
  width: 100%;
  box-sizing: content-box;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const ElementContent = styled.div``;

const ModelSettingsButton = styled(Button)`
  color: #c4c4c4;
  background: inherit;
  padding: 0;
  height: 12px;
`;
const ModelSelector = styled.div`
  padding-right: 15px;
  max-width: 340px;
  min-width: 340px;
`;

const ModelOptions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const ConfiguratioModelFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
