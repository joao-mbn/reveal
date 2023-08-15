import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';

import styled from 'styled-components';

import { isDevelopment } from '@cognite/cdf-utilities';
import { useFlag } from '@cognite/react-feature-flags';
import { useSDK } from '@cognite/sdk-provider';
import ReactUnifiedViewer, {
  Annotation,
  UnifiedViewer,
  ZoomToFitMode,
} from '@cognite/unified-file-viewer';
import { UnifiedViewerPointerEvent } from '@cognite/unified-file-viewer/dist/core/UnifiedViewerRenderer/UnifiedEventHandler';

import ToolbarComponent from './components/ToolbarComponent';
import ZoomControls from './components/ZoomControls';
import {
  STAGE_ALT_CLICK_ZOOM_LEVEL,
  ZOOM_DURATION_SECONDS,
  ZOOM_TO_FIT_MARGIN,
  ZOOM_LEVELS,
  CANVAS_FLOATING_ELEMENT_MARGIN,
  ZOOM_CONTROLS_COGPILOT_ENABLED_RIGHT_MARGIN,
} from './constants';
import useEditOnSelect from './hooks/useEditOnSelect';
import useIndustryCanvasTooltips from './hooks/useIndustryCanvasTooltips';
import { UseManagedStateReturnType } from './hooks/useManagedState';
import { UseManagedToolReturnType } from './hooks/useManagedTool';
import { UseOnUpdateSelectedAnnotationReturnType } from './hooks/useOnUpdateSelectedAnnotation';
import { UseResourceSelectorActionsReturnType } from './hooks/useResourceSelectorActions';
import { UseTooltipsOptionsReturnType } from './hooks/useTooltipsOptions';
import { OnAddContainerReferences } from './IndustryCanvasPage';
import type { Comment } from './services/comments/types';
import {
  CanvasAnnotation,
  CommentAnnotation,
  IndustryCanvasContainerConfig,
  IndustryCanvasToolType,
} from './types';
import { getIndustryCanvasConnectionAnnotations } from './utils/getIndustryCanvasConnectionAnnotations';
import getContainerSummarizationSticky from './utils/getSummarizationSticky';
import summarizeText from './utils/summarizeText';

export type IndustryCanvasProps = {
  id: string;
  applicationId: string;
  shouldShowConnectionAnnotations: boolean;
  currentZoomScale: number;
  onAddContainerReferences: OnAddContainerReferences;
  onRef?: (ref: UnifiedViewer | null) => void;
  viewerRef: UnifiedViewer | null;
  selectedContainer: IndustryCanvasContainerConfig | undefined;
  selectedCanvasAnnotation: CanvasAnnotation | undefined;
  commentAnnotations: CommentAnnotation[];
  toolType: IndustryCanvasToolType;
  setToolType: Dispatch<SetStateAction<IndustryCanvasToolType>>;
  isCanvasLocked: boolean;
  onResourceSelectorOpen: UseResourceSelectorActionsReturnType['onResourceSelectorOpen'];
  tool: UseManagedToolReturnType['tool'];
  comments: Comment[];
} & Pick<
  UseManagedStateReturnType,
  | 'container'
  | 'canvasAnnotations'
  | 'onDeleteRequest'
  | 'onUpdateRequest'
  | 'updateContainerById'
  | 'removeContainerById'
  | 'clickedContainerAnnotation'
  | 'interactionState'
  | 'setInteractionState'
  | 'containerAnnotations'
  | 'pinnedTimeseriesIdsByAnnotationId'
  | 'onPinTimeseriesClick'
  | 'liveSensorRulesByAnnotationIdByTimeseriesId'
  | 'onLiveSensorRulesChange'
  | 'isConditionalFormattingOpenAnnotationIdByTimeseriesId'
  | 'onOpenConditionalFormattingClick'
  | 'onCloseConditionalFormattingClick'
  | 'onToggleConditionalFormatting'
> &
  UseOnUpdateSelectedAnnotationReturnType &
  Pick<
    UseTooltipsOptionsReturnType,
    'tooltipsOptions' | 'onUpdateTooltipsOptions'
  >;

export type OnOpenConditionalFormattingClick = ({
  annotationId,
  timeseriesId,
}: {
  annotationId: string;
  timeseriesId: number;
}) => void;

export const IndustryCanvas = ({
  id,
  applicationId,
  container,
  canvasAnnotations,
  currentZoomScale,
  onDeleteRequest,
  onUpdateRequest,
  updateContainerById,
  removeContainerById,
  interactionState,
  setInteractionState,
  containerAnnotations,
  clickedContainerAnnotation,
  selectedContainer,
  selectedCanvasAnnotation,
  onAddContainerReferences,
  onRef,
  viewerRef,
  toolType,
  setToolType,
  onUpdateSelectedAnnotation,
  shouldShowConnectionAnnotations,
  tool,
  comments,
  commentAnnotations,
  isCanvasLocked,
  onResourceSelectorOpen,
  tooltipsOptions,
  onUpdateTooltipsOptions,
  pinnedTimeseriesIdsByAnnotationId,
  onPinTimeseriesClick,
  liveSensorRulesByAnnotationIdByTimeseriesId,
  onLiveSensorRulesChange,
  isConditionalFormattingOpenAnnotationIdByTimeseriesId,
  onOpenConditionalFormattingClick,
  onCloseConditionalFormattingClick,
  onToggleConditionalFormatting,
}: IndustryCanvasProps) => {
  const sdk = useSDK();

  const unifiedViewerRef = React.useRef<UnifiedViewer | null>(null);

  const onDeleteSelectedCanvasAnnotation = useCallback(() => {
    setInteractionState({
      hoverId: undefined,
      clickedContainerAnnotationId: undefined,
    });
    onDeleteRequest({
      annotationIds:
        selectedCanvasAnnotation === undefined
          ? []
          : [selectedCanvasAnnotation.id],
      containerIds: [],
    });
  }, [selectedCanvasAnnotation, onDeleteRequest, setInteractionState]);

  const onAddSummarizationSticky = async (
    containerConfig: IndustryCanvasContainerConfig,
    text: string,
    isMultiPageDocument: boolean
  ) => {
    const MAX_WORDS_IN_GENERATED_SUMMARY = 80;
    const summary = await summarizeText(
      sdk,
      text,
      MAX_WORDS_IN_GENERATED_SUMMARY
    );
    onUpdateRequest({
      annotations: [
        getContainerSummarizationSticky(
          containerConfig,
          summary,
          isMultiPageDocument
        ),
      ],
      containers: [],
    });
  };

  const tooltips = useIndustryCanvasTooltips({
    selectedContainer,
    containers: container.children ?? [],
    clickedContainerAnnotation,
    selectedCanvasAnnotation,
    tooltipsOptions,
    onUpdateTooltipsOptions,
    onAddContainerReferences,
    onAddSummarizationSticky,
    onDeleteSelectedCanvasAnnotation,
    onUpdateSelectedAnnotation,
    updateContainerById,
    removeContainerById,
    onResourceSelectorOpen,
    comments,
    commentAnnotations,
    pinnedTimeseriesIdsByAnnotationId,
    onPinTimeseriesClick,
    isConditionalFormattingOpenAnnotationIdByTimeseriesId,
    onOpenConditionalFormattingClick,
    liveSensorRulesByAnnotationIdByTimeseriesId,
    onLiveSensorRulesChange,
    onCloseConditionalFormattingClick,
    onToggleConditionalFormatting,
  });

  const onStageClick = useCallback(
    (e: UnifiedViewerPointerEvent) => {
      // Sometimes the stage click event is fired when the user creates an annotation.
      // We want the tooltip to stay open in this case.
      // TODO: Bug tracked by https://cognitedata.atlassian.net/browse/UFV-507
      if (
        toolType === IndustryCanvasToolType.LINE ||
        toolType === IndustryCanvasToolType.ELLIPSE
      ) {
        return;
      }

      if (e.evt.altKey) {
        unifiedViewerRef.current?.setScale(STAGE_ALT_CLICK_ZOOM_LEVEL, {
          duration: ZOOM_DURATION_SECONDS,
        });
      }

      setInteractionState({
        clickedContainerAnnotationId: undefined,
        hoverId: undefined,
      });
    },
    [setInteractionState, toolType]
  );

  const { handleSelect, getAnnotationEditHandlers } = useEditOnSelect(
    unifiedViewerRef,
    toolType,
    setToolType
  );

  const canvasAnnotationWithEventHandlers = useMemo(
    () =>
      canvasAnnotations.map((canvasAnnotation) => ({
        ...canvasAnnotation,
        ...getAnnotationEditHandlers(canvasAnnotation),
        onClick: (e: any, annotation: CanvasAnnotation) => {
          e.cancelBubble = true;
          setInteractionState({
            hoverId: undefined,
            clickedContainerAnnotationId: annotation.id,
          });
        },
      })),
    [canvasAnnotations, setInteractionState, getAnnotationEditHandlers]
  );

  const enhancedAnnotations: Annotation[] = useMemo(
    () => [
      // TODO: Bug tracked by https://cognitedata.atlassian.net/browse/UFV-363
      // ...getClickedContainerOutlineAnnotation(clickedContainer),
      ...getIndustryCanvasConnectionAnnotations({
        container,
        selectedContainer,
        hoverId: interactionState.hoverId,
        clickedId: interactionState.clickedContainerAnnotationId,
        annotations: containerAnnotations,
        shouldShowAllConnectionAnnotations: shouldShowConnectionAnnotations,
      }),
      ...containerAnnotations,
      ...commentAnnotations,
      ...canvasAnnotationWithEventHandlers,
    ],
    [
      container,
      selectedContainer,
      interactionState.hoverId,
      interactionState.clickedContainerAnnotationId,
      containerAnnotations,
      shouldShowConnectionAnnotations,
      commentAnnotations,
      canvasAnnotationWithEventHandlers,
    ]
  );

  const handleRef = useCallback(
    (ref: UnifiedViewer | null) => {
      unifiedViewerRef.current = ref;
      onRef?.(ref);
    },
    [onRef]
  );

  const zoomIn = useCallback(() => {
    if (viewerRef === null) {
      return;
    }

    const currentScale = viewerRef.getScale();
    const newScale = ZOOM_LEVELS.find((stepSize) => stepSize > currentScale);

    viewerRef.setScale(newScale ?? currentScale, {
      duration: ZOOM_DURATION_SECONDS,
    });
  }, [viewerRef]);

  const zoomOut = useCallback(() => {
    if (viewerRef === null) {
      return;
    }

    const currentScale = viewerRef.getScale();
    const newScale = ZOOM_LEVELS.slice()
      .reverse()
      .find((stepSize) => stepSize < currentScale);

    viewerRef.setScale(newScale ?? currentScale, {
      duration: ZOOM_DURATION_SECONDS,
    });
  }, [viewerRef]);

  const { isEnabled: isCogPilotEnabled } = useFlag('COGNITE_COPILOT', {
    fallback: false,
    forceRerender: true,
  });

  return (
    <FullHeightWrapper>
      <ReactUnifiedViewer
        applicationId={applicationId}
        id={id}
        container={container}
        annotations={enhancedAnnotations}
        tooltips={tooltips}
        onClick={onStageClick}
        shouldShowZoomControls={false}
        shouldUseAdaptiveRendering
        setRef={handleRef}
        tool={tool}
        onSelect={handleSelect}
        onDeleteRequest={onDeleteRequest}
        onUpdateRequest={onUpdateRequest}
        initialViewport={{
          x: 2000,
          y: 500,
          width: 4000,
          height: 1000,
        }}
        // We are using a different version of the SDK in the library
        // but the conflicts are irrelevant for IC, so just recasting sadly
        cogniteClient={sdk as any}
        shouldAllowDragDrop={false} // We are using our own drag and drop handlers
      />
      <ToolbarWrapper>
        <ToolbarComponent
          activeTool={toolType}
          onToolChange={setToolType}
          isCanvasLocked={isCanvasLocked}
        />
      </ToolbarWrapper>
      <ZoomControlsWrapper isCogPilotEnabled={isCogPilotEnabled}>
        <ZoomControls
          currentZoomScale={currentZoomScale}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          zoomToFit={() => {
            viewerRef?.zoomToFit(ZoomToFitMode.DEFAULT, {
              relativeMargin: ZOOM_TO_FIT_MARGIN,
            });
          }}
          setZoomScale={(value: number) => {
            viewerRef?.setScale(value);
          }}
        />
      </ZoomControlsWrapper>
    </FullHeightWrapper>
  );
};

const FullHeightWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  position: relative;
`;

// TODO right: ${isDevelopment() ? 70 : CANVAS_FLOATING_ELEMENT_MARGIN}px;
const ZoomControlsWrapper = styled.div<{ isCogPilotEnabled: boolean }>`
  position: absolute;
  bottom: ${CANVAS_FLOATING_ELEMENT_MARGIN}px;
  right: ${({ isCogPilotEnabled }) =>
    isCogPilotEnabled
      ? ZOOM_CONTROLS_COGPILOT_ENABLED_RIGHT_MARGIN
      : CANVAS_FLOATING_ELEMENT_MARGIN}px;
`;

const ToolbarWrapper = styled.div`
  position: absolute;
  bottom: ${isDevelopment() ? 70 : CANVAS_FLOATING_ELEMENT_MARGIN}px;
  left: ${CANVAS_FLOATING_ELEMENT_MARGIN}px;
`;
