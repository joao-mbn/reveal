import { useMemo } from 'react';

import { ExtendedAnnotation } from '@data-exploration-lib/core';

import { OnAddContainerReferences } from '../IndustryCanvasPage';
import {
  CanvasAnnotation,
  CommentAnnotation,
  IndustryCanvasContainerConfig,
} from '../types';

import useCanvasAnnotationTooltips from './useCanvasAnnotationTooltips';
import useCommentTooltips from './useCommentTooltips';
import useIndustryCanvasAssetTooltips from './useIndustryCanvasAssetTooltips';
import useIndustryCanvasContainerTooltips from './useIndustryCanvasContainerTooltips';
import useIndustryCanvasFileLinkTooltips from './useIndustryCanvasFileLinkTooltips';
import { UseManagedStateReturnType } from './useManagedState';
import { OnUpdateAnnotationStyleByType } from './useManagedTools';
import { UseResourceSelectorActionsReturnType } from './useResourceSelectorActions';
import { OnUpdateTooltipsOptions, TooltipsOptions } from './useTooltipsOptions';

export type UseTooltipsParams = {
  selectedContainer: IndustryCanvasContainerConfig | undefined;
  containers: IndustryCanvasContainerConfig[];
  clickedContainerAnnotation: ExtendedAnnotation | undefined;
  selectedCanvasAnnotation: CanvasAnnotation | undefined;
  tooltipsOptions: TooltipsOptions;
  onUpdateTooltipsOptions: OnUpdateTooltipsOptions;
  onAddContainerReferences: OnAddContainerReferences;
  onAddSummarizationSticky: (
    container: IndustryCanvasContainerConfig,
    text: string,
    isMultiPageDocument: boolean
  ) => void;
  updateContainerById: UseManagedStateReturnType['updateContainerById'];
  removeContainerById: UseManagedStateReturnType['removeContainerById'];
  onDeleteSelectedCanvasAnnotation: () => void;
  onUpdateAnnotationStyleByType: OnUpdateAnnotationStyleByType;
  onResourceSelectorOpen: UseResourceSelectorActionsReturnType['onResourceSelectorOpen'];
  commentAnnotations: CommentAnnotation[];
};

const useIndustryCanvasTooltips = ({
  containers,
  clickedContainerAnnotation,
  selectedCanvasAnnotation,
  onAddContainerReferences,
  onAddSummarizationSticky,
  onDeleteSelectedCanvasAnnotation,
  tooltipsOptions,
  onUpdateTooltipsOptions,
  selectedContainer,
  updateContainerById,
  removeContainerById,
  onUpdateAnnotationStyleByType,
  onResourceSelectorOpen,
  commentAnnotations,
}: UseTooltipsParams) => {
  const assetTooltips = useIndustryCanvasAssetTooltips(
    clickedContainerAnnotation,
    onAddContainerReferences
  );
  const fileLinkTooltips = useIndustryCanvasFileLinkTooltips({
    clickedContainerAnnotation,
    onAddContainerReferences,
  });
  const canvasAnnotationTooltips = useCanvasAnnotationTooltips({
    selectedCanvasAnnotation,
    onDeleteSelectedCanvasAnnotation,
    onUpdateAnnotationStyleByType,
  });
  const containerTooltips = useIndustryCanvasContainerTooltips({
    selectedContainer,
    containers,
    tooltipsOptions,
    onUpdateTooltipsOptions,
    onAddSummarizationSticky,
    updateContainerById,
    removeContainerById,
    onResourceSelectorOpen,
  });
  const commentTooltips = useCommentTooltips({
    commentAnnotations,
  });

  return useMemo(() => {
    return [
      ...containerTooltips,
      ...assetTooltips,
      ...canvasAnnotationTooltips,
      ...fileLinkTooltips,
      ...commentTooltips,
    ];
  }, [
    assetTooltips,
    canvasAnnotationTooltips,
    fileLinkTooltips,
    containerTooltips,
    commentTooltips,
  ]);
};

export default useIndustryCanvasTooltips;
