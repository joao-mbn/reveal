import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';

import { DEFAULT_THRESHOLDS } from '@vision/modules/Common/Components/BulkEdit/Annotation/AnnotationStatusPanel';
import { makeSelectAnnotationsForFileIds } from '@vision/modules/Common/store/annotation/selectors';
import { CellRenderer } from '@vision/modules/Common/types';
import {
  filterAnnotationIdsByAnnotationStatus,
  filterAnnotationIdsByConfidence,
} from '@vision/modules/Common/Utils/AnnotationUtils/AnnotationUtils';
import { RootState } from '@vision/store/rootReducer';

import { Body } from '@cognite/cogs.js';

import { createTag } from './AnnotationStatusRenderer';

export function FilteredAnnotationStatusRenderer({
  rowData: { id, annotationThresholds },
}: CellRenderer) {
  const selectAnnotationsForFileIds = useMemo(
    makeSelectAnnotationsForFileIds,
    []
  );
  const annotationsMap = useSelector(({ annotationReducer }: RootState) =>
    selectAnnotationsForFileIds(annotationReducer, [id])
  );

  const [rejectedThreshold, acceptedThreshold] = annotationThresholds || [
    DEFAULT_THRESHOLDS[0],
    DEFAULT_THRESHOLDS[1],
  ];

  // Get annotation ids filtered by confidence values
  const rejectedAnnotationIdsFromConfidence: number[] = [];
  const acceptedAnnotationIdsFromConfidence: number[] = [];
  const unhandledAnnotationIdsFromConfidence: number[] = [];
  Object.entries(annotationsMap).forEach(([_, annotations]) => {
    const annotationIdsByStatus = filterAnnotationIdsByConfidence(
      annotations,
      rejectedThreshold,
      acceptedThreshold
    );
    rejectedAnnotationIdsFromConfidence.push(
      ...annotationIdsByStatus.rejectedAnnotationIds
    );
    acceptedAnnotationIdsFromConfidence.push(
      ...annotationIdsByStatus.acceptedAnnotationIds
    );
    unhandledAnnotationIdsFromConfidence.push(
      ...annotationIdsByStatus.unhandledAnnotationIds
    );
  });

  // Get annotation ids filtered by annotation status
  const rejectedAnnotationIdsFromStatus: number[] = [];
  const acceptedAnnotationIdsFromStatus: number[] = [];
  const unhandledAnnotationIdsFromStatus: number[] = [];
  Object.entries(annotationsMap).forEach(([_, annotations]) => {
    const annotationIdsByStatus =
      filterAnnotationIdsByAnnotationStatus(annotations);
    rejectedAnnotationIdsFromStatus.push(
      ...annotationIdsByStatus.rejectedAnnotationIds
    );
    acceptedAnnotationIdsFromStatus.push(
      ...annotationIdsByStatus.acceptedAnnotationIds
    );
    unhandledAnnotationIdsFromStatus.push(
      ...annotationIdsByStatus.unhandledAnnotationIds
    );
  });

  // If the status counts are the same, nothing has changed => default color
  // Otherwise, the status has changed => blue color
  const getTagColor = (arr1: number[], arr2: number[]) => {
    return arr1.length === arr2.length ? 'default' : 'blue';
  };

  const tags = (
    <CellContainer>
      {!!unhandledAnnotationIdsFromConfidence.length &&
        createTag(
          'Unhandled',
          unhandledAnnotationIdsFromConfidence.length,
          getTagColor(
            unhandledAnnotationIdsFromConfidence,
            unhandledAnnotationIdsFromStatus
          )
        )}
      {!!rejectedAnnotationIdsFromConfidence.length &&
        createTag(
          'Rejected',
          rejectedAnnotationIdsFromConfidence.length,
          getTagColor(
            rejectedAnnotationIdsFromConfidence,
            rejectedAnnotationIdsFromStatus
          )
        )}
      {!!acceptedAnnotationIdsFromConfidence.length &&
        createTag(
          'Accepted',
          acceptedAnnotationIdsFromConfidence.length,
          getTagColor(
            acceptedAnnotationIdsFromConfidence,
            acceptedAnnotationIdsFromStatus
          )
        )}
    </CellContainer>
  );
  return rejectedAnnotationIdsFromConfidence.length > 0 ||
    acceptedAnnotationIdsFromConfidence.length > 0 ||
    unhandledAnnotationIdsFromConfidence.length > 0 ? (
    tags
  ) : (
    <Body level={3}>No annotations</Body>
  );
}

const CellContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: 2px;
  column-gap: 2px;
`;