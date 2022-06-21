import isFinite from 'lodash-es/isFinite';
import { UnsavedVisionAnnotation } from 'src/modules/Common/types';
import {
  CDFAnnotationTypeEnum,
  ImageKeypointCollection,
  Status,
} from 'src/api/annotation/types';
import {
  TempKeypointCollection,
  VisionReviewAnnotation,
} from 'src/modules/Review/types';

/**
 * Returns UnsavedVisionImageKeypointCollection with confidence set to 1 for annotation itself and each keypoint,
 * Status is set to Approved
 * @param collection
 */
export const convertTempKeypointCollectionToUnsavedVisionImageKeypointCollection =
  (
    collection: TempKeypointCollection | null
  ): UnsavedVisionAnnotation<ImageKeypointCollection> | null => {
    if (
      !collection ||
      !collection.annotatedResourceId ||
      !isFinite(collection.annotatedResourceId) ||
      !collection.data ||
      !collection.data.label ||
      !collection.data.keypoints ||
      !collection.data.keypoints.length
    ) {
      return null;
    }
    const keypoints = collection.data.keypoints.reduce((acc, next) => {
      acc[next.keypoint.label] = {
        point: next.keypoint.point,
        confidence: 1, // since it is manually created
      };
      return acc;
    }, {} as any);
    return {
      annotationType: CDFAnnotationTypeEnum.ImagesKeypointCollection,
      status: Status.Approved, // since all manually created annotation are considered "approved" by default
      annotatedResourceId: collection.annotatedResourceId,
      data: {
        ...collection.data,
        confidence: 1, // since it is manually created
        keypoints,
      },
    };
  };
// todo: add test cases [VIS-877]
export const convertTempKeypointCollectionToVisionReviewImageKeypointCollection =
  (
    tempKeypointCollection: TempKeypointCollection | null
  ): VisionReviewAnnotation<ImageKeypointCollection> | null => {
    if (!tempKeypointCollection) {
      return null;
    }

    const {
      id,
      annotatedResourceId,
      data: { keypoints, label } = {},
      color,
    } = tempKeypointCollection;
    return {
      annotation: {
        id,
        annotatedResourceId,
        label,
        keypoints,
        createdTime: 0,
        lastUpdatedTime: 0,
        status: Status.Approved,
        annotationType: CDFAnnotationTypeEnum.ImagesKeypointCollection,
      },
      selected: true,
      show: true,
      color,
    } as VisionReviewAnnotation<ImageKeypointCollection>;
  };
