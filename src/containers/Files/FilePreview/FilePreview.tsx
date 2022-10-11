import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { FileInfo } from '@cognite/sdk';
import {
  CogniteFileViewer,
  ProposedCogniteAnnotation,
  convertCogniteAnnotationToIAnnotation,
} from '@cognite/react-picture-annotation';
import { Loader } from 'components';
import styled from 'styled-components';
import {
  isFilePreviewable,
  lightGrey,
  readablePreviewableFileTypes,
  removeSimilarAnnotations,
} from 'utils';
import {
  PendingCogniteAnnotation,
  CogniteAnnotation,
} from '@cognite/annotations';
import { useCdfItem } from '@cognite/sdk-react-query-hooks';
import { ResourceItem } from 'types';
import { AnnotationPreviewSidebar } from './AnnotationPreviewSidebar';
import { useAnnotations } from '../hooks';
import { AnnotationHoverPreview } from './AnnotationHoverPreview';
import { EmptyState } from 'components/EmpyState/EmptyState';

type FilePreviewProps = {
  fileId: number;
  creatable: boolean;
  contextualization: boolean;
  onItemClicked?: (item: ResourceItem) => void;
  fileIcon?: React.ReactNode;
};
export const FilePreview = ({
  fileId,
  creatable,
  contextualization,
  onItemClicked,
  fileIcon,
}: FilePreviewProps) => {
  const [pendingAnnotations, setPendingAnnotations] = useState<
    ProposedCogniteAnnotation[]
  >([]);

  const [zoomedAnnotation, setZoomedAnnotation] = useState<
    CogniteAnnotation | undefined
  >();

  const [isAnnotationsShown, setIsAnnotationsShown] = useState<boolean>(true);

  useEffect(() => {
    setPendingAnnotations([]);
  }, [fileId]);
  useEffect(() => {
    if (!creatable) {
      setPendingAnnotations([]);
    }
  }, [creatable]);

  // Arbitrary number to set zoom scale
  const SCALE = 0.8;

  const { data: file, isFetched: fileFetched } = useCdfItem<FileInfo>('files', {
    id: fileId,
  });

  const isMimeTypeSet = file && file.mimeType;
  const canPreviewFile = file && isFilePreviewable(file);

  const persistedAnnotations = useAnnotations(fileId);
  const allAnnotations = [
    ...persistedAnnotations,
    ...[...pendingAnnotations].filter(removeSimilarAnnotations),
  ];

  if (!fileFetched) {
    return <Loader />;
  }

  if (!isMimeTypeSet) {
    return (
      <CenteredPlaceholder>
        <h1>No preview</h1>
        <p>
          Please set a MIME type first. <br />
          File types that can be previewed are: {readablePreviewableFileTypes()}
        </p>
      </CenteredPlaceholder>
    );
  }

  if (!canPreviewFile) {
    return (
      <EmptyState
        title="Preview is not available for this type of file"
        body={`File types that can be previewed are: ${readablePreviewableFileTypes()}`}
        graphic="DataKits"
      />
    );
  }

  const handleAnnotationSelectedFromDoc = (
    annotation: (CogniteAnnotation | ProposedCogniteAnnotation)[]
  ) => {
    const selectedAnnotation = annotation[0];
    setZoomedAnnotation(selectedAnnotation as CogniteAnnotation | undefined);
  };

  const getAnnotations = () => {
    return isAnnotationsShown ? allAnnotations : [];
  };

  return (
    <FullHeightWrapper>
      <FullHeightWrapper>
        <CogniteFileViewer.FileViewer
          file={file}
          creatable={creatable}
          annotations={getAnnotations()}
          renderItemPreview={annotation => (
            <AnnotationHoverPreview annotation={annotation} />
          )}
          hoverable
          hideDownload
          onAnnotationSelected={handleAnnotationSelectedFromDoc}
          zoomOnAnnotation={
            zoomedAnnotation && { annotation: zoomedAnnotation, scale: SCALE }
          }
          renderAnnotation={(annotation, isAnnotationSelected) => {
            const iAnnotation = convertCogniteAnnotationToIAnnotation(
              annotation,
              isAnnotationSelected,
              false
            );
            if (annotation.metadata && annotation.metadata.color) {
              iAnnotation.mark.strokeColor = annotation.metadata.color;
            }
            return iAnnotation;
          }}
          editCallbacks={{
            onCreate: (item: PendingCogniteAnnotation) => {
              const newItem = { ...item, id: uuid() };
              setPendingAnnotations([newItem]);
              return false;
            },
            onUpdate: () => false,
          }}
        />
      </FullHeightWrapper>
      <SidebarWrapper>
        <AnnotationPreviewSidebar
          file={file}
          setIsAnnotationsShown={setIsAnnotationsShown}
          isAnnotationsShown={isAnnotationsShown}
          setPendingAnnotations={setPendingAnnotations}
          setZoomedAnnotation={setZoomedAnnotation}
          contextualization={contextualization}
          onItemClicked={onItemClicked}
          annotations={allAnnotations}
          fileIcon={fileIcon}
        />
      </SidebarWrapper>
    </FullHeightWrapper>
  );
};

const FullHeightWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
`;

const SidebarWrapper = styled.div`
  height: 100%;
  max-width: 360px;
  overflow: auto;
  flex-grow: 0;
  border-left: 1px solid ${lightGrey};
`;

const CenteredPlaceholder = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 auto;
  text-align: center;
`;

export const drawIcon = (
  canvas: CanvasRenderingContext2D,
  annotation: CogniteAnnotation | PendingCogniteAnnotation
) => {
  canvas.save();
  canvas.beginPath();
  canvas.fillStyle = '#fff';
  canvas.strokeStyle = '#fff';
  canvas.translate(2, 2);
  canvas.scale(0.75, 0.75);
  switch (annotation.resourceType) {
    case 'asset': {
      canvas.fill(
        new Path2D(
          'M4.5 14.3145L1.0001 8.15729L4.50002 2L5.76179 4.21977L3.52348 8.15754L5.76162 12.095L4.5 14.3145ZM5.76165 12.0951L5.76162 12.095L7.99986 8.15736H7.99991L5.76165 12.0951ZM12.6024 8.15745L12.6024 8.15754L10.3327 12.1506L5.79321 12.1506L5.76165 12.0951L4.50002 14.3146L4.5 14.3145L4.49993 14.3147H11.4998L14.9997 8.15745H15.0001L11.5002 2.00016L4.50031 2.00016L5.76188 4.2196L5.76179 4.21977L7.99995 8.15729L7.99991 8.15736H8.00019L8.00024 8.15745H12.6024ZM12.6023 8.15737L8.00019 8.15736L5.76188 4.2196L5.79321 4.16449L10.3327 4.16449L12.6023 8.15737ZM12.6023 8.15737H14.9997L14.9997 8.15745H12.6024L12.6023 8.15737Z'
        )
      );
      return;
    }
    case 'file': {
      canvas.stroke(new Path2D('M10.75 6.25H5.5V8H10.75V6.25Z'));
      canvas.stroke(new Path2D('M5.5 9.75H10.75V11.5H5.5V9.75Z'));
      canvas.fill(
        new Path2D(
          'M14.25 15H2V1H11.625L14.25 3.625V15ZM12.5 4.5H10.75V2.75H3.75V13.25H12.5V4.5Z'
        ),
        'evenodd'
      );
      return;
    }
    case 'event': {
      canvas.fill(
        new Path2D(
          'M11.5 1V2.75H15V15H1V2.75H4.5V1H6.25V2.75H9.75V1H11.5ZM2.75 13.25V4.5H13.25V13.25H2.75ZM11.0496 5.48124L6.71859 9.81227L4.86244 7.95612L3.625 9.19355L6.71859 12.2871L12.2871 6.71868L11.0496 5.48124Z'
        ),
        'evenodd'
      );
      return;
    }
    case 'sequence': {
      canvas.fillRect(0, 5.85, 2.15, 4.3);
      canvas.fillRect(5.85, 5.85, 4.3, 4.3);
      canvas.fillRect(13.85, 5.85, 2.15, 4.3);
      return;
    }
    case 'timeSeries': {
      canvas.fill(
        new Path2D(
          'M15 4.19407C15 4.85354 14.4758 5.38815 13.8291 5.38815C13.1825 5.38815 12.6583 4.85354 12.6583 4.19407C12.6583 3.53461 13.1825 3 13.8291 3C14.4758 3 15 3.53461 15 4.19407Z'
        )
      );
      canvas.fill(
        new Path2D(
          'M12.6081 7.12804L10.9522 5.43936L7.53576 8.92355L5.3405 6.68477L1 11.1113L2.65584 12.8L5.3405 10.0621L7.53575 12.3009L12.6081 7.12804Z'
        )
      );
    }
  }
  canvas.closePath();
  canvas.restore();
};
