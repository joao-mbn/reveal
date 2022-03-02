import { createAsyncThunk, unwrapResult } from '@reduxjs/toolkit';
import { VisionAsset } from 'src/modules/Common/store/files/types';
import { ThunkConfig } from 'src/store/rootReducer';
import {
  AnnotationJob,
  VisionAPIType,
} from 'src/api/vision/detectionModels/types';
import {
  enforceRegionValidity,
  getUnsavedAnnotation,
} from 'src/api/annotation/utils';
import { UnsavedAnnotation } from 'src/api/annotation/types';
import { SaveAnnotations } from 'src/store/thunks/Annotation/SaveAnnotations';
import {
  AnnotationStatus,
  AnnotationUtils,
  VisionAnnotation,
} from 'src/utils/AnnotationUtils';
import { fetchAssets } from 'src/store/thunks/fetchAssets';
import { fileProcessUpdate } from 'src/store/commonActions';
import { RetrieveAnnotations } from 'src/store/thunks/Annotation/RetrieveAnnotations';
import { ToastUtils } from 'src/utils/ToastUtils';

export const AnnotationDetectionJobUpdate = createAsyncThunk<
  VisionAnnotation[],
  {
    job: AnnotationJob;
    fileIds: number[];
    modelType: VisionAPIType;
  },
  ThunkConfig
>(
  'AnnotationDetectionJobUpdate',
  async ({ job, fileIds, modelType }, { dispatch, getState }) => {
    let savedVisionAnnotation: VisionAnnotation[] = [];

    const jobState = getState().processSlice.jobs;

    const existingJob = jobState.byId[job.jobId];

    if (
      (existingJob && job.status === 'Running') ||
      job.status === 'Completed'
    ) {
      const { completedFileIds = [], failedFileIds = [] } = existingJob;
      let assetIdMap = new Map<number, VisionAsset>();

      // loop failed items (sub jobs) and show error notification for new failed items
      if (job.failedItems && job.failedItems.length) {
        job.failedItems.forEach((failedItem) => {
          if (
            !failedItem.items.every((failedFile) =>
              failedFileIds.includes(failedFile.fileId)
            )
          ) {
            ToastUtils.onFailure(
              `Some files could not be processed: ${failedItem.errorMessage}`
            );
          }
        });
      }

      const newFailedFileIds: number[] =
        job.failedItems
          ?.map((failedJob) =>
            failedJob.items.map((failedFile) => failedFile.fileId)
          )
          .flat() // flatten the array
          .filter((fileId) => !failedFileIds.includes(fileId)) || [];

      // filter out previously completed files
      const newAnnotationJobResults =
        job.items?.filter((item) => !completedFileIds.includes(item.fileId)) ||
        [];

      // fetch assets if tag detection
      if (
        job.type === VisionAPIType.TagDetection &&
        newAnnotationJobResults.length
      ) {
        const jobFilesWithDetectedAnnotations = newAnnotationJobResults.filter(
          (jobItem) => !!jobItem.annotations.length
        );
        if (jobFilesWithDetectedAnnotations.length) {
          const assetRequests = jobFilesWithDetectedAnnotations.map(
            (jobItem) => {
              const assetIds: number[] = [
                ...new Set(
                  jobItem.annotations
                    .map((detectedAnnotation) => detectedAnnotation?.assetIds)
                    .filter((item): item is number[] => !!item)
                    .flat()
                ),
              ];

              return dispatch(
                fetchAssets(
                  assetIds.map((id) => ({
                    id,
                  }))
                )
              );
            }
          );
          const assetResponses = await Promise.all(assetRequests);
          const assetUnwrappedResponses = assetResponses.map((assetRes) =>
            unwrapResult(assetRes)
          );
          const assetMapArr = assetUnwrappedResponses.map(
            (assetUnwrappedResponse) =>
              new Map(assetUnwrappedResponse.map((asset) => [asset.id, asset]))
          );
          assetIdMap = assetMapArr.reduce((acc, current) => {
            return new Map([...acc, ...current]);
          });
        }
      }

      let unsavedAnnotations: UnsavedAnnotation[] = [];

      // save new prediction results as annotations
      newAnnotationJobResults.forEach((annResult) => {
        const { annotations } = annResult;

        if (annotations && annotations.length) {
          const unsavedAnnotationsForFile = annotations
            .map((ann) => {
              if (ann.assetIds && ann.assetIds.length) {
                return ann.assetIds.map((assetId) => {
                  const asset = assetIdMap.get(assetId);
                  return getUnsavedAnnotation(
                    ann.text,
                    job.type,
                    annResult.fileId,
                    'context_api',
                    enforceRegionValidity(ann.region),
                    AnnotationStatus.Unhandled,
                    { confidence: ann.confidence },
                    asset?.id,
                    asset?.externalId
                  );
                });
              }
              return getUnsavedAnnotation(
                ann.text,
                job.type,
                annResult.fileId,
                'context_api',
                enforceRegionValidity(ann.region),
                AnnotationStatus.Unhandled,
                { confidence: ann.confidence }
              );
            })
            .filter((item): item is UnsavedAnnotation[] => !!item)
            .flat();
          unsavedAnnotations = unsavedAnnotations.concat(
            unsavedAnnotationsForFile
          );
        }
      });

      if (unsavedAnnotations.length) {
        const savedAnnotationResponse = await dispatch(
          SaveAnnotations(unsavedAnnotations)
        );
        const savedAnnotations = unwrapResult(savedAnnotationResponse);
        savedVisionAnnotation =
          AnnotationUtils.convertToVisionAnnotations(savedAnnotations);
      }

      dispatch(
        fileProcessUpdate({
          modelType,
          fileIds,
          job,
          completedFileIds: [
            ...completedFileIds,
            ...newAnnotationJobResults.map((item) => item.fileId),
          ],
          failedFileIds: [...failedFileIds, ...newFailedFileIds],
        })
      );

      if (newAnnotationJobResults.length) {
        await dispatch(
          RetrieveAnnotations({
            fileIds: newAnnotationJobResults.map((item) => item.fileId),
            clearCache: false,
          })
        );
      }
    }
    return savedVisionAnnotation;
  }
);
