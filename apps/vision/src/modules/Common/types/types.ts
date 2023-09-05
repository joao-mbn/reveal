import { ColumnShape } from 'react-base-table';

import { JobStatus } from '@vision/api/vision/detectionModels/types';
import { AnnotationFilterType } from '@vision/modules/FilterSidePanel/types';

import { FileInfo } from '@cognite/sdk';

export type AnnotationStatuses = {
  status: JobStatus;
  statusTime: number;
  error?: string;
};

export interface AnnotationsBadgeCounts {
  gdpr: number;
  assets: number;
  text: number;
  objects: number;
  mostFrequentObject?: [string, number];
}
export interface AnnotationsBadgeStatuses {
  gdpr?: AnnotationStatuses;
  tag?: AnnotationStatuses;
  text?: AnnotationStatuses;
  objects?: AnnotationStatuses;
}

export type FileActions = {
  onFileDetailsClicked: (fileInfo: FileInfo) => void;
  onFileDelete: (id: number) => void;
  onReviewClick: (fileInfo: FileInfo) => void;
};

export type TableDataItem = Pick<
  FileInfo,
  | 'id'
  | 'mimeType'
  | 'name'
  | 'sourceCreatedTime'
  | 'geoLocation'
  | 'uploaded'
  | 'createdTime'
  | 'uploadedTime'
> & {
  menuActions: FileActions; // menu: FileActions;
  rowKey: string; // unique key;
  annotationFilter?: AnnotationFilterType;
  annotationThresholds?: [number, number];
};

export type ResultData = TableDataItem;
export interface SelectableTableColumnShape<T> extends ColumnShape<T> {
  selectedIds?: number[];
  allSelected?: boolean;
  onSelectAll?: (value: boolean) => void;
}

export type CellRenderer = {
  rowData: TableDataItem;
  column: ColumnShape<TableDataItem>;
  rowIndex: number;
  cellData: any;
};

export type SelectableTableCellRenderer = {
  rowData: TableDataItem;
  column: SelectableTableColumnShape<TableDataItem>;
  rowIndex: number;
  cellData: any;
};

export type SelectableTableCellRendererProps = {
  rowData: TableDataItem;
  column: ColumnShape<TableDataItem>;
  rowIndex: number;
  cellData: any;
  sortKey?: string;
  reverse?: boolean;
  setSortKey: ((key: string) => void) | undefined;
  setReverse: ((rev: boolean) => void) | undefined;
};

export type ViewMode = 'list' | 'grid' | 'map' | 'modal';
export type SelectFilter = { geoLocation?: boolean };

export interface AnnotationIdsByStatus {
  rejectedAnnotationIds: number[];
  acceptedAnnotationIds: number[];
  unhandledAnnotationIds: number[];
}