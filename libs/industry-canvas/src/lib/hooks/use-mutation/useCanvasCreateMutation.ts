import { toast } from '@cognite/cogs.js';
import { captureException } from '@sentry/react';
import { useMutation } from 'react-query';
import type { IndustryCanvasService } from '../../services/IndustryCanvasService';
import { IndustryCanvasState } from '../../types';
import { QueryKeys, TOAST_POSITION } from '../../constants';

export const useCanvasCreateMutation = (service: IndustryCanvasService) => {
  return useMutation(
    [QueryKeys.CREATE_CANVAS],
    (canvas: IndustryCanvasState) => {
      return service.createCanvas({
        ...service.makeEmptyCanvas(),
        data: {
          ...canvas,
        },
      });
    },
    {
      onError: (err) => {
        captureException(err);
        toast.error('Failed to create canvas', {
          toastId: 'industry-canvas-create-error',
          position: TOAST_POSITION,
        });
      },
    }
  );
};