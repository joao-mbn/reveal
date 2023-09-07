import { useMemo } from 'react';

import isEqual from 'lodash/isEqual';

import {
  ContainerType,
  UnifiedViewerMouseEvent,
} from '@cognite/unified-file-viewer';

import { setInteractionState } from '../state/useIndustrialCanvasStore';
import {
  Filter,
  IndustryCanvasContainerConfig,
  IndustryCanvasState,
} from '../types';

import findApplicableContainerConfigFilter from './utils/findApplicableContainerConfigFilter';

const applyProperties = (
  containerConfig: IndustryCanvasContainerConfig,
  filters: Filter[]
) => {
  if (
    containerConfig.type === ContainerType.ASSET ||
    containerConfig.type === ContainerType.EVENT
  ) {
    const filter = findApplicableContainerConfigFilter(
      containerConfig,
      filters
    );

    if (filter === undefined) {
      return containerConfig;
    }

    return {
      ...containerConfig,
      properties: filter.properties,
    };
  }

  return containerConfig;
};

const useContainer = (
  canvasState: IndustryCanvasState
): IndustryCanvasContainerConfig => {
  return useMemo(() => {
    return {
      ...canvasState.container,
      children: (
        canvasState.container.children?.map((containerConfig) => ({
          ...containerConfig,
          onClick: (e: UnifiedViewerMouseEvent) => {
            e.cancelBubble = true;
            setInteractionState({
              hoverId: undefined,
              clickedContainerAnnotationId: undefined,
            });
          },
        })) as IndustryCanvasContainerConfig[]
      ).map((containerConfig) =>
        applyProperties(containerConfig, canvasState.filters)
      ),
    };
  }, [canvasState.container, canvasState.filters]);
};

export default useContainer;
