import { FileTypes, FileTypeVisibility } from '@data-exploration-lib/core';

export const ColumnKeys = [
  'created',
  'relation',
  'labels',
  'lastUpdatedTime',
  'parentExternalId',
  'isString',
  'isStep',
  'dataSet',
  'startTime',
  'endTime',
  'mimeType',
  'uploadedTime',
  'columns',
  'relationshipLabels',
] as const;

export const MAX_COLUMN_SELECTION = 20;

export const DEFAULT_VISIBILITY: FileTypeVisibility = {
  [FileTypes.CAD_MODELS]: true,
  [FileTypes.POINT_CLOUDS]: true,
  [FileTypes.IMAGES_360]: true,
};