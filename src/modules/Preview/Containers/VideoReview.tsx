import React from 'react';
import styled from 'styled-components';
import { VideoPreview } from 'src/modules/Preview/Components/VideoPreview/VideoPreview';
import { DataExplorationProvider, Tabs } from '@cognite/data-exploration';
import { Contextualization } from 'src/modules/Preview/Containers/Contextualization';
import { FileDetailsReview } from 'src/modules/FileDetails/Containers/FileDetailsReview/FileDetailsReview';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/rootReducer';
import { getLink, workflowRoutes } from 'src/modules/Workflow/workflowRoutes';
import { QueryClient, QueryClientProvider } from 'react-query';
import { v3Client as sdk } from '@cognite/cdf-sdk-singleton';
import { selectFileById } from 'src/modules/Common/filesSlice';

const AnnotationContainer = styled.div`
  width: 100%;
  padding: 20px 0 0;
  display: flex;
  height: 100%;
  box-sizing: border-box;
`;

const FilePreviewMetadataContainer = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 50% auto;
  grid-template-rows: 100%;
  grid-column-gap: 30px;
`;

const FilePreviewContainer = styled.div`
  height: 100%;
`;

const TabsContainer = styled.div`
  height: 100%;
  padding: 30px 45px 0;
  border-radius: 8px;
`;

const queryClient = new QueryClient();

const AnnotationsEdit = (props: { fileId: string }) => {
  const history = useHistory();
  const { fileId } = props;

  const file = useSelector(({ filesSlice }: RootState) =>
    selectFileById(filesSlice, fileId)
  );

  if (!file) {
    // navigate to upload step if file is not available(if the user uses a direct link)
    history.push(getLink(workflowRoutes.upload));
    return null;
  }

  return (
    <>
      <AnnotationContainer>
        <FilePreviewMetadataContainer>
          <FilePreviewContainer>
            {file && <VideoPreview fileObj={file} />}
          </FilePreviewContainer>
          <TabsContainer className="z-8">
            <Tabs
              tab="file-detail"
              onTabChange={() => {}}
              style={{
                fontSize: 14,
                fontWeight: 600,
                lineHeight: '20px',
              }}
            >
              <Tabs.Pane
                title="Contextualization"
                key="context"
                style={{ overflow: 'hidden', height: `calc(100% - 45px)` }}
                disabled
              >
                <Contextualization fileId={fileId} />
              </Tabs.Pane>
              <Tabs.Pane
                title="File Details"
                key="file-detail"
                style={{ overflow: 'hidden', height: `calc(100% - 45px)` }}
              >
                {file && (
                  <DataExplorationProvider sdk={sdk}>
                    <QueryClientProvider client={queryClient}>
                      <FileDetailsReview fileObj={file} />
                    </QueryClientProvider>
                  </DataExplorationProvider>
                )}
              </Tabs.Pane>
            </Tabs>
          </TabsContainer>
        </FilePreviewMetadataContainer>
      </AnnotationContainer>
    </>
  );
};
export default AnnotationsEdit;
