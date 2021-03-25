import React, { useMemo } from 'react';
import {
  CogniteFileViewer,
  ViewerEditCallbacks,
} from '@cognite/react-picture-annotation';
import { FileInfo, v3Client as sdk } from '@cognite/cdf-sdk-singleton';
import { Icon } from '@cognite/cogs.js';
import styled from 'styled-components';
import { VisionAnnotationState } from 'src/store/previewSlice';
import { AnnotationStyle, AnnotationUtils } from 'src/utils/AnnotationUtils';

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type FilePreviewProps = {
  fileObj: FileInfo;
  annotations: VisionAnnotationState[];
  editable: boolean;
  creatable: boolean;
  onCreateAnnotation: (annotation: any) => void;
  onUpdateAnnotation: (annotation: any) => void;
};

export interface StyledVisionAnnotation extends VisionAnnotationState {
  mark: AnnotationStyle;
}

const LoaderView = () => {
  return (
    <LoaderContainer>
      <Icon type="Loading" />
    </LoaderContainer>
  );
};

export const ImagePreview: React.FC<FilePreviewProps> = ({
  annotations,
  fileObj,
  editable,
  creatable,
  onCreateAnnotation,
  onUpdateAnnotation,
}: FilePreviewProps) => {
  const callbacks: ViewerEditCallbacks = useMemo(
    () => ({
      onCreate: (ann) => {
        onCreateAnnotation(ann);
        return false;
      },
      onUpdate: (ann) => {
        onUpdateAnnotation(ann);
        return false;
      },
    }),
    [onCreateAnnotation, onUpdateAnnotation]
  );

  const styledAnnotations: StyledVisionAnnotation[] = annotations.map(
    (item) => ({
      ...item,
      mark: AnnotationUtils.getAnnotationStyle(item.color, item.status),
    })
  );

  return (
    <CogniteFileViewer
      sdk={sdk}
      file={fileObj}
      disableAutoFetch
      hideDownload
      hideSearch
      creatable={creatable}
      editable={editable}
      editCallbacks={callbacks}
      annotations={styledAnnotations}
      allowCustomAnnotations
      loader={<LoaderView />}
    />
  );
};
