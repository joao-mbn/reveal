import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ImagePreview } from 'src/pages/Preview/components/ImagePreview/ImagePreview';
import { DataExplorationProvider, Tabs } from '@cognite/data-exploration';
import { Contextualization } from 'src/pages/Preview/components/Contextualization/Contextualization';
import { FileDetailEdit } from 'src/pages/Preview/components/FileDetails/FileDetailEdit';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/rootReducer';
import {
  resetEditHistory,
  selectVisibleNonRejectedAnnotationsByFileId,
  updateAnnotation,
} from 'src/store/previewSlice';
import { getLink, workflowRoutes } from 'src/pages/Workflow/workflowRoutes';
import { QueryClient, QueryClientProvider } from 'react-query';
import { v3Client as sdk } from '@cognite/cdf-sdk-singleton';
import { selectFileById } from 'src/store/uploadedFilesSlice';
import { ImagePreviewEditMode } from 'src/pages/Preview/Types';

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

const ImageReview = (props: RouteComponentProps<{ fileId: string }>) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { fileId } = props.match.params;

  const file = useSelector(({ uploadedFiles }: RootState) =>
    selectFileById(uploadedFiles, fileId)
  );

  const visibleNonRejectedAnnotations = useSelector(
    ({ previewSlice }: RootState) =>
      selectVisibleNonRejectedAnnotationsByFileId(previewSlice, fileId)
  );

  const [
    imagePreviewEditable,
    imagePreviewCreatable,
  ] = useSelector((state: RootState) => [
    state.previewSlice.imagePreview.editable ===
      ImagePreviewEditMode.Modifiable,
    state.previewSlice.imagePreview.editable === ImagePreviewEditMode.Creatable,
  ]);

  if (!file) {
    // navigate to upload step if file is not available(if the user uses a direct link)
    history.push(getLink(workflowRoutes.upload));
    return null;
  }

  useEffect(() => {
    dispatch(resetEditHistory());
  }, []);

  const handleCreateAnnotation = (annotation: any) => {
    console.log('created annotation: ', annotation);
  };

  const handleModifyAnnotation = (annotation: any) => {
    console.log('modified annotation: ', annotation);

    if (imagePreviewEditable) {
      dispatch(
        updateAnnotation({ id: annotation.id, boundingBox: annotation.box })
      );
    }
  };

  return (
    <>
      <AnnotationContainer>
        <FilePreviewMetadataContainer>
          <FilePreviewContainer>
            {file && (
              <ImagePreview
                fileObj={file}
                annotations={visibleNonRejectedAnnotations}
                editable={imagePreviewEditable}
                creatable={imagePreviewCreatable}
                onCreateAnnotation={handleCreateAnnotation}
                onUpdateAnnotation={handleModifyAnnotation}
              />
            )}
          </FilePreviewContainer>
          <TabsContainer className="z-8">
            <Tabs
              tab="context"
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
                      <FileDetailEdit fileObj={file} />
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
export default ImageReview;
