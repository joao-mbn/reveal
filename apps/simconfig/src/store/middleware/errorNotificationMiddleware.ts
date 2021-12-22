import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Dispatch, MiddlewareAPI, PayloadAction } from '@reduxjs/toolkit';

import { toast } from '@cognite/cogs.js';
import type { CogniteApiError } from '@cognite/simconfig-api-sdk/rtk';

export function errorNotificationMiddleware(_api: MiddlewareAPI) {
  return (next: Dispatch) =>
    (action: PayloadAction<{ data: { error: CogniteApiError } }>) => {
      if (isRejectedWithValue(action)) {
        toast.error(action.payload.data.error.message);
      }
      return next(action);
    };
}
