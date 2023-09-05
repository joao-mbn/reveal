import { VALID_MIME_TYPES } from '@vision/constants/validMimeTypes';
import { MediaTypeOption } from '@vision/modules/FilterSidePanel/types';

export const getAllValidMimeTypes = () =>
  VALID_MIME_TYPES.map((mimeType) => mimeType.type);

export const getValidMimeTypesByMediaType = (
  mediaType?: MediaTypeOption
): string[] => {
  if (mediaType) {
    return VALID_MIME_TYPES.filter(
      (mimeType) => mimeType.category === mediaType
    ).map((mimeType) => mimeType.type);
  }
  return getAllValidMimeTypes();
};