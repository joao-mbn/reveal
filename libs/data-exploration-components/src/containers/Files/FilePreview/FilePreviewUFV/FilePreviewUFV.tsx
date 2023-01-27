import { FileInfo } from '@cognite/sdk';
import { useSDK } from '@cognite/sdk-provider';
import { useCdfItem } from '@cognite/sdk-react-query-hooks';
import ReactUnifiedViewer, {
  Annotation,
  AnnotationType,
  ContainerConfig,
  getContainerConfigFromFileInfo,
  isSupportedFileInfo,
  ToolType,
  UnifiedViewer,
} from '@cognite/unified-file-viewer';
import { Loader } from '@data-exploration-components/components';
import useTooltips from '@data-exploration-components/containers/Files/FilePreview/FilePreviewUFV/useTooltips';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ResourceItem } from '@data-exploration-components/types';
import { lightGrey } from '@data-exploration-components/utils';

import { usePnIdOCRResultFilterQuery } from '@data-exploration-lib/domain-layer';
import { ActionTools } from './ActionTools';
import { AnnotationPreviewSidebar } from './AnnotationPreviewSidebar';
import {
  DEFAULT_ZOOM_SCALE,
  MAX_CONTAINER_HEIGHT,
  MAX_CONTAINER_WIDTH,
} from './constants';
import getExtendedAnnotationsWithBadges from './getExtendedAnnotationsWithBadges';
import { useUnifiedFileViewerAnnotations } from './hooks';
import { Pagination } from './Pagination';
import {
  ANNOTATION_SOURCE_KEY,
  AnnotationSource,
  ExtendedAnnotation,
} from '@data-exploration-lib/core';
import { getContainerId } from './utils';
import { FileContainerProps } from '@cognite/unified-file-viewer/dist/core/utils/getContainerConfigFromUrl';
import { Flex } from '@cognite/cogs.js';

export type FilePreviewUFVProps = {
  id: string;
  applicationId: string;
  fileId: number;
  creatable: boolean;
  contextualization: boolean;
  onItemClicked?: (item: ResourceItem) => void;
  fileIcon?: React.ReactNode;
  showControls?: boolean;
  showDownload?: boolean;
  showSideBar?: boolean;
  enableZoomToAnnotation?: boolean;
  enableToolTips?: boolean;
};

const RectangleToolProps = {
  tool: ToolType.RECTANGLE,
  toolOptions: {
    fill: 'transparent',
    strokeWidth: 4,
    stroke: 'black',
  },
};

const PanToolProps = {
  tool: ToolType.PAN,
};

export const FilePreviewUFV = ({
  id,
  applicationId,
  fileId,
  creatable,
  contextualization,
  onItemClicked,
  fileIcon,
  showDownload = false,
  showControls = true,
  showSideBar = true,
  enableZoomToAnnotation = true,
  enableToolTips = true,
}: FilePreviewUFVProps) => {
  const [unifiedViewerRef, setUnifiedViewerRef] = useState<UnifiedViewer>();
  const [page, setPage] = useState(1);
  const [container, setContainer] = useState<FileContainerProps>();
  const [hoverId, setHoverId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pendingAnnotations, setPendingAnnotations] = useState<
    ExtendedAnnotation[]
  >([]);
  const [showResourcePreviewSidebar, setShowResourcePreviewSidebar] =
    React.useState<boolean>(false);
  const sdk = useSDK();

  const [isAnnotationsShown, setIsAnnotationsShown] = useState<boolean>(true);
  const [selectedAnnotations, setSelectedAnnotations] = useState<
    ExtendedAnnotation[]
  >([]);

  const { data: file, isFetched: isFileFetched } = useCdfItem<FileInfo>(
    'files',
    {
      id: fileId,
    }
  );

  useEffect(() => {
    if (selectedAnnotations.length === 1) {
      const [annotation] = selectedAnnotations;
      if (enableZoomToAnnotation) {
        zoomToAnnotation(annotation);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnnotations, enableZoomToAnnotation]);

  useEffect(() => {
    setPendingAnnotations([]);
    setSelectedAnnotations([]);
  }, [fileId]);

  useEffect(() => {
    if (!creatable) {
      setPendingAnnotations([]);
      setSelectedAnnotations([]);
    }
  }, [creatable]);

  useEffect(() => {
    (async () => {
      if (file && isSupportedFileInfo(file)) {
        setContainer(
          await getContainerConfigFromFileInfo(sdk as any, file, {
            id: getContainerId(file.id),
            page,
            maxWidth: MAX_CONTAINER_WIDTH,
            maxHeight: MAX_CONTAINER_HEIGHT,
          })
        );
      }
    })();
  }, [file, page, sdk]);

  const onClickAnnotation = useCallback(
    (annotation: ExtendedAnnotation) =>
      setSelectedAnnotations((prevSelectedAnnotations) =>
        prevSelectedAnnotations.some(
          (prevSelectedAnnotation) =>
            prevSelectedAnnotation.id === annotation.id
        )
          ? []
          : [annotation]
      ),
    [setSelectedAnnotations]
  );

  const onAnnotationMouseOver = useCallback((annotation: Annotation) => {
    setHoverId(annotation.id);
  }, []);

  const onAnnotationMouseOut = useCallback(() => {
    setHoverId(undefined);
  }, []);

  const annotations = useUnifiedFileViewerAnnotations({
    fileId,
    page,
    selectedAnnotations,
    pendingAnnotations,
    hoverId,
    onClick: onClickAnnotation,
    onMouseOver: onAnnotationMouseOver,
    onMouseOut: onAnnotationMouseOut,
  });

  const { annotationSearchResult, resultsAvailable } =
    usePnIdOCRResultFilterQuery(searchQuery, file, page, showControls);

  const displayedAnnotations = useMemo(() => {
    if (isAnnotationsShown) {
      return [
        ...getExtendedAnnotationsWithBadges(annotations),
        ...annotationSearchResult,
      ];
    }
    return [...annotationSearchResult];
  }, [isAnnotationsShown, annotations, annotationSearchResult]);

  const tooltips = useTooltips({
    isTooltipsEnabled: enableToolTips,
    // NOTE: Once support for annotations from Events API has been removed, we can
    // actually access the file id directly from the annotation. This does not work currently
    // though because the Event API annotations might not hav the file id set (and only the external id)
    fileId,
    annotations: annotations,
    hoverId: hoverId,
    selectedAnnotations: selectedAnnotations,
  });

  const onStageClick = useCallback(() => {
    setSelectedAnnotations([]);
  }, [setSelectedAnnotations]);

  const handleUpdateRequest = (update: {
    containers: ContainerConfig[];
    annotations: Annotation[];
  }) => {
    if (file === undefined) {
      return;
    }

    if (update.annotations.length === 0) {
      return;
    }

    const annotation = update.annotations[0];
    if (annotation.type !== AnnotationType.RECTANGLE) {
      throw new Error('Only expecting rectangle annotations from this flow');
    }

    const pendingAnnotation: ExtendedAnnotation = {
      ...annotation,
      metadata: {
        [ANNOTATION_SOURCE_KEY]: AnnotationSource.LOCAL,
        annotationType: 'diagrams.UnhandledTextObject',
        annotatedResourceType: 'file',
        annotatedResourceId: file.id,
        data: {
          text: '',
          textRegion: {
            xMin: annotation.x,
            yMin: annotation.y,
            xMax: annotation.x + annotation.width,
            yMax: annotation.y + annotation.height,
          },
          pageNumber: page,
        },
      },
    };

    setPendingAnnotations([pendingAnnotation]);
    setSelectedAnnotations([pendingAnnotation]);
  };

  const zoomToAnnotation = (annotation: ExtendedAnnotation) =>
    unifiedViewerRef?.zoomToAnnotationById(annotation.id, {
      scale: DEFAULT_ZOOM_SCALE,
    });

  const handlePageChange = (pageNumber: number) => setPage(pageNumber);

  if (file !== undefined && !isSupportedFileInfo(file)) {
    return (
      <CenteredPlaceholder>
        <h1>No preview for this file type</h1>
      </CenteredPlaceholder>
    );
  }

  if (!isFileFetched || container === undefined || file === undefined) {
    return <Loader />;
  }

  const toolProps = creatable ? RectangleToolProps : PanToolProps;

  return (
    <FullHeightWrapper justifyContent="flex-end">
      <UFVWrapper>
        <ReactUnifiedViewer
          applicationId={applicationId}
          id={id}
          setRef={(ref) => setUnifiedViewerRef(ref)}
          container={container}
          annotations={displayedAnnotations}
          tooltips={enableToolTips ? tooltips : undefined}
          onClick={onStageClick}
          shouldShowZoomControls={showControls}
          onUpdateRequest={handleUpdateRequest}
          {...toolProps}
        />
        <Pagination container={container} onPageChange={handlePageChange} />
        <ActionTools
          file={file}
          fileViewerRef={unifiedViewerRef}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          enableDownload={showDownload}
          enableSearch={showControls && resultsAvailable}
          showSideBar={showSideBar}
          showResourcePreviewSidebar={showResourcePreviewSidebar}
          setShowResourcePreviewSidebar={setShowResourcePreviewSidebar}
        />
      </UFVWrapper>
      {showSideBar && showResourcePreviewSidebar && (
        <SidebarWrapper>
          <AnnotationPreviewSidebar
            file={file}
            setIsAnnotationsShown={setIsAnnotationsShown}
            isAnnotationsShown={isAnnotationsShown}
            setPendingAnnotations={setPendingAnnotations}
            contextualization={contextualization}
            onItemClicked={onItemClicked}
            annotations={annotations}
            fileIcon={fileIcon}
            reset={() => unifiedViewerRef?.zoomToFit()}
            selectedAnnotations={selectedAnnotations}
            setSelectedAnnotations={setSelectedAnnotations}
          />
        </SidebarWrapper>
      )}
    </FullHeightWrapper>
  );
};

const UFVWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  position: relative;
`;
const FullHeightWrapper = styled(Flex)`
  height: 100%;
`;

const SidebarWrapper = styled.div`
  box-sizing: content-box;
  height: 100%;
  max-width: 360px;
  border-left: 1px solid ${lightGrey};
  background-color: white;
`;

const CenteredPlaceholder = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 auto;
  text-align: center;
`;
