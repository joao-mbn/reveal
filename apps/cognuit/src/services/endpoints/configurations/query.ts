import { reportException } from '@cognite/react-errors';
import ApiContext from 'contexts/ApiContext';
import APIErrorContext from 'contexts/APIErrorContext';
import { useIsTokenAndApiValid } from 'hooks/useIsTokenAndApiValid';
import { useContext } from 'react';
import { useQuery } from 'react-query';
import { CONFIGURATIONS_KEYS } from 'services/configs/queryKeys';
import { CustomError } from 'services/CustomError';

const useConfigurationsQuery = () => {
  const { api } = useContext(ApiContext);
  const { addError, removeError } = useContext(APIErrorContext);

  const isValid = useIsTokenAndApiValid();

  const { data, ...rest } = useQuery(
    CONFIGURATIONS_KEYS.default,
    async () => {
      return api!.configurations.get();
    },
    {
      enabled: isValid,
      onSuccess: (data) => {
        removeError();
        return data;
      },
      onError: (error: CustomError) => {
        reportException(error);
        addError(error.message, error.status);
      },
    }
  );

  return { data: data || [], ...rest };
};

export { useConfigurationsQuery };
