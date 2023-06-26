import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { unwrapResult } from '@reduxjs/toolkit';
import { ImageAssetLink, Status } from '@vision/api/annotation/types';
import { VisionAsset } from '@vision/modules/Common/store/files/types';
import { VisionAnnotationDataType } from '@vision/modules/Common/types';
import { isImageAssetLinkData } from '@vision/modules/Common/types/typeGuards';
import { VisionReviewAnnotation } from '@vision/modules/Review/types';
import { AppDispatch } from '@vision/store';
import { fetchAssets } from '@vision/store/thunks/fetchAssets';

import { FileInfo } from '@cognite/sdk';

export enum AssetWarnTypes {
  NoWarning,
  ApprovedAnnotationAssetNotLinkedToFile,
  RejectedAnnotationAssetLinkedToFile,
}

const ANNOTATION_STATUS_ERROR_VISIBILITY_DELAY = 1000;

const useAssetLinkWarning = (
  reviewAnnotation: VisionReviewAnnotation<VisionAnnotationDataType>,
  file: FileInfo,
  allReviwAnnotations: VisionReviewAnnotation<VisionAnnotationDataType>[]
): AssetWarnTypes => {
  const [assetWarnType, setAssetWarnType] = useState<AssetWarnTypes>(
    AssetWarnTypes.NoWarning
  );
  const [asset, setAsset] = useState<VisionAsset | null>(null);
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const approvedAnnotationNotLinkedToFileTimer = useRef<any>(null);
  const rejectedAnnotationLinkedToFileTimer = useRef<any>(null);

  useEffect(() => {
    const fetchAndSetAsset = async (annotation: ImageAssetLink) => {
      const assetPayload = [{ id: annotation.assetRef.id }];

      try {
        const assetResponse = await dispatch(fetchAssets(assetPayload));
        const assets = unwrapResult(assetResponse);
        if (assets && assets.length) {
          setAsset(assets[0]);
        }
      } catch (e) {
        console.error('Error occurred while fetching asset!', e);
      }
    };

    if (isImageAssetLinkData(reviewAnnotation.annotation)) {
      fetchAndSetAsset(reviewAnnotation.annotation);
    } else {
      setAsset(null);
    }
  }, [reviewAnnotation.annotation]);

  useEffect(() => {
    // clear timers and cancel pending errors, since not doing it can make app to show error erroneously
    if (approvedAnnotationNotLinkedToFileTimer.current) {
      clearTimeout(approvedAnnotationNotLinkedToFileTimer.current);
      approvedAnnotationNotLinkedToFileTimer.current = null;
    }
    if (rejectedAnnotationLinkedToFileTimer.current) {
      clearTimeout(rejectedAnnotationLinkedToFileTimer.current);
      rejectedAnnotationLinkedToFileTimer.current = null;
    }

    if (asset) {
      if (
        reviewAnnotation.annotation.status === Status.Approved &&
        !file.assetIds?.includes(asset.id)
      ) {
        approvedAnnotationNotLinkedToFileTimer.current = setTimeout(() => {
          // timers delay showing error so other processes can be completed before showing error (file update)
          setAssetWarnType(
            AssetWarnTypes.ApprovedAnnotationAssetNotLinkedToFile
          );
        }, ANNOTATION_STATUS_ERROR_VISIBILITY_DELAY);
      } else if (
        reviewAnnotation.annotation.status === Status.Rejected &&
        file.assetIds?.includes(asset.id) &&
        allReviwAnnotations
          .filter(
            (reviewAnn) =>
              reviewAnn.annotation.id !== reviewAnnotation.annotation.id &&
              reviewAnn.annotation.status === Status.Approved
          ) // select other annotations except this one
          .every((tagAnnotation) => !isLinkedToAsset(tagAnnotation, asset)) // every other tag annotation is not approved and linked to the same asset
      ) {
        rejectedAnnotationLinkedToFileTimer.current = setTimeout(() => {
          // timers delay showing error so other processes can be completed before showing error (file update)
          setAssetWarnType(AssetWarnTypes.RejectedAnnotationAssetLinkedToFile);
        }, ANNOTATION_STATUS_ERROR_VISIBILITY_DELAY);
      } else {
        setAssetWarnType(AssetWarnTypes.NoWarning);
      }
    } else {
      setAssetWarnType(AssetWarnTypes.NoWarning);
    }
  }, [reviewAnnotation, file, asset]);

  return assetWarnType;
};

export default useAssetLinkWarning;

const isLinkedToAsset = (
  ann: VisionReviewAnnotation<VisionAnnotationDataType>,
  asset: VisionAsset
): boolean => {
  if (isImageAssetLinkData(ann.annotation)) {
    return ann.annotation.assetRef.id === asset.id;
  }
  return false;
};