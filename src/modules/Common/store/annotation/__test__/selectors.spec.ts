/* eslint-disable jest/no-disabled-tests */
import { initialState } from 'src/modules/Common/store/annotation/slice';
import { AnnotationState } from 'src/modules/Common/store/annotation/types';
import {
  getDummyImageClassificationAnnotation,
  getDummyImageExtractedTextAnnotation,
  getDummyImageObjectDetectionBoundingBoxAnnotation,
} from 'src/modules/Common/store/annotation/__test__/getDummyAnnotations';
import {
  annotatedFilesById,
  annotationsById,
  filesAnnotationCounts,
  makeSelectAnnotationsForFileIds,
  makeSelectFileAnnotations,
  makeSelectFileAnnotationsByType,
  makeSelectTotalAnnotationCountForFileIds,
} from 'src/modules/Common/store/annotation/selectors';
import { Status } from 'src/api/annotation/types';
import { VisionAnnotationType } from 'src/modules/Common/types';

const annotations = [
  getDummyImageClassificationAnnotation({
    id: 1,
    annotatedResourceId: 10,
    label: 'foo',
    status: Status.Suggested,
  }),
  getDummyImageObjectDetectionBoundingBoxAnnotation({
    id: 2,
    annotatedResourceId: 10,
  }),
  getDummyImageObjectDetectionBoundingBoxAnnotation({
    id: 3,
    annotatedResourceId: 20,
    label: 'bar',
    status: Status.Rejected,
  }),
  getDummyImageObjectDetectionBoundingBoxAnnotation({
    id: 4,
    annotatedResourceId: 20,
  }),
  getDummyImageObjectDetectionBoundingBoxAnnotation({
    id: 5,
    annotatedResourceId: 20,
  }),
  getDummyImageExtractedTextAnnotation({
    id: 6,
    annotatedResourceId: 30,
  }),
];

const mockState: AnnotationState = {
  ...initialState,
  files: {
    byId: {
      '10': [1, 2],
      '20': [3, 4, 5],
      '30': [6],
      '40': [],
    },
  },
  annotations: {
    byId: {
      '1': annotations[0],
      '2': annotations[1],
      '3': annotations[2],
      '4': annotations[3],
      '5': annotations[4],
      '6': annotations[5],
    },
  },
};

describe('Test annotation selectors', () => {
  describe('Test annotationsById selector', () => {
    test('should return all the annotations', () => {
      expect(annotationsById(mockState)).toEqual(mockState.annotations.byId);
    });
  });

  describe('Test annotatedFilesById selector', () => {
    test('should return all the annotated files', () => {
      expect(annotatedFilesById(mockState)).toEqual(mockState.files.byId);
    });
  });

  describe('Test makeSelectFileAnnotations', () => {
    const selectFileAnnotations = makeSelectFileAnnotations();

    test('should return empty list when file not part of state', () => {
      expect(selectFileAnnotations(initialState, 1)).toEqual([]);
    });

    test('should return empty list if file has no annotations', () => {
      const previousState = {
        ...initialState,
        files: {
          byId: {
            '10': [],
          },
        },
      };
      expect(
        selectFileAnnotations(previousState, 10).map((item) => item.id)
      ).toEqual([]);
    });

    test('should return annotation for specified file', () => {
      const previousState = {
        files: {
          byId: {
            '10': [1],
          },
        },
        annotations: {
          byId: {
            '1': getDummyImageObjectDetectionBoundingBoxAnnotation({
              id: 1,
              annotatedResourceId: 10,
            }),
            '2': getDummyImageObjectDetectionBoundingBoxAnnotation({
              id: 1,
              annotatedResourceId: 20,
            }),
          },
        },
      };
      expect(selectFileAnnotations(previousState, 10)).toEqual([
        getDummyImageObjectDetectionBoundingBoxAnnotation({
          id: 1,
          annotatedResourceId: 10,
        }),
      ]);
    });
  });

  describe('Test makeSelectAnnotationsForFileIds', () => {
    const selectAnnotationsForFileIds = makeSelectAnnotationsForFileIds();
    test('should return all annotations for provided file ids', () => {
      expect(selectAnnotationsForFileIds(mockState, [10, 20, 40])).toEqual({
        '10': [annotations[0], annotations[1]],
        '20': [annotations[2], annotations[3], annotations[4]],
        '40': [], // prefer to not raise exception in selectors
      });
    });
    test('should return the annotations filtered by text for provided file ids', () => {
      expect(
        selectAnnotationsForFileIds(mockState, [10, 20, 30], {
          annotationText: 'foo',
        })
      ).toEqual({
        '10': [annotations[0]],
        '20': [],
        '30': [],
      });
    });
    test('should return the annotations filtered by status for provided file ids', () => {
      expect(
        selectAnnotationsForFileIds(mockState, [10, 20, 30], {
          annotationState: Status.Rejected,
        })
      ).toEqual({
        '10': [],
        '20': [annotations[2]],
        '30': [],
      });
    });
  });

  describe('Test makeSelectFileAnnotationsByType', () => {
    const selectFileAnnotationsByType = makeSelectFileAnnotationsByType();

    test('should select annotations with specified type', () => {
      // select annotations for file id 10 with model type imageClassification
      expect(
        selectFileAnnotationsByType(mockState, 10, [
          VisionAnnotationType.imageClassification,
        ])
      ).toEqual([annotations[0]]);

      // select annotations for file id 20 with model type imageObjectDetectionBoundingBox
      expect(
        selectFileAnnotationsByType(mockState, 20, [
          VisionAnnotationType.imageObjectDetectionBoundingBox,
        ])
      ).toEqual([annotations[2], annotations[3], annotations[4]]);
    });
  });

  describe('Test filesAnnotationCounts', () => {
    test('should return number of annotations for each file', () => {
      const previousState = {
        ...initialState,
        files: {
          byId: {
            '10': [1, 2],
            '20': [3],
          },
        },
      };
      expect(filesAnnotationCounts(previousState, [10, 20])).toEqual({
        '10': 2,
        '20': 1,
      });
    });
  });

  describe('Test annotation count selectors', () => {
    describe('Test makeSelectTotalAnnotationCountForFileIds', () => {
      test('should return annotation counts for all annotations of provided file ids', () => {
        const selectTotalAnnotationCounts =
          makeSelectTotalAnnotationCountForFileIds();

        expect(selectTotalAnnotationCounts(mockState, [10])).toEqual({
          objects: 1,
          assets: 0,
          text: 0,
          gdpr: 0,
          mostFrequentObject: ['pump', 1],
        });

        expect(selectTotalAnnotationCounts(mockState, [20])).toEqual({
          objects: 3,
          assets: 0,
          text: 0,
          gdpr: 0,
          mostFrequentObject: ['pump', 2],
        });
      });
    });
  });
});
