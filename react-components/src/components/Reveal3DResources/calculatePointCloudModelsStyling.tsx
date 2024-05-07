/*!
 * Copyright 2024 Cognite AS
 */
import {
  DefaultPointCloudAppearance,
  type PointCloudAppearance,
  type NodeAppearance
} from '@cognite/reveal';
import {
  type DefaultResourceStyling,
  type PointCloudModelOptions,
  type AssetStylingGroup,
  StyledPointCloudModelAddOptions
} from './types';
import { isSame3dModel } from '../../utilities/isSameModel';
import { EMPTY_ARRAY } from '../../utilities/constants';
import { type AnnotationId, type PointCloudAnnotationModel } from '../CacheProvider/types';
import { type PointCloudAnnotationCache } from '../CacheProvider/PointCloudAnnotationCache';

export type PointCloudAnnotationIdStylingGroup = {
  annotationIds: number[];
  style: PointCloudAppearance;
};

type PointCloudAddOptionsWithStyleGroups = {
  addOptions: PointCloudModelOptions;
  styleGroups: PointCloudAnnotationIdStylingGroup[];
};

export type AnnotationModelDataResult = {
  model: PointCloudModelOptions;
  annotationModel: PointCloudAnnotationModel[];
};

export const calculatePointCloudStyling = async (
  models: PointCloudModelOptions[],
  instanceGroups: AssetStylingGroup[],
  defaultResourceStyling: DefaultResourceStyling | undefined,
  pointCloudAnnotationCache: PointCloudAnnotationCache
): Promise<StyledPointCloudModelAddOptions[]> => {
  const styledPointCloudModels = await calculateMappedPointCloudStyling(
    models,
    defaultResourceStyling?.pointcloud?.mapped,
    pointCloudAnnotationCache
  );
  const modelInstanceStyleGroups = await calculateInstanceStyling(
    models,
    instanceGroups,
    pointCloudAnnotationCache
  );

  const combinedStyledPointCloudModels = groupStyleGroupByModel(
    [...styledPointCloudModels, ...modelInstanceStyleGroups],
    defaultResourceStyling?.pointcloud?.default
  );
  return combinedStyledPointCloudModels;
};

async function calculateInstanceStyling(
  models: PointCloudModelOptions[],
  instanceGroups: AssetStylingGroup[],
  pointCloudAnnotationCache: PointCloudAnnotationCache
): Promise<PointCloudAddOptionsWithStyleGroups[]> {
  const pointCloudAnnotationMappings = await getPointCloudAnnotationMappingsForModels(
    models,
    pointCloudAnnotationCache
  );

  const styledModels = pointCloudAnnotationMappings?.map((annotationMappings) => {
    return calculateAnnotationMappingModelStyling(instanceGroups, annotationMappings);
  });

  return styledModels;
}

function calculateAnnotationMappingModelStyling(
  instanceGroups: AssetStylingGroup[],
  annotationMapping: AnnotationModelDataResult
): PointCloudAddOptionsWithStyleGroups {
  const styleGroups = instanceGroups
    .map((group) => {
      return getMappedStyleGroupFromAssetIds(annotationMapping, group);
    })
    .filter(
      (styleGroup): styleGroup is PointCloudAnnotationIdStylingGroup => styleGroup !== undefined
    );

  return { addOptions: annotationMapping.model, styleGroups };
}

function getMappedStyleGroupFromAssetIds(
  annotationMapping: AnnotationModelDataResult,
  instanceGroup: AssetStylingGroup
): PointCloudAnnotationIdStylingGroup | undefined {
  const uniqueAnnotationIds = new Set<number>();
  const assetIdsSet = new Set(instanceGroup.assetIds.map((id) => id));

  const matchedAnnotationModels = annotationMapping.annotationModel.filter((annotation) => {
    const assetRef = annotation.data.assetRef;
    const isAssetIdInMapping = assetIdsSet.has(assetRef?.id ?? Number(assetRef?.externalId));
    if (isAssetIdInMapping && !uniqueAnnotationIds.has(annotation.id)) {
      uniqueAnnotationIds.add(annotation.id);
      return true;
    }
    return false;
  });

  return matchedAnnotationModels.length > 0
    ? {
        annotationIds: matchedAnnotationModels.map((annotationModel) => annotationModel.id),
        style: instanceGroup.style.pointcloud ?? {}
      }
    : undefined;
}

async function calculateMappedPointCloudStyling(
  models: PointCloudModelOptions[],
  defaultMappedNodeAppearance: NodeAppearance | undefined,
  pointCloudAnnotationCache: PointCloudAnnotationCache
): Promise<PointCloudAddOptionsWithStyleGroups[]> {
  const modelsWithStyledMapped = getMappedPointCloudModelsOptions();

  const pointCloudStyledModelAnnotationIds = await getPointCloudAnnotationIdsForModels(
    modelsWithStyledMapped,
    pointCloudAnnotationCache
  );

  const modelsMappedAnnotationIdStyleGroups = pointCloudStyledModelAnnotationIds.map(
    (pointCloudAnnotationCollection) => {
      const modelStyle =
        pointCloudAnnotationCollection.model.styling?.mapped ?? defaultMappedNodeAppearance;

      const styleGroups: PointCloudAnnotationIdStylingGroup[] =
        modelStyle !== undefined
          ? [getMappedStyleGroupFromAnnotationIds([pointCloudAnnotationCollection], modelStyle)]
          : EMPTY_ARRAY;
      return { addOptions: pointCloudAnnotationCollection.model, styleGroups };
    }
  );

  return modelsMappedAnnotationIdStyleGroups;

  function getMappedPointCloudModelsOptions(): PointCloudModelOptions[] {
    if (defaultMappedNodeAppearance !== undefined) {
      return models;
    }

    return models.filter((model) => model.styling?.mapped !== undefined);
  }
}

function getMappedStyleGroupFromAnnotationIds(
  annotationData: Array<{
    model: PointCloudModelOptions;
    annotationIds: number[];
  }>,
  nodeAppearance: NodeAppearance
): PointCloudAnnotationIdStylingGroup {
  const annotationIds = annotationData.flatMap((data) => {
    return data.annotationIds;
  });

  return { annotationIds, style: nodeAppearance };
}

function groupStyleGroupByModel(
  styleGroup: PointCloudAddOptionsWithStyleGroups[],
  defaultPointCloudAppearance: PointCloudAppearance | undefined
): StyledPointCloudModelAddOptions[] {
  return styleGroup.reduce<StyledPointCloudModelAddOptions[]>((accumulatedGroups, currentGroup) => {
    const existingGroupWithModel = accumulatedGroups.find((group) =>
      isSame3dModel(group.addOptions, currentGroup.addOptions)
    );
    if (existingGroupWithModel !== undefined) {
      existingGroupWithModel.styleGroups.push(...currentGroup.styleGroups);
    } else {
      accumulatedGroups.push({
        addOptions: currentGroup.addOptions,
        styleGroups: [...currentGroup.styleGroups],
        defaultStyle:
          currentGroup.addOptions.styling?.default ??
          defaultPointCloudAppearance ??
          DefaultPointCloudAppearance
      });
    }
    return accumulatedGroups;
  }, []);
}

async function getPointCloudAnnotationIdsForModels(
  models: PointCloudModelOptions[],
  pointCloudAnnotationCache: PointCloudAnnotationCache
): Promise<
  Array<{
    model: PointCloudModelOptions;
    annotationIds: AnnotationId[];
  }>
> {
  return await Promise.all(
    models.map(async (model) => {
      const annotationModel = await pointCloudAnnotationCache.getPointCloudAnnotationsForModel(
        model.modelId,
        model.revisionId
      );
      const annotationIds = annotationModel.map((annotation) => {
        return annotation.id;
      });
      return { model, annotationIds };
    })
  );
}

async function getPointCloudAnnotationMappingsForModels(
  models: PointCloudModelOptions[],
  pointCloudAnnotationCache: PointCloudAnnotationCache
): Promise<AnnotationModelDataResult[]> {
  return await Promise.all(
    models.map(async (model) => {
      const annotationModel = await pointCloudAnnotationCache.getPointCloudAnnotationsForModel(
        model.modelId,
        model.revisionId
      );
      return {
        model,
        annotationModel
      };
    })
  );
}
