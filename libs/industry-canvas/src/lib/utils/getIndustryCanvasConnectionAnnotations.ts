import { partition } from 'lodash';
import uniqBy from 'lodash/uniqBy';

import {
  getFileIdFromExtendedAnnotation,
  getResourceIdFromExtendedAnnotation,
  getResourceTypeAnnotationColor,
  getResourceTypeFromExtendedAnnotation,
} from '@cognite/data-exploration';
import { Timeseries } from '@cognite/sdk/dist/src';
import {
  Annotation,
  AnnotationType,
  ContainerType,
  isConnectionPolylineAnnotation,
  LineType,
  PolylineAnnotation,
  RectangleAnnotation,
} from '@cognite/unified-file-viewer';

import { ExtendedAnnotation, isNotUndefined } from '@data-exploration-lib/core';

import { IndustryCanvasContainerConfig } from '../types';

const ONLY_SHOW_REGION_TO_REGION_IF_ONE_TO_ONE = true;

const CONNECTION_OPACITY = 0.5;
const CONNECTION_STROKE_WIDTH = 2;
const FILE_CONNECTION_STROKE =
  getResourceTypeAnnotationColor('file').strokeColor;
const ASSET_CONNECTION_STROKE =
  getResourceTypeAnnotationColor('asset').strokeColor;
const TIMESERIES_CONNECTION_STROKE =
  getResourceTypeAnnotationColor('timeSeries').strokeColor;

const resourceTypeToConnectionStroke = {
  file: FILE_CONNECTION_STROKE,
  asset: ASSET_CONNECTION_STROKE,
  timeSeries: TIMESERIES_CONNECTION_STROKE,
};

const getHighlightingRectangleId = ({
  containerConfig,
  resourceType,
}: {
  containerConfig: IndustryCanvasContainerConfig;
  resourceType: 'file' | 'asset' | 'timeSeries';
}) => `highlighting-rectangle-${containerConfig.id}-${resourceType}`;

const getHighlightingRectangle = ({
  containerConfig,
  resourceType,
}: {
  containerConfig: IndustryCanvasContainerConfig;
  resourceType: 'file' | 'asset' | 'timeSeries';
}) => {
  const stroke = resourceTypeToConnectionStroke[resourceType];
  const highlightingRectangle: RectangleAnnotation = {
    type: AnnotationType.RECTANGLE,
    id: getHighlightingRectangleId({
      containerConfig,
      resourceType,
    }),
    containerId: containerConfig.id,
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    isSelectable: false,
    style: {
      fill: 'transparent',
      stroke,
      strokeWidth: CONNECTION_STROKE_WIDTH,
      opacity: CONNECTION_OPACITY,
    },
  };

  return highlightingRectangle;
};

const getAnnotationToRegionConnection = ({
  sourceAnnotation,
  targetContainer,
  resourceType,
  isSelfReferential = false,
}: {
  sourceAnnotation: ExtendedAnnotation;
  targetContainer: IndustryCanvasContainerConfig;
  resourceType: 'file' | 'asset' | 'timeSeries';
  isSelfReferential?: boolean;
}): Annotation[] => {
  const highlightingRectangle = getHighlightingRectangle({
    containerConfig: targetContainer,
    resourceType,
  });

  if (isSelfReferential) {
    return [highlightingRectangle];
  }

  const connection: PolylineAnnotation = {
    id: `connection-${sourceAnnotation.id}-${highlightingRectangle.id}`,
    type: AnnotationType.POLYLINE,
    fromId: sourceAnnotation.id,
    toId: highlightingRectangle.id,
    style: {
      stroke: resourceTypeToConnectionStroke[resourceType],
      strokeWidth: CONNECTION_STROKE_WIDTH,
      opacity: CONNECTION_OPACITY,
    },
    isSelectable: false,
  };

  return [highlightingRectangle, connection];
};

const EMPTY_CONNECTION_ANNOTATIONS: Annotation[] = [];

const getConnectionAnnotations = ({
  sourceAnnotation,
  annotations,
  containers,
  shouldAddSelfReferentialHighlighting = false,
  timeseriesById,
}: {
  sourceAnnotation: ExtendedAnnotation;
  containers: IndustryCanvasContainerConfig[];
  annotations: ExtendedAnnotation[];
  shouldAddSelfReferentialHighlighting?: boolean;
  timeseriesById: Record<string, Timeseries>;
}): Annotation[] => {
  const sourceResourceType =
    getResourceTypeFromExtendedAnnotation(sourceAnnotation);
  if (sourceResourceType === 'asset') {
    return getAssetConnectionAnnotations({
      sourceAnnotation,
      containers,
      timeseriesById,
    });
  }

  if (sourceResourceType === 'file') {
    return getFileConnectionAnnotations({
      sourceAnnotation,
      annotations,
      containers,
      shouldAddSelfReferentialHighlighting,
    });
  }

  return EMPTY_CONNECTION_ANNOTATIONS;
};

const getAssetConnectionAnnotations = ({
  sourceAnnotation,
  containers,
  timeseriesById,
}: {
  sourceAnnotation: ExtendedAnnotation;
  containers: IndustryCanvasContainerConfig[];
  timeseriesById: Record<string, Timeseries>;
}) => {
  const targetAssetId = getResourceIdFromExtendedAnnotation(sourceAnnotation);
  if (targetAssetId === undefined) {
    return EMPTY_CONNECTION_ANNOTATIONS;
  }
  const linkedAssetContainers = containers.filter(
    (containerConfig) =>
      containerConfig.type === ContainerType.ASSET &&
      containerConfig.assetId === targetAssetId
  );
  const linkedTimeseriesContainers = containers.filter(
    (containerConfig) =>
      containerConfig.type === ContainerType.TIMESERIES &&
      timeseriesById[containerConfig.timeseriesId] !== undefined &&
      timeseriesById[containerConfig.timeseriesId].assetId === targetAssetId
  );
  const linkedContainers = linkedAssetContainers.concat(
    linkedTimeseriesContainers
  );

  return linkedContainers.flatMap((targetContainer): Annotation[] =>
    getAnnotationToRegionConnection({
      sourceAnnotation,
      targetContainer,
      // since linkedContainers is filtered by either asset or timeseries type we can safely do the checking below
      resourceType:
        targetContainer.type === ContainerType.ASSET ? 'asset' : 'timeSeries',
    })
  );
};

const getFileConnectionAnnotations = ({
  sourceAnnotation,
  annotations,
  containers,
  shouldAddSelfReferentialHighlighting,
}: {
  sourceAnnotation: ExtendedAnnotation;
  containers: IndustryCanvasContainerConfig[];
  annotations: ExtendedAnnotation[];
  shouldAddSelfReferentialHighlighting: boolean;
}) => {
  const sourceFileId = getFileIdFromExtendedAnnotation(sourceAnnotation);
  if (sourceFileId === undefined) {
    // Note: this should never happen since we are filtering on file annotations
    return EMPTY_CONNECTION_ANNOTATIONS;
  }

  const targetFileId = getResourceIdFromExtendedAnnotation(sourceAnnotation);
  if (targetFileId === undefined) {
    return EMPTY_CONNECTION_ANNOTATIONS;
  }

  const isSelfReferentialFileLink = sourceFileId === targetFileId;
  if (!shouldAddSelfReferentialHighlighting && isSelfReferentialFileLink) {
    return EMPTY_CONNECTION_ANNOTATIONS;
  }

  const linkedContainers = containers.filter(
    (containerConfig) =>
      (containerConfig.type === ContainerType.DOCUMENT ||
        containerConfig.type === ContainerType.IMAGE ||
        containerConfig.type === ContainerType.TEXT) &&
      containerConfig.metadata.resourceId === targetFileId
  );

  return linkedContainers.flatMap<Annotation>(
    (targetContainer): Annotation[] => {
      const targetAnnotations = annotations.filter(
        (annotation) =>
          getResourceTypeFromExtendedAnnotation(annotation) === 'file' &&
          getResourceIdFromExtendedAnnotation(annotation) === sourceFileId &&
          getFileIdFromExtendedAnnotation(annotation) === targetFileId
      );

      const isRegionToRegionLink = ONLY_SHOW_REGION_TO_REGION_IF_ONE_TO_ONE
        ? targetAnnotations.length === 1
        : targetAnnotations.length > 0;

      if (!isRegionToRegionLink || isSelfReferentialFileLink) {
        return getAnnotationToRegionConnection({
          sourceAnnotation,
          targetContainer,
          resourceType: 'file',
          isSelfReferential: isSelfReferentialFileLink,
        });
      }

      return targetAnnotations.map(
        (targetAnnotation): PolylineAnnotation => ({
          id: `connection-${sourceAnnotation.id}-${targetAnnotation.id}`,
          type: AnnotationType.POLYLINE,
          fromId: sourceAnnotation.id,
          toId: targetAnnotation.id,
          style: {
            stroke: FILE_CONNECTION_STROKE,
            strokeWidth: CONNECTION_STROKE_WIDTH,
            opacity: CONNECTION_OPACITY,
            lineType: LineType.RIGHT_ANGLES,
          },
          isSelectable: false,
        })
      );
    }
  );
};

export const getIndustryCanvasConnectionAnnotations = ({
  containers,
  selectedContainers,
  annotations,
  hoverId,
  clickedId,
  shouldShowAllConnectionAnnotations,
  timeseriesById,
}: {
  containers: IndustryCanvasContainerConfig[];
  selectedContainers: IndustryCanvasContainerConfig[];
  annotations: ExtendedAnnotation[];
  hoverId: string | undefined;
  clickedId: string | undefined;
  shouldShowAllConnectionAnnotations: boolean;
  timeseriesById: Record<string, Timeseries>;
}): Annotation[] => {
  const alreadyConnectedAnnotations = new Set<string>();
  const connectionAnnotations = uniqBy(
    annotations.flatMap((sourceAnnotation) => {
      if (alreadyConnectedAnnotations.has(sourceAnnotation.id)) {
        return EMPTY_CONNECTION_ANNOTATIONS;
      }

      const connectionAnnotations = getConnectionAnnotations({
        sourceAnnotation,
        annotations,
        containers,
        timeseriesById,
      });

      // Populate the set of already connected annotations to avoid duplicate connections
      connectionAnnotations
        .filter(isConnectionPolylineAnnotation)
        .map((connectionAnnotation) => connectionAnnotation.toId)
        .filter(isNotUndefined)
        .forEach((id) => alreadyConnectedAnnotations.add(id));

      return connectionAnnotations;
    }),
    (annotation) => annotation.id
  );
  if (shouldShowAllConnectionAnnotations) {
    return connectionAnnotations;
  }

  const [polylineConnectionAnnotations, highlightingRectangles] = partition(
    connectionAnnotations,
    isConnectionPolylineAnnotation
  );

  const annotationToContainerIdMap = new Map<string, string>();
  [...highlightingRectangles, ...annotations].forEach((annotation) => {
    const { containerId } = annotation;
    if (containerId === undefined) {
      return;
    }
    annotationToContainerIdMap.set(annotation.id, containerId);
  });

  const shouldShowSelectedContainerConnectionAnnotations =
    clickedId === undefined && selectedContainers.length > 0;

  const linkedConnectionAnnotations = polylineConnectionAnnotations.filter(
    (annotation) => {
      const { fromId, toId } = annotation;
      if (
        [fromId, toId].includes(hoverId) ||
        [fromId, toId].includes(clickedId)
      ) {
        return true;
      }

      if (shouldShowSelectedContainerConnectionAnnotations) {
        return (
          (fromId !== undefined &&
            selectedContainers.some(
              (selectedContainer) =>
                annotationToContainerIdMap.get(fromId) === selectedContainer.id
            )) ||
          (toId !== undefined &&
            selectedContainers.some(
              (selectedContainer) =>
                annotationToContainerIdMap.get(toId) === selectedContainer.id
            ))
        );
      }

      return false;
    }
  );

  const linkedConnectionAnnotationsEndPointIds = new Set(
    linkedConnectionAnnotations.flatMap((annotation) => [
      annotation.fromId,
      annotation.toId,
    ])
  );
  const linkedHighlightingAnnotations = highlightingRectangles.filter(
    (annotation) => linkedConnectionAnnotationsEndPointIds.has(annotation.id)
  );

  return [...linkedConnectionAnnotations, ...linkedHighlightingAnnotations];
};
