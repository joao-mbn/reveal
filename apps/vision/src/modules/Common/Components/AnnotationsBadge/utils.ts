import { AnnotationStatuses } from '@vision/modules/Common/types';

export const showBadge = (
  count?: number,
  statuses?: AnnotationStatuses
): boolean => {
  return !!count || !!statuses?.status;
};