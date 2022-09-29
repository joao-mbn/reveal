import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInjection } from '@platypus-app/hooks/useInjection';
import { TOKENS } from '@platypus-app/di';
import { Notification } from '@platypus-app/components/Notification/Notification';
import { useErrorLogger } from '@platypus-app/hooks/useErrorLogger';
import { QueryKeys } from '@platypus-app/utils/queryKeys';
import { useMixpanel } from '@platypus-app/hooks/useMixpanel';

export function useTransformation(
  type: string,
  externalId: string,
  isEnabled: boolean
) {
  const dataManagementHandler = useInjection(TOKENS.DataManagementHandler);
  const query = useQuery(
    QueryKeys.TRANSFORMATION(type, externalId),
    async () => {
      return dataManagementHandler.getTransformations(type, externalId);
    },
    {
      enabled: !type.includes('undefined') && isEnabled,
    }
  );

  return query;
}

export const useTransformationMutate = (
  typeKey: string,
  externalId: string
) => {
  const { track } = useMixpanel();
  const queryClient = useQueryClient();
  const dataManagementHandler = useInjection(TOKENS.DataManagementHandler);
  const errorLogger = useErrorLogger();

  return useMutation(
    async () => {
      const data = {
        externalId: `t_${externalId}_${typeKey}`,
        name: typeKey,
        destination: {
          type: 'data_model_instances',
          instanceSpaceExternalId: externalId,
          spaceExternalId: externalId,
          modelExternalId: typeKey,
        },
      };

      return dataManagementHandler.createTransformation(data);
    },
    {
      onSuccess: (transformation) => {
        queryClient.invalidateQueries(
          QueryKeys.TRANSFORMATION(
            transformation.destination.modelExternalId,
            transformation.destination.spaceExternalId
          )
        );
        track('Transformations', {
          dataModel: externalId,
        });
      },
      onError: (error: any) => {
        errorLogger.log(error);
        Notification({ type: 'error', message: error.message });
      },
    }
  );
};
