import React, { ReactText, useCallback, useMemo } from 'react';
import { batch, useSelector } from 'react-redux';

import styled from 'styled-components';

import { Detail, Icon, Tooltip } from '@cognite/cogs.js';
import { FileInfo } from '@cognite/sdk';

import {
  CDFAnnotationTypeEnum,
  ImageKeypointCollection,
  Status,
} from '../../../../api/annotation/types';
import {
  annotationCategoryTitle,
  annotationObjectsName,
  annotationRowComponent,
  annotationTypeFromCategoryTitle,
} from '../../../../constants/annotationDetailPanel';
import { useThunkDispatch } from '../../../../store';
import { deselectAllSelectionsReviewPage } from '../../../../store/commonActions';
import { RootState } from '../../../../store/rootReducer';
import { AnnotationStatusChange } from '../../../../store/thunks/Annotation/AnnotationStatusChange';
import { DeleteAnnotationsAndHandleLinkedAssetsOfFile } from '../../../../store/thunks/Review/DeleteAnnotationsAndHandleLinkedAssetsOfFile';
import { VisionAnnotationDataType } from '../../../Common/types';
import {
  isImageAssetLinkData,
  isImageClassificationData,
  isImageExtractedTextData,
  isImageKeypointCollectionData,
  isImageObjectDetectionData,
} from '../../../Common/types/typeGuards';
import { selectTempKeypointCollection } from '../../store/annotatorWrapper/selectors';
import {
  deleteTempKeypointCollection,
  keypointSelectStatusChange,
  selectCollection,
  setCollectionStatus,
  toggleCollectionVisibility,
} from '../../store/annotatorWrapper/slice';
import { selectVisionReviewAnnotationsForFile } from '../../store/review/selectors';
import {
  selectAnnotation,
  toggleAnnotationVisibility,
} from '../../store/review/slice';
import { convertTempKeypointCollectionToVisionReviewImageKeypointCollection } from '../../store/review/utils';
import { VisionReviewAnnotation } from '../../types';

import { AnnotationDetailPanelHotKeys } from './AnnotationDetailPanelHotKeys';
import { VirtualizedReviewAnnotations } from './components';
import { selectAnnotationCategory } from './store/slice';
import {
  AnnotationDetailPanelAnnotationType,
  AnnotationDetailPanelRowDataBase,
} from './types';
import { generateNodeTree } from './utils/generateNodeTree';

export const AnnotationDetailPanel = ({
  file,
  showEditOptions,
}: {
  file: FileInfo;
  showEditOptions: boolean;
}) => {
  const dispatch = useThunkDispatch();
  const annotationCategoryState = useSelector(
    (state: RootState) =>
      state.annotationDetailPanelReducer.annotationCategories
  );

  // when set virtualized tree component will use this to automatically scroll to position
  const scrollId = useSelector(
    (rootState: RootState) => rootState.reviewSlice.scrollToId
  );

  const visibleReviewAnnotations: VisionReviewAnnotation<VisionAnnotationDataType>[] =
    useSelector((rootState: RootState) =>
      selectVisionReviewAnnotationsForFile(rootState, file.id)
    );

  const tempKeypointCollection = useSelector(
    ({ annotatorWrapperReducer, annotationReducer }: RootState) =>
      selectTempKeypointCollection(annotatorWrapperReducer, {
        currentFileId: file.id,
        annotationColorMap: annotationReducer.annotationColorMap,
      })
  );

  const convertedCurrentKeypointCollection: VisionReviewAnnotation<ImageKeypointCollection> | null =
    convertTempKeypointCollectionToVisionReviewImageKeypointCollection(
      tempKeypointCollection
    );

  const imagesAssetLinkReviewAnnotations = useMemo(() => {
    return visibleReviewAnnotations.filter((reviewAnnotation) =>
      isImageAssetLinkData(reviewAnnotation.annotation)
    );
  }, [visibleReviewAnnotations]);

  const imagesObjectReviewAnnotations = useMemo(() => {
    return visibleReviewAnnotations.filter((reviewAnnotation) =>
      isImageObjectDetectionData(reviewAnnotation.annotation)
    );
  }, [visibleReviewAnnotations]);

  const imagesKeypointCollectionReviewAnnotations = useMemo(() => {
    const savedKeypointAnnotations = visibleReviewAnnotations.filter(
      (reviewAnnotation) =>
        isImageKeypointCollectionData(reviewAnnotation.annotation)
    );
    if (convertedCurrentKeypointCollection) {
      return savedKeypointAnnotations.concat([
        {
          ...convertedCurrentKeypointCollection,
        },
      ]);
    }
    return savedKeypointAnnotations;
  }, [visibleReviewAnnotations, tempKeypointCollection]);

  const imagesTextRegionReviewAnnotations = useMemo(() => {
    return visibleReviewAnnotations.filter((reviewAnnotation) =>
      isImageExtractedTextData(reviewAnnotation.annotation)
    );
  }, [visibleReviewAnnotations]);

  const imagesClassificationReviewAnnotations = useMemo(() => {
    return visibleReviewAnnotations.filter((reviewAnnotation) =>
      isImageClassificationData(reviewAnnotation.annotation)
    );
  }, [visibleReviewAnnotations]);

  const [mode, isKeypoint] = useMemo(() => {
    const selectedAnnotation = visibleReviewAnnotations.find(
      (annotation) => annotation.selected
    );

    if (selectedAnnotation) {
      return [
        selectedAnnotation.annotation.annotationType,
        selectedAnnotation.annotation.annotationType ===
          CDFAnnotationTypeEnum.ImagesKeypointCollection,
      ];
    }
    return [0, false];
  }, [visibleReviewAnnotations]);

  const handleVisibility = useCallback(
    (id: ReactText) => {
      if (id === tempKeypointCollection?.id) {
        // when creating keypoint collections
        dispatch(toggleCollectionVisibility(id));
      } else {
        dispatch(
          toggleAnnotationVisibility({
            annotationId: +id,
          })
        );
      }
    },
    [tempKeypointCollection?.id]
  );

  const handleDelete = useCallback(
    (id: number) => {
      if (id === tempKeypointCollection?.id) {
        // when creating keypoint collections
        dispatch(deleteTempKeypointCollection());
      } else {
        dispatch(
          DeleteAnnotationsAndHandleLinkedAssetsOfFile({
            annotationId: { id },
            showWarnings: true,
          })
        );
      }
    },
    [tempKeypointCollection?.id]
  );

  const handleApprovalState = useCallback(
    async (id: number, status: Status) => {
      if (id === tempKeypointCollection?.id) {
        // when creating keypoint collections
        dispatch(setCollectionStatus({ id, status }));
      } else {
        await dispatch(AnnotationStatusChange({ id, status }));
      }
    },
    [tempKeypointCollection?.id]
  );

  const handleOnSelect = useCallback(
    (id: ReactText, nextState: boolean) => {
      batch(() => {
        dispatch(deselectAllSelectionsReviewPage());
        if (id === tempKeypointCollection?.id) {
          // when creating keypoint collections
          if (nextState) {
            dispatch(selectCollection(id));
          }
        } else if (
          Object.values(annotationCategoryTitle).includes(id as string)
        ) {
          dispatch(
            selectAnnotationCategory({
              annotationType: annotationTypeFromCategoryTitle[
                id
              ] as CDFAnnotationTypeEnum,
              selected: nextState,
            })
          );
        } else if (nextState) {
          dispatch(selectAnnotation(+id));
        }
      });
    },
    [tempKeypointCollection?.id]
  );

  const handleKeypointSelect = useCallback((id: string) => {
    dispatch(keypointSelectStatusChange(id));
  }, []);

  const ReviewCallbacks = useMemo(
    () => ({
      onDelete: handleDelete,
      onVisibilityChange: handleVisibility,
      onApproveStateChange: handleApprovalState,
      onSelect: handleOnSelect,
      onKeypointSelect: handleKeypointSelect,
    }),
    [
      handleDelete,
      handleVisibility,
      handleApprovalState,
      handleOnSelect,
      handleKeypointSelect,
    ]
  );

  const getReviewAnnotations = (annotationType: CDFAnnotationTypeEnum) => {
    switch (annotationType) {
      case CDFAnnotationTypeEnum.ImagesObjectDetection:
        return imagesObjectReviewAnnotations;
      case CDFAnnotationTypeEnum.ImagesTextRegion:
        return imagesTextRegionReviewAnnotations;
      case CDFAnnotationTypeEnum.ImagesAssetLink:
        return imagesAssetLinkReviewAnnotations;
      case CDFAnnotationTypeEnum.ImagesKeypointCollection:
        return imagesKeypointCollectionReviewAnnotations;
      case CDFAnnotationTypeEnum.ImagesClassification:
        return imagesClassificationReviewAnnotations;
      default:
        throw new Error(`Got unknown annotation type ${annotationType}`);
    }
  };

  const categoryRowDataList: AnnotationDetailPanelRowDataBase<AnnotationDetailPanelAnnotationType>[] =
    useMemo(() => {
      // items in common section will be passed down to child items
      const rowData = Object.values(CDFAnnotationTypeEnum).map(
        (annotationType) => {
          return {
            title: annotationCategoryTitle[annotationType],
            selected: !!annotationCategoryState[annotationType]?.selected,
            emptyPlaceholder: `No ${annotationObjectsName[annotationType]} detected or manually added`,
            callbacks: ReviewCallbacks,
            common: {
              reviewAnnotations: getReviewAnnotations(annotationType),
              annotationType,
              component: annotationRowComponent[annotationType] as React.FC,
              tempKeypointCollection,
            },
          };
        }
      );

      // filters categories of empty annotations
      return rowData
        .filter((category) => !!category.common.reviewAnnotations.length)
        .map((category) => ({
          ...category,
          common: { ...category.common, file }, // add file to common props
        }));
    }, [
      imagesAssetLinkReviewAnnotations,
      imagesTextRegionReviewAnnotations,
      imagesObjectReviewAnnotations,
      mode,
      isKeypoint,
      imagesKeypointCollectionReviewAnnotations,
      annotationCategoryState,
    ]);

  const rootNodeArr = useMemo(
    () => categoryRowDataList.map((category) => generateNodeTree(category)),
    [categoryRowDataList]
  );

  return (
    <Container showInfoLabel={showEditOptions}>
      {showEditOptions && (
        <StyledDetail>
          {'Approve and reject detected annotations '}
          <Tooltip
            wrapped
            content={`
                Pressing True or False will set the status of the suggested annotation. Pressing
                False will not delete the annotation.`}
          >
            <ToolTipIcon type="HelpFilled" />
          </Tooltip>
        </StyledDetail>
      )}
      <AnnotationDetailPanelHotKeys
        nodeTree={rootNodeArr}
        scrollId={scrollId}
        file={file}
      >
        <TableContainer>
          <VirtualizedReviewAnnotations
            rootNodeArr={rootNodeArr}
            scrollId={scrollId}
            showEditOptions={showEditOptions}
          />
        </TableContainer>
      </AnnotationDetailPanelHotKeys>
    </Container>
  );
};
interface showInfoLabel {
  showInfoLabel: boolean;
}
const Container = styled.div<showInfoLabel>`
  height: 100%;
  width: 100%;
  padding: 15px 0;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: ${(props) =>
    props.showInfoLabel ? `30px calc(100% - 30px)` : '100%'};
  grid-row-gap: 10px;
`;

const TableContainer = styled.div``;

const StyledDetail = styled(Detail)`
  color: #595959;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 10px;
`;
const ToolTipIcon = styled(Icon)`
  color: #bfbfbf;
  align-self: center;
  display: flex;
`;
