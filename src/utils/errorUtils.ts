import * as Sentry from '@sentry/browser';
import notification from 'antd/lib/notification';
import { getContainer } from 'utils/utils';
import { DataSetError } from 'components/ErrorMessage/ErrorMessage';

interface HandleErrorParams {
  status: number;
  message: string;
}

export const handleError = (errorObject: HandleErrorParams) => {
  const { status } = errorObject;
  if (status !== 401 && status !== 403) {
    Sentry.captureException(errorObject);
  }
  if (status >= 500) {
    notification.error({
      message: errorObject.message,
      duration: 6,
      getContainer,
    });
  }
};

export const generateStatusMessage = (error: DataSetError) => {
  switch (error.status) {
    case 400: {
      const missingIds = error.missing?.map((m) => m.id).join(', ');
      return error.missing?.length
        ? `Data set with id: ${missingIds} not found`
        : error.message;
    }
    default: {
      return error.message;
    }
  }
};
