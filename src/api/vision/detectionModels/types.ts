import { CogniteInternalId, CogniteExternalId } from '@cognite/sdk';

// Vision API schema types
export declare type FileIdEither = FileInternalId | FileExternalId;
export interface FileInternalId {
  fileId: CogniteInternalId;
}
export interface FileExternalId {
  fileExternalId: CogniteExternalId;
}

export type JobStatus =
  | 'Queued'
  | 'Collecting'
  | 'Running'
  | 'Completed'
  | 'Failed';

export type RegionType = 'points' | 'rectangle' | 'polygon' | 'polyline';

export type Vertex = {
  x: number;
  y: number;
};

export type AnnotationRegion = {
  shape: RegionType;
  vertices: Array<Vertex>;
};

export interface DetectedAnnotation {
  text: string;
  region: AnnotationRegion;
  confidence: number;
  assetIds?: Array<number>;
}

export type BaseVisionJobAnnotation = {
  text: string;
  confidence?: number;
};

export type TextDetectionJobAnnotation = BaseVisionJobAnnotation & {
  region: AnnotationRegion;
};

export type ObjectDetectionJobAnnotation = BaseVisionJobAnnotation & {
  region: AnnotationRegion;
};

export type TagDetectionJobAnnotation = BaseVisionJobAnnotation & {
  region: AnnotationRegion;
  assetIds: CogniteInternalId[];
};

export type DigitalGaugeDataAttributes = {
  /* eslint-disable camelcase */
  comma_pos: number;
  max_num_digits: number;
  min_num_digits: number;
  /* eslint-enable camelcase */
};
export type AnalogLevelGaugeDataAttributes = {
  /* eslint-disable camelcase */
  max_level: number;
  min_level: number;
  /* eslint-enable camelcase */
};

export type GaugeReaderJobAnnotation = BaseVisionJobAnnotation & {
  // __typename: VisionDetectionModelType.GaugeReader;
  region: AnnotationRegion;
  data: {
    keypointNames: string[];
    unit: string;
    // eslint-disable-next-line camelcase
    gauge_value?: number;
  } & (DigitalGaugeDataAttributes | AnalogLevelGaugeDataAttributes);
};

export type CusomModelJobAnnotation = BaseVisionJobAnnotation & {
  region?: AnnotationRegion; // Custom models can also be classification models
};

export type VisionJobAnnotation =
  | TextDetectionJobAnnotation
  | ObjectDetectionJobAnnotation
  | TagDetectionJobAnnotation
  | GaugeReaderJobAnnotation
  | CusomModelJobAnnotation;

export type VisionJobFailedItem = {
  errorMessage: string;
  items: Array<FileInternalId & Partial<FileExternalId>>;
};

export type VisionJobResultItem = FileInternalId &
  Partial<FileExternalId> & {
    annotations: Array<VisionJobAnnotation>;
    width?: number;
    height?: number;
  };

export interface VisionJobBase {
  status: JobStatus;
  createdTime: number;
  jobId: number;
  statusTime: number;
}
export interface VisionJobQueued extends VisionJobBase {
  startTime: null;
  status: 'Queued';
}
export interface VisionJobRunning extends VisionJobBase {
  startTime: number;
  status: 'Running';
  items?: Array<VisionJobResultItem>;
  failedItems?: Array<VisionJobFailedItem>;
}
export interface VisionJobCompleted extends VisionJobBase {
  status: 'Completed';
  createdTime: number;
  startTime: number;
  statusTime: number;
  jobId: number;
  items: Array<VisionJobResultItem>;
  failedItems?: Array<VisionJobFailedItem>;
}
export interface VisionJobFailed extends VisionJobBase {
  status: 'Failed';
}

export type VisionJobResponse =
  | VisionJobQueued
  | VisionJobRunning
  | VisionJobCompleted
  | VisionJobFailed;

// Model parameters
export interface ParamsOCR {
  useCache: boolean;
}
export interface ParamsTagDetection {
  useCache: boolean;
  partialMatch: boolean;
  assetSubtreeIds: Array<number>;
}

export interface ParamsObjectDetection {
  threshold: number;
}

export interface ParamsGaugeReader {
  gaugeType: string;
}
export interface ParamsCustomModel {
  modelJobId?: number;
  modelName: string;
  threshold: number;
  isValid: boolean;
}

export type DetectionModelParams =
  | ParamsOCR
  | ParamsTagDetection
  | ParamsObjectDetection
  | ParamsGaugeReader
  | ParamsCustomModel;

// App specific types
export enum VisionDetectionModelType {
  OCR = 1,
  TagDetection,
  ObjectDetection,
  GaugeReader,
  CustomModel,
}
export interface DetectionModelDataProvider {
  postJob(
    requestBody: any,
    parameters?: DetectionModelParams
  ): Promise<VisionJobResponse>;
  fetchJobById(jobId: number): Promise<VisionJobResponse>;
}

// some extension over api response for more convenient usage in app
export type VisionJob = VisionJobResponse & {
  type: VisionDetectionModelType;
};
