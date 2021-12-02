import { getExternalFileInfo, uploadFile } from 'utils/files';
import { CogniteExternalId, CogniteInternalId, FileInfo } from '@cognite/sdk';
import { RootDispatcher } from 'store/types';
import { ApiClient, CdfClient } from 'utils';
import { insertSuite } from 'store/suites/thunks';
import { Suite } from 'store/suites/types';
import { MixedHttpError, setHttpError } from 'store/notification/thunks';
import * as Sentry from '@sentry/browser';
import { setError } from 'store/notification/actions';
import { deleteLayoutItems } from 'store/layout/thunks';
import { updateBoardWithFileId } from 'utils/forms';

import * as actions from './actions';

export function updateFileInfoState(
  client: CdfClient,
  imageFileId?: CogniteExternalId
) {
  return async (dispatch: RootDispatcher) => {
    if (imageFileId) {
      dispatch(retrieveFileInfo(client, imageFileId));
    } else {
      dispatch(actions.clearFile());
    }
  };
}

type SaveFormProps = {
  client?: CdfClient;
  apiClient: ApiClient;
  suite: Suite;
  filesUploadQueue?: Map<string, File>;
  filesDeleteQueue?: CogniteExternalId[];
  layoutDeleteQueue?: CogniteExternalId[];
  dataSetId?: CogniteInternalId;
};

export function saveForm({
  client,
  apiClient,
  suite,
  filesUploadQueue,
  filesDeleteQueue,
  layoutDeleteQueue,
  dataSetId,
}: SaveFormProps) {
  return async (dispatch: RootDispatcher) => {
    dispatch(actions.formSaving());
    if (filesDeleteQueue?.length && client) {
      await dispatch(deleteFiles(client, filesDeleteQueue));
    }
    if (filesUploadQueue?.size && client) {
      if (!dataSetId) {
        dispatch(setError(['Cannot upload image files', 'Missing DataSetId']));
        Sentry.captureMessage(
          `Skipping upload of ${filesUploadQueue.size} file(s): missing dataSetId`,
          Sentry.Severity.Error
        );
      } else {
        await dispatch(
          uploadFiles({ client, filesUploadQueue, dataSetId, suite })
        );
      }
    }
    await dispatch(insertSuite(apiClient, suite));
    if (layoutDeleteQueue?.length) {
      await dispatch(deleteLayoutItems(apiClient, layoutDeleteQueue));
    }
    dispatch(actions.formSaved());
  };
}

type UploadFilesProps = {
  suite: Suite;
  client: CdfClient;
  filesUploadQueue: Map<string, File>;
  dataSetId: CogniteInternalId;
};

function uploadFiles({
  suite,
  client,
  filesUploadQueue,
  dataSetId,
}: UploadFilesProps) {
  return async (dispatch: RootDispatcher) => {
    dispatch(actions.filesUpload());
    // eslint-disable-next-line no-restricted-syntax
    for await (const [boardKey, file] of filesUploadQueue.entries()) {
      const fileInfo = getExternalFileInfo(file as File, boardKey, dataSetId);
      const { externalId } = fileInfo;
      try {
        await uploadFile(client, fileInfo, file);
        updateBoardWithFileId(suite, {
          boardKey,
          fileExternalId: externalId as CogniteExternalId,
        });
      } catch (e) {
        const error = e as MixedHttpError;
        dispatch(actions.fileUploadError({ boardKey, error: error?.message }));
        dispatch(setHttpError(`Failed to upload file ${externalId}`, error));
        Sentry.captureException(e);
      }
    }
    dispatch(actions.filesUploaded());
  };
}

export function deleteFiles(
  client: CdfClient,
  fileExternalIds: CogniteExternalId[]
) {
  return async (dispatch: RootDispatcher) => {
    try {
      await client.deleteFiles(fileExternalIds);
      dispatch(actions.filesDeleted());
    } catch (e) {
      const error = e as MixedHttpError;
      Sentry.captureException(e);
      dispatch(
        setHttpError(
          `Failed to delete image preview(s): ${fileExternalIds.join(', ')}`,
          error
        )
      );
    }
  };
}

export function retrieveFileInfo(
  client: CdfClient,
  fileExternalId: CogniteExternalId
) {
  return async (dispatch: RootDispatcher) => {
    dispatch(actions.retrieveFile());
    try {
      const fileInfo = (
        await client.retrieveFilesMetadata([fileExternalId])
      )[0] as FileInfo;
      dispatch(actions.retrievedFile(fileInfo));
    } catch (e) {
      const error = e as MixedHttpError;
      dispatch(actions.fileRetrieveError(error));
      dispatch(
        setHttpError(`Failed to fetch file name for ${fileExternalId}`, error)
      );
      Sentry.captureException(e);
    }
  };
}

// adds a child suite key to the parent suite and save
export function addChildSuite(
  apiClient: ApiClient,
  parent: Suite,
  childKey: CogniteExternalId
) {
  return async (dispatch: RootDispatcher) => {
    const updatedParent: Suite = {
      ...parent,
      suites: [...(parent.suites || []), childKey],
    } as Suite;
    await dispatch(insertSuite(apiClient, updatedParent, false));
  };
}

// deletes a child suite key from the parent suite and save
export function deleteChildSuite(
  apiClient: ApiClient,
  parent: Suite,
  childKey: CogniteExternalId
) {
  return async (dispatch: RootDispatcher) => {
    const updatedParent: Suite = {
      ...parent,
      suites: [...(parent?.suites || [])].filter((key) => key !== childKey),
    } as Suite;
    await dispatch(insertSuite(apiClient, updatedParent, false));
  };
}
