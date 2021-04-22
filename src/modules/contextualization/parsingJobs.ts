import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { createSelector } from 'reselect';
import { callUntilCompleted } from 'helpers/Helpers';
import { RootState } from 'store';
import { createPendingAnnotationsFromJob } from 'utils/AnnotationUtils';
import { trackTimedUsage } from 'utils/Metrics';
import { FileInfo, Asset } from '@cognite/sdk';
import sdk from 'sdk-singleton';
import { ModelStatus } from 'modules/types';
import {
  createAnnotations,
  listAnnotationsForFile,
} from '@cognite/annotations';

export const PNID_PARSING_JOB_ID_METADATA_FIELD =
  '__COGNITE_PNID_PARSING_JOB_ID';
export const PNID_METADATA_IDENTIFIER = '__COGNITE_PNID';

const PARSING_JOB_CREATE_STARTED = 'pnid/PARSING_CREATE_STARTED';
const PARSING_JOB_CREATED = 'pnid/PARSING_JOB_CREATED';
const PARSING_JOB_STATUS_UPDATED = 'pnid/PARSING_JOB_STATUS_UPDATED';
const PARSING_JOB_DONE = 'pnid/PARSING_JOB_DONE';
const PARSING_JOB_ERROR = 'pnid/PARSING_JOB_ERROR';

interface CreateParsingJobStartedAction
  extends Action<typeof PARSING_JOB_CREATE_STARTED> {
  fileId: number;
  workflowId: number;
}
interface ParsingJobCreatedAction extends Action<typeof PARSING_JOB_CREATED> {
  fileId: number;
  jobId: number;
}
interface ParsingJobStatusUpdatedAction
  extends Action<typeof PARSING_JOB_STATUS_UPDATED> {
  fileId: number;
  jobId: number;
  status: ModelStatus;
}
interface ParsingJobDoneAction extends Action<typeof PARSING_JOB_DONE> {
  fileId: number;
  entities: PnidResponseEntity[];
}
interface ParsingJobErrorAction extends Action<typeof PARSING_JOB_ERROR> {
  fileId: number;
}
type ParsingJobActions =
  | CreateParsingJobStartedAction
  | ParsingJobCreatedAction
  | ParsingJobStatusUpdatedAction
  | ParsingJobDoneAction
  | ParsingJobErrorAction;

const pnidApiRootPath = (project: string) =>
  `/api/playground/projects/${project}/context/pnid`;
const createPnidDetectJobPath = (project: string) =>
  `${pnidApiRootPath(project)}/detect`;
const getPnidDetectJobPath = (project: string, jobId: number) =>
  `${pnidApiRootPath(project)}/detect/${jobId}`;

const documentApiRootPath = (project: string) =>
  `/api/playground/projects/${project}/context/documents`;
const createDocParsingJobPath = (project: string) =>
  `${documentApiRootPath(project)}/detect`;
const getDocParsingStatusPath = (project: string, jobId: number) =>
  `${documentApiRootPath(project)}/detect/${jobId}`;

type DocumentDetectJobSchema = {
  fileId: number;
  entities: string[];
};

type PnidParsingJobSchema = {
  fileId: number;
  entities: string[];
};

export const startPnidParsingJob = (
  file: FileInfo,
  entities: string[],
  options: { partialMatch: boolean; grayscale: boolean; minTokens: number },
  workflowId: number,
  diagrams: any, // temporary
  resources: any // temporary
) => {
  return async (
    dispatch: ThunkDispatch<any, any, ParsingJobActions>,
    getState: () => RootState
  ): Promise<number | undefined> => {
    const onFail = () => {
      dispatch({ type: PARSING_JOB_ERROR, fileId: file.id });
      timer.stop({ success: false });
    };

    const { jobStarted, workflowId: oldWorkflowId } =
      getState().contextualization.parsingJobs[file.id] || {};

    if (jobStarted && workflowId === oldWorkflowId) {
      return getState().contextualization.parsingJobs[file.id].jobId;
    }

    dispatch({
      type: PARSING_JOB_CREATE_STARTED,
      fileId: file.id,
      workflowId,
    });

    const timer = trackTimedUsage('Contextualization.PnidParsing.ParsingJob', {
      fileId: file.id,
    });

    const response = await sdk.post(createPnidDetectJobPath(sdk.project), {
      data: {
        fileId: file.id,
        entities,
        ...options,
      } as PnidParsingJobSchema,
    });
    try {
      const {
        status: httpStatus,
        data: { jobId, status: queueStatus },
      } = response;

      dispatch({ type: PARSING_JOB_CREATED, jobId, fileId: file.id });
      dispatch({
        type: PARSING_JOB_STATUS_UPDATED,
        jobId,
        status: queueStatus,
        fileId: file.id,
      });

      if (httpStatus === 200) {
        return await new Promise((resolve, reject) => {
          callUntilCompleted(
            () => sdk.get(getPnidDetectJobPath(sdk.project, jobId)),
            (data) => data.status === 'Completed' || data.status === 'Failed',
            async (data) => {
              if (data.status === 'Failed') {
                onFail();
                reject();
              } else {
                // completed]
                // load all entities to match to
                const assets = resources.assets as Asset[];
                const files = diagrams as FileInfo[];

                // load all existing annotations
                const existingAnnotations = await listAnnotationsForFile(
                  sdk,
                  file,
                  false
                );

                // generate valid annotations
                const pendingAnnotations = await createPendingAnnotationsFromJob(
                  file,
                  data.items,
                  assets,
                  files,
                  `${jobId!}`,
                  existingAnnotations
                );

                // create and finish the job
                await createAnnotations(sdk, pendingAnnotations);

                await dispatch({
                  type: PARSING_JOB_DONE,
                  jobId,
                  fileId: file.id,
                  entities: data.items,
                });

                resolve(jobId);

                timer.stop({ success: true, jobId });
              }
            },
            (data) => {
              dispatch({
                type: PARSING_JOB_STATUS_UPDATED,
                jobId,
                status: data.status,
                fileId: file.id,
              });
            },
            undefined,
            3000
          );
        });
      }
    } catch {
      onFail();
      return undefined;
    }
    onFail();
    return undefined;
  };
};

export const startDocumentParsingJob = (
  file: FileInfo,
  entities: string[],
  workflowId: number,
  diagrams: any, // temporary
  resources: any // temporary
) => {
  return async (
    dispatch: ThunkDispatch<any, any, ParsingJobActions>,
    getState: () => RootState
  ): Promise<number | undefined> => {
    const onFail = () => {
      dispatch({ type: PARSING_JOB_ERROR, fileId: file.id });
      timer.stop({ success: false });
    };

    const { jobStarted, workflowId: oldWorkflowId } =
      getState().contextualization.parsingJobs[file.id] || {};

    if (jobStarted && workflowId === oldWorkflowId) {
      return getState().contextualization.parsingJobs[file.id].jobId;
    }

    dispatch({
      type: PARSING_JOB_CREATE_STARTED,
      fileId: file.id,
      workflowId,
    });

    const timer = trackTimedUsage(
      'Contextualization.DocumentContextualization.ParsingJob',
      {
        fileId: file.id,
      }
    );

    const response = await sdk.post(createDocParsingJobPath(sdk.project), {
      data: {
        fileId: file.id,
        entities,
      } as DocumentDetectJobSchema,
    });
    try {
      const {
        status: httpStatus,
        data: { jobId, status: queueStatus },
      } = response;

      dispatch({ type: PARSING_JOB_CREATED, jobId, fileId: file.id });
      dispatch({
        type: PARSING_JOB_STATUS_UPDATED,
        jobId,
        status: queueStatus,
        fileId: file.id,
      });

      if (httpStatus === 200) {
        return await new Promise((resolve, reject) => {
          callUntilCompleted(
            () => sdk.get(getDocParsingStatusPath(sdk.project, jobId)),
            (data) => data.status === 'Completed' || data.status === 'Failed',
            async (data) => {
              if (data.status === 'Failed') {
                onFail();
                reject();
              } else {
                // completed
                // load all entities to match to
                const assetsData = resources.assets as Asset[];
                const filesData = diagrams;

                // load all existing annotations
                const existingAnnotations = await listAnnotationsForFile(
                  sdk,
                  file,
                  false
                );
                const flattenedEntities: Array<any> = data.items
                  .map((el: any) =>
                    Object.values(el.matches).map((value: any) => {
                      return { ...value, page: el.page } as PnidResponseEntity;
                    })
                  )
                  .flat(1);

                // generate valid annotations
                const pendingAnnotations = await createPendingAnnotationsFromJob(
                  file,
                  flattenedEntities,
                  assetsData,
                  filesData,
                  `${jobId!}`,
                  existingAnnotations
                );

                // create and finish the job
                await createAnnotations(sdk, pendingAnnotations);

                await dispatch({
                  type: PARSING_JOB_DONE,
                  jobId,
                  fileId: file.id,
                  entities: data.items,
                });

                resolve(jobId);

                timer.stop({ success: true, jobId });
              }
            },
            (data) => {
              dispatch({
                type: PARSING_JOB_STATUS_UPDATED,
                jobId,
                status: data.status,
                fileId: file.id,
              });
            },
            undefined,
            3000
          );
        });
      }
    } catch {
      onFail();
      return undefined;
    }
    onFail();
    return undefined;
  };
};

export interface PnidResponseEntity {
  text: string;
  boundingBox: { xMin: number; xMax: number; yMin: number; yMax: number };
  page?: number;
}

export interface ParsingJobState {
  jobStarted: boolean;
  jobId?: number;
  jobStatus: ModelStatus;
  jobDone: boolean;
  jobError: boolean;
  workflowId: number;
  annotations?: PnidResponseEntity[];
}

type Actions = ParsingJobActions;

export interface ParsingJobStore {
  [fileId: number]: ParsingJobState;
}

const initialStore: ParsingJobStore = {};

export const parsingJobsReducer = (
  state: ParsingJobStore = initialStore,
  action: Actions
): ParsingJobStore => {
  switch (action.type) {
    case PARSING_JOB_CREATED: {
      return {
        ...state,
        [action.fileId]: {
          ...state[action.fileId],
          jobId: action.jobId,
        },
      };
    }
    case PARSING_JOB_CREATE_STARTED: {
      return {
        ...state,
        [action.fileId]: {
          jobStarted: true,
          jobStatus: 'Queued',
          jobDone: false,
          jobError: false,
          workflowId: action.workflowId,
        },
      };
    }
    case PARSING_JOB_STATUS_UPDATED: {
      return {
        ...state,
        [action.fileId]: {
          ...state[action.fileId],
          jobStatus: action.status,
        },
      };
    }
    case PARSING_JOB_DONE: {
      return {
        ...state,
        [action.fileId]: {
          ...state[action.fileId],
          jobDone: true,
          annotations: action.entities,
        },
      };
    }
    case PARSING_JOB_ERROR: {
      return {
        ...state,
        [action.fileId]: {
          ...state[action.fileId],
          jobDone: true,
          jobError: true,
        },
      };
    }

    default: {
      return state;
    }
  }
};

export const makeNumPnidParsingJobSelector = createSelector(
  (state: RootState) => state.contextualization.parsingJobs,
  (parsingJobs) => (fileIds: number[]) => {
    const jobIds = new Set(Object.keys(parsingJobs));
    return fileIds.filter((fileId) => jobIds.has(`${fileId}`)).length;
  }
);

export const selectParsingJobForFileId = createSelector(
  (state: RootState) => state.contextualization.parsingJobs,
  (jobMap) => (fileId: number) => {
    return jobMap[fileId];
  }
);
