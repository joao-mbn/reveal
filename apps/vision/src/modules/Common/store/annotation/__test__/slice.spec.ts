import { getDummyImageObjectDetectionBoundingBoxAnnotation } from '@vision/__test-utils/getDummyAnnotations';
import reducer, {
  initialState,
} from '@vision/modules/Common/store/annotation/slice';
import { AnnotationState } from '@vision/modules/Common/store/annotation/types';
import { clearAnnotationState } from '@vision/store/commonActions';
import { DeleteAnnotations } from '@vision/store/thunks/Annotation/DeleteAnnotations';
import { RetrieveAnnotations } from '@vision/store/thunks/Annotation/RetrieveAnnotations';
import { UpdateAnnotations } from '@vision/store/thunks/Annotation/UpdateAnnotations';
import { DeleteFilesById } from '@vision/store/thunks/Files/DeleteFilesById';
import { VisionJobUpdate } from '@vision/store/thunks/Process/VisionJobUpdate';

import { InternalId } from '@cognite/sdk';

jest.mock(
  '@vision/modules/Review/Components/AnnotationSettingsModal/AnnotationSettingsUtils',
  () => ({
    ...jest.requireActual(
      '@vision/modules/Review/Components/AnnotationSettingsModal/AnnotationSettingsUtils'
    ),
    getRandomColor: () => {
      return '#0f0';
    },
  })
);

describe('Test annotation reducer', () => {
  const dummyAnnotation1 = getDummyImageObjectDetectionBoundingBoxAnnotation({
    id: 1,
  });
  const dummyAnnotation2 = getDummyImageObjectDetectionBoundingBoxAnnotation({
    id: 2,
  });

  test('should return the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  describe('Test RetrieveAnnotations.fulfilled action', () => {
    test('should clear entire state when clear cache is true and response is empty', () => {
      const previousState: AnnotationState = {
        files: {
          byId: {
            '10': [1, 2],
          },
        },
        annotations: {
          byId: {
            '1': dummyAnnotation1,
            '2': dummyAnnotation2,
          },
        },
        // both keypoints have same label
        annotationColorMap: {
          [dummyAnnotation1.label]: '#f00',
        },
      };
      const action = {
        type: RetrieveAnnotations.fulfilled.type,
        meta: {
          arg: {
            fileIds: [],
            clearCache: true,
          },
        },
        payload: [],
      };

      expect(reducer(previousState, action)).toEqual({
        ...initialState,
        annotationColorMap: previousState.annotationColorMap,
      });
    });

    test('should clear only specified fileIds when clear cache is false and response is empty', () => {
      const previousState: AnnotationState = {
        files: {
          byId: {
            '10': [1],
            '20': [2],
          },
        },
        annotations: {
          byId: {
            '1': dummyAnnotation1,
            '2': dummyAnnotation2,
          },
        },
        annotationColorMap: {
          [dummyAnnotation1.label]: '#f00',
          [dummyAnnotation2.label]: '#f00',
        },
      };

      const action = {
        type: RetrieveAnnotations.fulfilled.type,
        meta: {
          arg: {
            fileIds: [10],
            clearCache: false,
          },
        },
        payload: [],
      };

      expect(reducer(previousState, action)).toEqual({
        files: {
          byId: { '20': [2] },
        },
        annotations: {
          byId: {
            '2': dummyAnnotation2,
          },
        },
        annotationColorMap: {
          [dummyAnnotation2.label]: '#f00',
        },
      });
    });

    test('should keep state unchanged if nonexistent fileIds are provided', () => {
      const previousState: AnnotationState = {
        files: {
          byId: {
            '10': [1],
          },
        },
        annotations: {
          byId: {
            '1': dummyAnnotation1,
          },
        },
        annotationColorMap: {
          [dummyAnnotation1.label]: '#f00',
        },
      };

      const action = {
        type: RetrieveAnnotations.pending.type,
        meta: {
          arg: {
            fileIds: [30],
            clearCache: false,
          },
        },
        payload: [],
      };

      expect(reducer(previousState, action)).toEqual(previousState);
    });

    test('should populate state', () => {
      const previousState: AnnotationState = {
        files: {
          byId: {
            '10': [1],
            '20': [],
          },
        },
        annotations: {
          byId: {
            '1': dummyAnnotation1,
          },
        },
        annotationColorMap: {
          [dummyAnnotation1.label]: '#f00',
        },
      };

      const action = {
        type: RetrieveAnnotations.fulfilled.type,
        meta: {
          arg: {
            fileIds: [10, 20, 30],
            clearCache: false,
          },
        },
        payload: [
          getDummyImageObjectDetectionBoundingBoxAnnotation({
            id: 1,
            annotatedResourceId: 10,
          }), // existing annotation and file
          getDummyImageObjectDetectionBoundingBoxAnnotation({
            id: 2,
            annotatedResourceId: 10,
          }), // new annotation for existing file with annotation
          getDummyImageObjectDetectionBoundingBoxAnnotation({
            id: 3,
            annotatedResourceId: 20,
          }), // new annotation for existing file without annotation
          getDummyImageObjectDetectionBoundingBoxAnnotation({
            id: 4,
            annotatedResourceId: 30,
            label: 'new-label',
          }), // new file and annotation
        ],
      };

      expect(reducer(previousState, action)).toEqual({
        files: {
          byId: {
            '10': [1, 2], // should add only new annotation to existing file
            '20': [3], // should add new annotation to existing file, previously without annotations
            '30': [4], // should add new file and annotation
          },
        },
        annotations: {
          byId: {
            '1': getDummyImageObjectDetectionBoundingBoxAnnotation({
              id: 1,
              annotatedResourceId: 10,
            }),
            '2': getDummyImageObjectDetectionBoundingBoxAnnotation({
              id: 2,
              annotatedResourceId: 10,
            }),
            '3': getDummyImageObjectDetectionBoundingBoxAnnotation({
              id: 3,
              annotatedResourceId: 20,
            }),
            '4': getDummyImageObjectDetectionBoundingBoxAnnotation({
              id: 4,
              annotatedResourceId: 30,
              label: 'new-label',
            }),
          },
        },
        annotationColorMap: {
          [dummyAnnotation1.label]: '#f00',
          'new-label': '#0f0',
        },
      });
    });
  });

  describe('Test DeleteAnnotations.fulfilled action', () => {
    test('should not change state for nonexistent annotation id', () => {
      const previousState: AnnotationState = {
        files: {
          byId: {
            '10': [1],
          },
        },
        annotations: {
          byId: {
            '1': dummyAnnotation1,
          },
        },
        annotationColorMap: {
          [dummyAnnotation1.label]: '#f00',
        },
      };

      const action: {
        type: string;
        meta: { arg: InternalId[] };
        payload: InternalId[];
      } = {
        type: DeleteAnnotations.fulfilled.type,
        meta: {
          arg: [{ id: 3 }],
        },
        payload: [{ id: 3 }], // annotation ids to delete
      };

      expect(reducer(previousState, action)).toEqual(previousState);
    });

    test('should clean entire state since all annotation ids in state given in payload', () => {
      const previousState: AnnotationState = {
        files: {
          byId: {
            '10': [1, 2],
          },
        },
        annotations: {
          byId: {
            '1': dummyAnnotation1,
            '2': dummyAnnotation2,
          },
        },
        annotationColorMap: {
          [dummyAnnotation1.label]: '#f00',
        },
      };

      const action: {
        type: string;
        meta: { arg: InternalId[] };
        payload: InternalId[];
      } = {
        type: DeleteAnnotations.fulfilled.type,
        meta: {
          arg: [{ id: 1 }, { id: 2 }],
        },
        payload: [{ id: 1 }, { id: 2 }], // annotation ids to delete
      };

      expect(reducer(previousState, action)).toEqual({
        ...initialState,
        annotationColorMap: previousState.annotationColorMap,
      });
    });

    test('should only remove annotations with specified ids', () => {
      const previousState: AnnotationState = {
        files: {
          byId: {
            '10': [1, 2],
          },
        },
        annotations: {
          byId: {
            '1': dummyAnnotation1,
            '2': dummyAnnotation2,
          },
        },
        annotationColorMap: {
          [dummyAnnotation1.label]: '#f00',
        },
      };

      const action: {
        type: string;
        meta: { arg: InternalId[] };
        payload: InternalId[];
      } = {
        type: DeleteAnnotations.fulfilled.type,
        meta: {
          arg: [{ id: 2 }],
        },
        payload: [{ id: 2 }], // annotation ids to delete
      };

      expect(reducer(previousState, action)).toEqual({
        files: {
          byId: {
            '10': [1],
          },
        },
        annotations: {
          byId: {
            '1': dummyAnnotation1,
          },
        },
        annotationColorMap: previousState.annotationColorMap,
      });
    });

    test('should delete annotation with non existing file id', () => {
      const previousState: AnnotationState = {
        files: {
          byId: {
            '20': [1], // annotation.annotatedResourceId ('10') not in sync with state.files.byId ('20')
          },
        },
        annotations: {
          byId: {
            '1': dummyAnnotation1,
          },
        },
        annotationColorMap: {
          [dummyAnnotation1.label]: '#f00',
        },
      };

      const action: {
        type: string;
        meta: { arg: InternalId[] };
        payload: InternalId[];
      } = {
        type: DeleteAnnotations.fulfilled.type,
        meta: {
          arg: [{ id: 1 }],
        },
        payload: [{ id: 1 }], // annotation ids to delete
      };

      expect(reducer(previousState, action)).toEqual({
        files: {
          byId: {
            '20': [1],
          },
        },
        annotations: {
          byId: {},
        },
        annotationColorMap: previousState.annotationColorMap,
      });
    });
  });

  describe('Test populator actions', () => {
    const actionTypes = [
      VisionJobUpdate.fulfilled.type,
      UpdateAnnotations.fulfilled.type,
    ];
    test('should populate state', () => {
      actionTypes.forEach((actionType) => {
        const previousState: AnnotationState = {
          files: {
            byId: {
              '10': [1],
              '20': [],
            },
          },
          annotations: {
            byId: {
              '1': dummyAnnotation1,
            },
          },
          annotationColorMap: {
            [dummyAnnotation1.label]: '#f00',
          },
        };

        const action = {
          type: actionType,
          payload: [
            getDummyImageObjectDetectionBoundingBoxAnnotation({
              id: 1,
              annotatedResourceId: 10,
            }), // existing annotation and file
            getDummyImageObjectDetectionBoundingBoxAnnotation({
              id: 2,
              annotatedResourceId: 10,
            }), // new annotation for existing file with annotation
            getDummyImageObjectDetectionBoundingBoxAnnotation({
              id: 3,
              annotatedResourceId: 20,
            }), // new annotation for existing file without annotation
            getDummyImageObjectDetectionBoundingBoxAnnotation({
              id: 4,
              annotatedResourceId: 30,
              label: 'new-label',
            }), // new file and annotation
          ],
        };

        expect(reducer(previousState, action)).toEqual({
          files: {
            byId: {
              '10': [1, 2], // should add only new annotation to existing file
              '20': [3], // should add new annotation to existing file, previously without annotations
              '30': [4], // should add new file and annotation
            },
          },
          annotations: {
            byId: {
              '1': getDummyImageObjectDetectionBoundingBoxAnnotation({
                id: 1,
                annotatedResourceId: 10,
              }),
              '2': getDummyImageObjectDetectionBoundingBoxAnnotation({
                id: 2,
                annotatedResourceId: 10,
              }),
              '3': getDummyImageObjectDetectionBoundingBoxAnnotation({
                id: 3,
                annotatedResourceId: 20,
              }),
              '4': getDummyImageObjectDetectionBoundingBoxAnnotation({
                id: 4,
                annotatedResourceId: 30,
                label: 'new-label',
              }),
            },
          },
          annotationColorMap: {
            [dummyAnnotation1.label]: '#f00',
            'new-label': '#0f0',
          },
        });
      });
    });
  });

  describe('Test delete actions based on file ids', () => {
    const actionTypes = [
      DeleteFilesById.fulfilled.type,
      clearAnnotationState.type,
    ];
    test('should delete file and corresponding annotations from state', () => {
      actionTypes.forEach((actionType) => {
        const action = {
          type: actionType,
          payload: [20], // file id to delete
        };

        const previousState: AnnotationState = {
          files: {
            byId: {
              '10': [1],
              '20': [2],
            },
          },
          annotations: {
            byId: {
              '1': getDummyImageObjectDetectionBoundingBoxAnnotation({ id: 1 }),
              '2': getDummyImageObjectDetectionBoundingBoxAnnotation({ id: 2 }),
            },
          },
          annotationColorMap: {
            [dummyAnnotation1.label]: '#f00',
          },
        };

        expect(reducer(previousState, action)).toEqual({
          files: {
            byId: {
              '10': [1],
            },
          },
          annotations: {
            byId: {
              '1': getDummyImageObjectDetectionBoundingBoxAnnotation({ id: 1 }),
            },
          },
          annotationColorMap: {
            [dummyAnnotation1.label]: '#f00',
          },
        });
      });
    });
  });
});