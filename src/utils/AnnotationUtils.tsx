import { FileInfo } from '@cognite/sdk';
import {
  CogniteAnnotation,
  PendingCogniteAnnotation,
  AnnotationResourceType,
  CURRENT_VERSION,
  AnnotationBoundingBox,
  ANNOTATION_EVENT_TYPE,
} from '@cognite/annotations';
import { PnidResponseEntity } from 'modules/types';

const findSimilarMatches = (
  entities: CogniteAnnotation[],
  box: AnnotationBoundingBox,
  resourceType: AnnotationResourceType,
  resourceExternalId?: string,
  resourceId?: number,
  threshold = 0.3
) => {
  if (
    entities.some((entity) => {
      if (
        (entity.resourceExternalId === resourceExternalId ||
          entity.resourceId === resourceId) &&
        entity.resourceType === resourceType
      ) {
        return isSimilarBoundingBox(entity.box, box, threshold);
      }
      return false;
    })
  ) {
    return true;
  }
  return false;
};

export const createPendingAnnotationsFromJob = async (
  file: FileInfo,
  entities: PnidResponseEntity[],
  jobId: string,
  existingEntities: CogniteAnnotation[]
): Promise<PendingCogniteAnnotation[]> => {
  return entities.reduce((prev, entity) => {
    const activeEntities = existingEntities.filter(
      (el) => el.page === entity.page && el.status !== 'deleted'
    );

    const deletedEntities = existingEntities.filter(
      (el) => el.page === entity.page && el.status === 'deleted'
    );

    entity.items.forEach((item) => {
      const resourceId = item.id;
      const resourceExternalId = item?.externalId;
      const { resourceType } = item;

      // if the same annotation has been "soft" deleted before, do not recreate.
      if (
        resourceType &&
        findSimilarMatches(
          deletedEntities,
          entity.boundingBox,
          resourceType,
          resourceExternalId,
          resourceId
        )
      ) {
        return;
      }
      // if the same annotation already exists, do not recreate.
      if (
        activeEntities.find((anotation) => anotation.resourceId === resourceId)
      ) {
        return;
      }

      prev.push({
        box: entity.boundingBox,
        ...(!file.externalId ? { fileId: file.id } : {}),
        ...(file.externalId ? { fileExternalId: file.externalId } : {}),
        resourceId,
        resourceExternalId,
        resourceType,
        type: ANNOTATION_EVENT_TYPE,
        label: entity.text,
        source: `job:${jobId}`,
        version: CURRENT_VERSION,
        owner: `${jobId}`,
        status: 'unhandled',
        page: entity.page,
      } as PendingCogniteAnnotation);
    });
    return prev;
  }, [] as PendingCogniteAnnotation[]);
};

export const isSimilarBoundingBox = (
  origBox: AnnotationBoundingBox,
  compBox: AnnotationBoundingBox,
  percentDiff = 0.1,
  smallerOnly = false
) => {
  const { xMax, xMin, yMax, yMin } = origBox;
  // check right
  if (
    compBox.xMax <= (smallerOnly ? xMax : xMax * (1 + percentDiff)) &&
    compBox.xMax >= xMax * (1 - percentDiff)
  ) {
    // check bottom
    if (
      compBox.yMax <= (smallerOnly ? yMax : yMax * (1 + percentDiff)) &&
      compBox.yMax >= yMax * (1 - percentDiff)
    ) {
      // check left
      if (
        compBox.xMin >= (smallerOnly ? xMin : xMin * (1 - percentDiff)) &&
        compBox.xMin <= xMin * (1 + percentDiff)
      ) {
        // check top
        if (
          compBox.yMin >= (smallerOnly ? yMin : yMin * (1 - percentDiff)) &&
          compBox.yMin <= yMin * (1 + percentDiff)
        ) {
          return true;
        }
      }
    }
  }
  return false;
};
