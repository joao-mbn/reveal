import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { convertCDFAnnotationV1ToVisionAnnotationBulk } from 'src/api/annotation/bulkConverters';
import { AnnotationState } from 'src/modules/Common/store/annotation/types';
import { RetrieveAnnotations } from 'src/store/thunks/Annotation/RetrieveAnnotations';
import { VisionAnnotationV1 } from 'src/utils/AnnotationUtilsV1/AnnotationUtilsV1';
import { getAnnotatedResourceId } from 'src/modules/Common/Utils/getAnnotatedResourceId/getAnnotatedResourceId';
import { DeleteAnnotations } from 'src/store/thunks/Annotation/DeleteAnnotations';
import { CreateAnnotations } from 'src/store/thunks/Annotation/CreateAnnotations';
import { VisionJobUpdate } from 'src/store/thunks/Process/VisionJobUpdate';
import { UpdateAnnotations } from 'src/store/thunks/Annotation/UpdateAnnotations';
import { clearAnnotationState } from 'src/store/commonActions';
import { DeleteFilesById } from 'src/store/thunks/Files/DeleteFilesById';

export const initialState: AnnotationState = {
  files: {
    byId: {},
  },
  annotations: {
    byId: {},
  },
};

const annotationSlice = createSlice({
  name: 'annotation',
  initialState,
  reducers: {},
  /* eslint-disable no-param-reassign */
  extraReducers: (builder) => {
    builder.addCase(
      RetrieveAnnotations.fulfilled,
      (
        state: AnnotationState,
        {
          payload,
          meta,
        }: {
          // ToDo (VIS-794): change to new type VisionAnnotation
          payload: VisionAnnotationV1[];
          meta: {
            arg: {
              fileIds: number[];
              clearCache?: boolean | undefined;
            };
            requestId: string;
            requestStatus: 'fulfilled';
          };
        }
      ) => {
        const { fileIds, clearCache } = meta.arg;

        // clear states
        if (clearCache) {
          state.annotations.byId = {};
          state.files.byId = {};
        } else {
          fileIds.forEach((fileId: any) => {
            const annotationIdsForFile = state.files.byId[fileId];
            if (annotationIdsForFile && annotationIdsForFile.length) {
              annotationIdsForFile.forEach((annotationId) => {
                delete state.annotations.byId[annotationId];
              });
            }
            delete state.files.byId[fileId];
          });
        }

        // update annotations
        // ToDo (VIS-794): conversion logic from V1 to V2 in the new slice can be moved into thunks.
        const annotations =
          convertCDFAnnotationV1ToVisionAnnotationBulk(payload);

        annotations.forEach((annotation) => {
          const resourceId: number | undefined = getAnnotatedResourceId({
            annotation,
          });

          if (resourceId) {
            if (
              state.files.byId[resourceId] &&
              !state.files.byId[resourceId].includes(annotation.id)
            ) {
              state.files.byId[resourceId].push(annotation.id);
            } else {
              state.files.byId[resourceId] = [annotation.id];
            }
          }

          if (
            !state.annotations.byId[annotation.id] ||
            state.annotations.byId[annotation.id].lastUpdatedTime !==
              annotation.lastUpdatedTime
          ) {
            state.annotations.byId[annotation.id] = annotation;
          }
        });
      }
    );

    builder.addCase(
      DeleteAnnotations.fulfilled,
      (state: AnnotationState, { payload }: { payload: number[] }) => {
        payload.forEach((annotationId) => {
          const annotation = state.annotations.byId[annotationId];

          if (annotation) {
            const resourceId: number | undefined = getAnnotatedResourceId({
              annotation,
            });

            if (resourceId) {
              const annotatedFileState = state.files.byId[resourceId];
              if (annotatedFileState) {
                const filteredState = annotatedFileState.filter(
                  (id) => id !== annotationId
                );
                if (filteredState.length) {
                  state.files.byId[resourceId] = filteredState;
                } else {
                  delete state.files.byId[resourceId];
                }
              }
              delete state.annotations.byId[annotationId];
            }
          }
        });
      }
    );

    builder.addMatcher(
      // TODO: refactor -> same as RetrieveAnnotations.fulfilled
      isAnyOf(
        CreateAnnotations.fulfilled,
        VisionJobUpdate.fulfilled,
        UpdateAnnotations.fulfilled
      ),
      (state: AnnotationState, { payload }) => {
        // update annotations
        // ToDo (VIS-794): conversion logic from V1 to V2 in the new slice can be moved into thunks.
        const annotations =
          convertCDFAnnotationV1ToVisionAnnotationBulk(payload);
        annotations.forEach((annotation) => {
          const resourceId: number | undefined = getAnnotatedResourceId({
            annotation,
          });
          if (resourceId) {
            if (state.files.byId[resourceId]) {
              if (!state.files.byId[resourceId].includes(annotation.id)) {
                state.files.byId[resourceId].push(annotation.id);
              }
            } else {
              state.files.byId[resourceId] = [annotation.id];
            }
          }
          state.annotations.byId[annotation.id] = annotation;
        });
      }
    );

    builder.addMatcher(
      isAnyOf(DeleteFilesById.fulfilled, clearAnnotationState),
      (state: AnnotationState, action) => {
        action.payload.forEach((fileId) => {
          const fileAnnotations = state.files.byId[fileId];

          if (fileAnnotations && fileAnnotations.length) {
            fileAnnotations.forEach((annotationId) => {
              delete state.annotations.byId[annotationId];
            });
            delete state.files.byId[fileId];
          }
        });
      }
    );
  },
});

export default annotationSlice.reducer;
