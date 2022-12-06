import { PrimaryKeyMethod } from 'components/CreateTableModal/CreateTableModal';
import { useCSVUpload } from './csv-upload';
import { useJSONUpload } from './json-upload';

export type RAWUploadStatus =
  | undefined
  | 'ready'
  | 'in-progress'
  | 'success'
  | 'error';

type RAWUpload = {
  parsePercentage?: number;
  uploadPercentage?: number;
  columns?: string[];
  onConfirmUpload?: (database: string, table: string) => void;

  isUploadError?: boolean;
  isUploadInProgress?: boolean;
  isUploadSuccess?: boolean;
  uploadStatus?: RAWUploadStatus;
};

export type UseUploadOptions = {
  file?: File;
  selectedPrimaryKeyMethod?: PrimaryKeyMethod;
  selectedColumnIndex?: number;
};

export const DEFAULT_FILE_PROPS = {
  accept: '.csv, .json',
  multiple: false,
  name: 'file',
};

export const useUpload = (
  file?: File,
  selectedPrimaryKeyMethod?: PrimaryKeyMethod,
  selectedColumnIndex?: number
): RAWUpload => {
  const csvUpload = useCSVUpload(
    file?.type === 'text/csv'
      ? { file, selectedPrimaryKeyMethod, selectedColumnIndex }
      : {}
  );
  const jsonUpload = useJSONUpload(
    file?.type === 'application/json'
      ? { file, selectedPrimaryKeyMethod, selectedColumnIndex }
      : {}
  );

  if (file?.type === 'text/csv') {
    return csvUpload;
  }

  if (file?.type === 'application/json') {
    return jsonUpload;
  }

  return {};
};
