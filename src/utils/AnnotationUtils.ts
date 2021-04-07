import {
  Annotation,
  AnnotationSource,
  AnnotationType,
  DetectedAnnotation,
  DetectionModelType,
  RegionType,
} from 'src/api/types';

export enum AnnotationStatus {
  Verified = 'verified',
  Rejected = 'deleted',
  Unhandled = 'unhandled',
}

export enum AnnotationDrawerMode {
  LinkAsset,
  AddAnnotation,
}

export type DrawFunction = (
  canvas: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) => void;

export type AnnotationStyle = {
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  highlight?: boolean;
  draw?: DrawFunction;
};

export type AnnotationBoundingBox = {
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
};

export type UnsavedAnnotation = Omit<
  Annotation,
  'id' | 'createdTime' | 'lastUpdatedTime'
>;

export interface VisionAnnotation
  extends Omit<
    Annotation,
    'id' | 'region' | 'createdTime' | 'lastUpdatedTime'
  > {
  id?: string;
  label: string;
  type: RegionType;
  color: string;
  box?: AnnotationBoundingBox;
  status: AnnotationStatus;
  createdTime?: number;
  lastUpdatedTime?: number;
  virtual?: boolean;
}

export const ModelTypeColorMap = {
  [DetectionModelType.Text]: '#C945DB',
  [DetectionModelType.Tag]: '#FF6918',
  [DetectionModelType.GDPR]: '#2F80ED',
};

export const ModelTypeSourceMap: { [key: number]: AnnotationSource } = {
  [DetectionModelType.Text]: 'vision/ocr',
  [DetectionModelType.Tag]: 'vision/tagdetection',
  [DetectionModelType.GDPR]: 'vision/objectdetection',
};
export const ModelTypeAnnotationTypeMap = {
  [DetectionModelType.Text]: 'vision/ocr',
  [DetectionModelType.Tag]: 'vision/tagdetection',
  [DetectionModelType.GDPR]: 'vision/objectdetection',
};

export class AnnotationUtils {
  public static lineWidth = 5;

  public static getModelId(fileId: string, modelType: number): string {
    return `${modelType}-${fileId}`;
  }

  public static getAnnotationColor(modelType: DetectionModelType): string {
    return ModelTypeColorMap[modelType];
  }

  public static generateAnnotationId(
    fileId: string,
    type: AnnotationType,
    index: number
  ): string {
    return `${index}-${type}-${fileId}`;
  }

  public static getAnnotationStyle(
    color: string,
    status?: AnnotationStatus
  ): AnnotationStyle {
    const lineColor = color;
    const { lineWidth } = AnnotationUtils;

    if (status && status === AnnotationStatus.Verified) {
      return {
        strokeColor: lineColor,
        strokeWidth: lineWidth,
        highlight: false,
      };
    }

    const drawDashedRectangle = (
      canvas: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number
    ) => {
      canvas.beginPath();
      /* eslint-disable no-param-reassign */
      canvas.strokeStyle = lineColor;
      canvas.lineWidth = lineWidth;
      /* eslint-enable no-param-reassign */
      canvas.setLineDash([5, 5]);
      canvas.moveTo(x, y);
      canvas.rect(
        x - lineWidth / 2,
        y - lineWidth / 2,
        width + lineWidth,
        height + lineWidth
      );
      canvas.stroke();
    };

    return {
      draw: drawDashedRectangle,
    };
  }

  public static convertToVisionAnnotations(
    annotations: Annotation[] | UnsavedAnnotation[]
  ): VisionAnnotation[] {
    return annotations.map((value: Annotation | UnsavedAnnotation) => {
      let ann = AnnotationUtils.createVisionAnnotationStub(
        value.text,
        AnnotationUtils.getAnnotationsDetectionModelType(value),
        value.annotatedResourceId,
        value.region && {
          xMin: value.region.vertices[0].x,
          yMin: value.region.vertices[0].y,
          xMax: value.region.vertices[1].x,
          yMax: value.region.vertices[1].y,
        },
        value.region && value.region.shape,
        value.source,
        value.status,
        value.data,
        value.annotationType,
        value.annotatedResourceExternalId,
        value.linkedResourceId,
        value.linkedResourceExternalId
      );

      if (isAnnotation(value)) {
        ann = {
          ...ann,
          id: value.id.toString(),
          createdTime: value.createdTime,
          lastUpdatedTime: value.lastUpdatedTime,
        };
      }
      return ann;
    });
  }

  public static createVisionAnnotationStub(
    text: string,
    modelType: DetectionModelType,
    fileId: number,
    box?: AnnotationBoundingBox,
    type: RegionType = 'rectangle',
    source: AnnotationSource = 'user',
    status = AnnotationStatus.Unhandled,
    data = {},
    annotationType: AnnotationType = 'vision/ocr',
    fileExternalId?: string,
    assetId?: number,
    assetExternalId?: string,
    id?: string,
    createdTime?: number,
    lastUpdatedTime?: number,
    virtual = false
  ): VisionAnnotation {
    return {
      color: AnnotationUtils.getAnnotationColor(modelType),
      type,
      source,
      status,
      text,
      label: text,
      data,
      annotatedResourceId: fileId,
      annotatedResourceType: 'file',
      annotatedResourceExternalId: fileExternalId!,
      annotationType,
      id,
      box,
      ...(!!assetId && {
        linkedResourceId: assetId,
        linkedResourceExternalId: assetExternalId,
        linkedResourceType: 'asset',
      }),
      createdTime,
      lastUpdatedTime,
      virtual,
    };
  }

  public static convertToAnnotation(
    value: VisionAnnotation
  ): Annotation | UnsavedAnnotation {
    const ann: UnsavedAnnotation = {
      region: value.box && {
        shape: value.type,
        vertices: [
          {
            x: value.box.xMin,
            y: value.box.yMin,
          },
          {
            x: value.box.xMax,
            y: value.box.yMax,
          },
        ],
      },
      source: value.source,
      status: value.status,
      text: value.text,
      data: value.data || {},
      linkedResourceId: value.linkedResourceId,
      linkedResourceExternalId: value.linkedResourceExternalId,
      linkedResourceType: value.linkedResourceType,
      annotatedResourceId: value.annotatedResourceId,
      annotatedResourceType: value.annotatedResourceType,
      annotationType: value.annotationType,
    };

    if (!!value.id && !!value.lastUpdatedTime && !!value.createdTime) {
      const savedAnn: Annotation = {
        ...ann,
        id: parseInt(value.id, 10),
        createdTime: value.createdTime,
        lastUpdatedTime: value.lastUpdatedTime,
      };
      return savedAnn;
    }
    return ann;
  }

  public static getAnnotationsDetectionModelType = (
    ann: Annotation | UnsavedAnnotation
  ): DetectionModelType => {
    if (
      ann.linkedResourceType === 'asset' &&
      (ann.linkedResourceId || ann.linkedResourceExternalId)
    ) {
      return DetectionModelType.Tag;
    }

    if (ann.source === 'vision/objectdetection') {
      return DetectionModelType.GDPR;
    }
    return DetectionModelType.Text;
  };
}

export const isAnnotation = (
  ann: DetectedAnnotation | Annotation | UnsavedAnnotation
): ann is Annotation => {
  return !!(ann as Annotation).id && !!(ann as Annotation).lastUpdatedTime;
};

export const isUnSavedAnnotation = (
  ann: DetectedAnnotation | Annotation | UnsavedAnnotation
): ann is UnsavedAnnotation => {
  return !(ann as Annotation).lastUpdatedTime;
};
