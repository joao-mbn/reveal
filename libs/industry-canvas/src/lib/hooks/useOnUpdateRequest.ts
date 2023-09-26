import { useCallback } from 'react';

import {
  UnifiedViewer,
  UnifiedViewerEventListenerMap,
  UnifiedViewerEventType,
} from '@cognite/unified-file-viewer';

import { RuleType } from '../components/ContextualTooltips/AssetTooltip/types';
import { shamefulOnUpdateRequest } from '../state/useIndustrialCanvasStore';
import { CanvasNode } from '../types';
import useMetrics from '../utils/tracking/useMetrics';

export type InteractionState = {
  hoverId: string | undefined;
  clickedContainerAnnotationId: string | undefined;
};

export type UpdateHandlerFn =
  UnifiedViewerEventListenerMap[UnifiedViewerEventType.ON_UPDATE_REQUEST];

export type IsConditionalFormattingOpenByAnnotationIdByTimeseriesId = Record<
  string,
  Record<number, boolean>
>;

export type LiveSensorRulesByAnnotationIdByTimeseriesId = Record<
  string,
  Record<number, RuleType[]>
>;

const mergeIfMatchById = <T extends { id: string }, U extends { id: string }>(
  array: T[],
  element: U
): U => {
  const foundElement = array.find((arrElem) => arrElem.id === element.id);

  if (!foundElement) {
    return element;
  }

  return {
    ...element,
    ...foundElement,
  };
};

export const getNextUpdatedNodes = (
  prevNodes: CanvasNode[],
  updatedNodes: CanvasNode[]
): CanvasNode[] => {
  return [
    ...prevNodes.map((prevNode) => mergeIfMatchById(updatedNodes, prevNode)),
    ...updatedNodes.filter(
      (updatedNode) => !prevNodes.some((node) => node.id === updatedNode.id)
    ),
  ];
};

const useOnUpdateRequest = ({
  unifiedViewer,
}: {
  unifiedViewer: UnifiedViewer | null;
}): UpdateHandlerFn => {
  const trackUsage = useMetrics();

  return useCallback(
    ({ containers, annotations }) => {
      shamefulOnUpdateRequest({
        containers,
        annotations,
        unifiedViewer,
        trackUsage,
      });
    },
    [unifiedViewer, trackUsage]
  );
};

export default useOnUpdateRequest;