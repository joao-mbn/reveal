import { BaseRegion as ReactImageAnnotateBaseRegion } from '@cognite/react-image-annotate';
import { VisionAnnotationDataType } from 'src/modules/Common/types';
import { CDFAnnotationTypeEnum, Status } from 'src/api/annotation/types';
import { VisionReviewAnnotation } from 'src/modules/Review/types';

// This will always be a label or a text field of an annotation
export type AnnotatorAnnotationLabelOrText = string;
/**
 * @deprecated Remove usages of AnnotatorKeypointOrder since it's no longer needed.
 * Keypoint labels are unique within a single annotation. parentAnnotationId and label
 * can be used to generate its unique id
 */
export type AnnotatorKeypointOrder = string | null; // todo: remove null once tag usages are removed;
export type AnnotatorParentAnnotationId = string | null; // todo: remove null once tag usages are removed
export type AnnotatorKeypointLabel = string | null; // todo: remove null once tag usages are removed

/**
 * @deprecated use 'annotationLabelOrText' in AnnotatorBaseRegion and
 * 'parentAnnotationId', 'keypointOrder', 'keypointLabel' introduced in AnnotatorPointRegion instead
 * to pass this metadata
 *
 * tags array for the region was repurposed to send annotation metadata to the Annotator component without
 * introducing new fields. But now new fields have been introduced to in a more targeted approach to send this metadata
 */
export type AnnotatorRegionTags = [
  AnnotatorAnnotationLabelOrText,
  AnnotatorKeypointOrder,
  AnnotatorParentAnnotationId,
  AnnotatorKeypointLabel
];

/** @deprecated  do not use this property within library this should be used for annotation-region mapping only
 */
export type AnnotationMeta = VisionReviewAnnotation<VisionAnnotationDataType>;

export enum AnnotatorRegionType {
  PointRegion = 'point',
  PolygonRegion = 'polygon',
  BoxRegion = 'box',
  LineRegion = 'line',
}

export type AnnotatorBaseRegion = Omit<
  ReactImageAnnotateBaseRegion,
  'status' | 'source' | 'tags'
> & {
  /** @deprecated library specific property - should not be utilized anywhere but conversion functions */
  annotationMeta: AnnotationMeta;
  status: Status;
  annotationType: CDFAnnotationTypeEnum;
  annotationLabelOrText: AnnotatorAnnotationLabelOrText;
  tags: AnnotatorRegionTags | String[];
};

export type AnnotatorBoxRegion = AnnotatorBaseRegion & {
  type: AnnotatorRegionType.BoxRegion;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type AnnotatorPointRegion = AnnotatorBaseRegion & {
  type: AnnotatorRegionType.PointRegion;
  x: number;
  y: number;
  parentAnnotationId: number;
  /** @deprecated  */
  keypointOrder: AnnotatorKeypointOrder;
  keypointLabel: string;
  keypointConfidence: number | undefined;
};

export type AnnotatorPolygonRegion = AnnotatorBaseRegion & {
  type: AnnotatorRegionType.PolygonRegion;
  open?: boolean;
  points: Array<[number, number]>;
};

export type AnnotatorLineRegion = AnnotatorBaseRegion & {
  type: AnnotatorRegionType.LineRegion;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type AnnotatorRegion =
  | AnnotatorBoxRegion
  | AnnotatorPointRegion
  | AnnotatorPolygonRegion
  | AnnotatorLineRegion;

export function isAnnotatorBoxRegion(
  region: AnnotatorRegion
): region is AnnotatorBoxRegion {
  return region.type === AnnotatorRegionType.BoxRegion;
}

export function isAnnotatorPolygonRegion(
  region: AnnotatorRegion
): region is AnnotatorPolygonRegion {
  return region.type === AnnotatorRegionType.PolygonRegion;
}

export function isAnnotatorPointRegion(
  region: AnnotatorRegion
): region is AnnotatorPointRegion {
  return region.type === AnnotatorRegionType.PointRegion;
}

export function isAnnotatorLineRegion(
  region: AnnotatorRegion
): region is AnnotatorLineRegion {
  return region.type === AnnotatorRegionType.LineRegion;
}
