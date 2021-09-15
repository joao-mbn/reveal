import { FileInfo } from '@cognite/cdf-sdk-singleton';
import { ColumnShape } from 'react-base-table';
import { Annotation, JobStatus, VisionAPIType } from 'src/api/types';

export interface AnnotationPreview
  extends Pick<
    Annotation,
    'id' | 'annotatedResourceId' | 'status' | 'source' | 'text' | 'region'
  > {
  annotationType: VisionAPIType;
}
export type AnnotationCounts = {
  modelGenerated?: number;
  manuallyGenerated?: number;
  verified?: number;
  rejected?: number;
  unhandled?: number;
};

export type AnnotationStatuses = {
  status: JobStatus;
  statusTime: number;
};

export interface AnnotationsBadgeCounts {
  gdpr?: AnnotationCounts;
  tag?: AnnotationCounts;
  text?: AnnotationCounts;
  objects?: AnnotationCounts;
}
export interface AnnotationsBadgeStatuses {
  gdpr?: AnnotationStatuses;
  tag?: AnnotationStatuses;
  text?: AnnotationStatuses;
  objects?: AnnotationStatuses;
}

export type FileActions = {
  onFileDetailsClicked: (fileInfo: FileInfo) => void;
  onReviewClick?: (fileInfo: FileInfo) => void;
};

export type TableDataItem = Pick<
  FileInfo,
  'id' | 'mimeType' | 'name' | 'sourceCreatedTime' | 'geoLocation' | 'uploaded'
> & {
  menuActions: FileActions; // menu: FileActions;
  rowKey: string; // unique key;
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

export type ViewMode = 'list' | 'grid' | 'map' | 'modal';
export type SelectFilter = { geoLocation?: boolean };
