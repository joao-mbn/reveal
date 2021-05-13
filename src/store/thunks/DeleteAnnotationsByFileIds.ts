import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'src/store/rootReducer';
import { DeleteAnnotationsAndRemoveLinkedAssets } from 'src/store/thunks/DeleteAnnotationsAndRemoveLinkedAssets';

export const DeleteAnnotationsByFileIds = createAsyncThunk<
  void,
  number[],
  ThunkConfig
>('DeleteAnnotationsByFileIds', async (fileIds, { getState, dispatch }) => {
  const annotationState = getState().previewSlice;

  const fileAnnotationIds = fileIds
    .map((fid) => {
      const modelsForFile = annotationState.modelsByFileId[fid].map(
        (mid) => annotationState.models.byId[mid]
      );
      const modelAnnotationIds = modelsForFile.map((model) => {
        return model.annotations;
      });
      const annotationIdsForFile = modelAnnotationIds.flat();
      return annotationIdsForFile;
    })
    .flat();

  await dispatch(DeleteAnnotationsAndRemoveLinkedAssets(fileAnnotationIds));
});
