import {
  convertImageAssetLinkListToAnnotationTypeV1,
  convertImageClassificationToAnnotationTypeV1,
  convertImageExtractedTextToAnnotationTypeV1,
  convertImageObjectDetectionBoundingBoxToAnnotationTypeV1,
  convertVisionJobAnnotationToImageAssetLinkList,
  convertVisionJobAnnotationToImageClassification,
  convertVisionJobAnnotationToImageExtractedText,
  convertVisionJobAnnotationToImageObjectDetectionBoundingBox,
} from 'src/api/vision/detectionModels/converters';
import {
  ImageAssetLink,
  ImageClassification,
  ImageExtractedText,
  ImageObjectDetectionBoundingBox,
  RegionShape,
} from 'src/api/annotation/types';
import { VisionJobAnnotation } from 'src/api/vision/detectionModels/types';

describe('convertVisionJobAnnotationToImageClassification', () => {
  test('Missing confidence and label', () => {
    const visionJobAnnotation = {} as VisionJobAnnotation;
    expect(
      convertVisionJobAnnotationToImageClassification(visionJobAnnotation)
    ).toStrictEqual({ confidence: undefined, label: undefined });
  });

  test('Region ignored - valid ImageClassification', () => {
    const visionJobAnnotation = {
      confidence: 0.1,
      text: 'gauge',
      region: {
        shape: RegionShape.Rectangle,
        vertices: [
          { x: 0, y: 0.1 },
          { x: 1, y: 0.3 },
        ],
      },
    } as VisionJobAnnotation;
    expect(
      convertVisionJobAnnotationToImageClassification(visionJobAnnotation)
    ).toStrictEqual({ confidence: 0.1, label: 'gauge' });
  });
});

describe('convertVisionJobAnnotationToImageObjectDetectionBoundingBox', () => {
  const boundingBox = {
    region: {
      shape: RegionShape.Rectangle,
      vertices: [
        { x: 0, y: 0.1 },
        { x: 1, y: 0.3 },
      ],
    },
  };
  test('Invalid boundingbox', () => {
    const visionJobAnnotation = {} as VisionJobAnnotation;
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(
      convertVisionJobAnnotationToImageObjectDetectionBoundingBox(
        visionJobAnnotation
      )
    ).toStrictEqual(null);
    expect(consoleSpy).toHaveBeenCalled();
  });

  test('Should return converted type', () => {
    const visionJobAnnotation = {
      text: 'gauge',
      confidence: 0.1,
      ...boundingBox,
    } as VisionJobAnnotation;
    expect(
      convertVisionJobAnnotationToImageObjectDetectionBoundingBox(
        visionJobAnnotation
      )
    ).toStrictEqual({
      confidence: visionJobAnnotation.confidence,
      label: visionJobAnnotation.text,
      boundingBox: {
        xMin: boundingBox.region.vertices[0].x,
        yMin: boundingBox.region.vertices[0].y,
        xMax: boundingBox.region.vertices[1].x,
        yMax: boundingBox.region.vertices[1].y,
      },
    });
  });
});

describe('convertVisionJobAnnotationToImageExtractedText', () => {
  const boundingBox = {
    region: {
      shape: RegionShape.Rectangle,
      vertices: [
        { x: 0, y: 0.1 },
        { x: 1, y: 0.3 },
      ],
    },
  };
  test('Invalid boundingbox', () => {
    const visionJobAnnotation = {} as VisionJobAnnotation;
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(
      convertVisionJobAnnotationToImageExtractedText(visionJobAnnotation)
    ).toStrictEqual(null);
    expect(consoleSpy).toHaveBeenCalled();
  });

  test('Should return converted type', () => {
    const visionJobAnnotation = {
      text: 'gauge',
      confidence: 0.1,
      ...boundingBox,
    } as VisionJobAnnotation;
    expect(
      convertVisionJobAnnotationToImageExtractedText(visionJobAnnotation)
    ).toStrictEqual({
      confidence: visionJobAnnotation.confidence,
      extractedText: visionJobAnnotation.text,
      textRegion: {
        xMin: boundingBox.region.vertices[0].x,
        yMin: boundingBox.region.vertices[0].y,
        xMax: boundingBox.region.vertices[1].x,
        yMax: boundingBox.region.vertices[1].y,
      },
    });
  });
});

describe('convertVisionJobAnnotationToImageAssetLinkList', () => {
  const boundingBox = {
    region: {
      shape: RegionShape.Rectangle,
      vertices: [
        { x: 0, y: 0.1 },
        { x: 1, y: 0.3 },
      ],
    },
  };
  test('Invalid boundingbox', () => {
    const visionJobAnnotation = {} as VisionJobAnnotation;
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(
      convertVisionJobAnnotationToImageAssetLinkList(visionJobAnnotation)
    ).toStrictEqual(null);
    expect(consoleSpy).toHaveBeenCalled();
  });

  test('Invalid assetIds', () => {
    const visionJobAnnotation = {
      ...boundingBox,
      assetIds: [] as number[],
    } as VisionJobAnnotation;
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(
      convertVisionJobAnnotationToImageAssetLinkList(visionJobAnnotation)
    ).toStrictEqual(null);
    expect(consoleSpy).toHaveBeenCalled();
  });

  test('Should return converted type', () => {
    const visionJobAnnotation = {
      text: 'asset',
      confidence: 0.1,
      assetIds: [1, 2],
      ...boundingBox,
    } as VisionJobAnnotation;
    expect(
      convertVisionJobAnnotationToImageAssetLinkList(visionJobAnnotation)
    ).toStrictEqual([
      {
        text: 'asset',
        confidence: visionJobAnnotation.confidence,
        assetRef: { id: 1 },
        textRegion: {
          xMin: boundingBox.region.vertices[0].x,
          yMin: boundingBox.region.vertices[0].y,
          xMax: boundingBox.region.vertices[1].x,
          yMax: boundingBox.region.vertices[1].y,
        },
      },
      {
        text: 'asset',
        confidence: visionJobAnnotation.confidence,
        assetRef: { id: 2 },
        textRegion: {
          xMin: boundingBox.region.vertices[0].x,
          yMin: boundingBox.region.vertices[0].y,
          xMax: boundingBox.region.vertices[1].x,
          yMax: boundingBox.region.vertices[1].y,
        },
      },
    ]);
  });
});

describe('Test converts for internal types -> Annotation V1 types', () => {
  const boundingBox = {
    xMin: 0.1,
    yMin: 0.2,
    xMax: 0.3,
    yMax: 0.4,
  };
  test('convertImageClassificationToAnnotationTypeV1', () => {
    const visionJobAnnotation = {
      confidence: 0.5,
      label: 'gauge',
    } as ImageClassification;
    expect(
      convertImageClassificationToAnnotationTypeV1(visionJobAnnotation)
    ).toStrictEqual({
      data: { confidence: visionJobAnnotation.confidence },
      text: visionJobAnnotation.label,
    });
  });

  test('convertImageObjectDetectionBoundingBoxToAnnotationTypeV1', () => {
    const visionJobAnnotation = {
      confidence: 0.5,
      label: 'gauge',
      boundingBox,
    } as ImageObjectDetectionBoundingBox;
    expect(
      convertImageObjectDetectionBoundingBoxToAnnotationTypeV1(
        visionJobAnnotation
      )
    ).toStrictEqual({
      text: visionJobAnnotation.label,
      data: {
        confidence: visionJobAnnotation.confidence,
      },
      region: {
        shape: RegionShape.Rectangle,
        vertices: [
          { x: boundingBox.xMin, y: boundingBox.yMin },
          { x: boundingBox.xMax, y: boundingBox.yMax },
        ],
      },
    });
  });

  test('convertImageExtractedTextToAnnotationTypeV1', () => {
    const visionJobAnnotation = {
      confidence: 0.5,
      extractedText: 'gauge',
      textRegion: boundingBox,
    } as ImageExtractedText;
    expect(
      convertImageExtractedTextToAnnotationTypeV1(visionJobAnnotation)
    ).toStrictEqual({
      text: visionJobAnnotation.extractedText,
      data: {
        confidence: visionJobAnnotation.confidence,
      },
      region: {
        shape: RegionShape.Rectangle,
        vertices: [
          { x: boundingBox.xMin, y: boundingBox.yMin },
          { x: boundingBox.xMax, y: boundingBox.yMax },
        ],
      },
    });
  });

  test('convertImageAssetLinkListToAnnotationTypeV1', () => {
    const visionJobAnnotation = [
      {
        confidence: 0.5,
        text: 'gauge',
        textRegion: boundingBox,
        assetRef: {
          id: 1,
        },
      },
    ] as ImageAssetLink[];
    expect(
      convertImageAssetLinkListToAnnotationTypeV1(visionJobAnnotation)
    ).toStrictEqual(
      visionJobAnnotation.map((item) => {
        return {
          text: item.text,
          linkedResourceId: item.assetRef.id,
          linkedResourceExternalId: item.assetRef.externalId,
          linkedResourceType: 'asset',
          data: {
            confidence: item.confidence,
          },
          region: {
            shape: RegionShape.Rectangle,
            vertices: [
              { x: boundingBox.xMin, y: boundingBox.yMin },
              { x: boundingBox.xMax, y: boundingBox.yMax },
            ],
          },
        };
      })
    );
  });
});
