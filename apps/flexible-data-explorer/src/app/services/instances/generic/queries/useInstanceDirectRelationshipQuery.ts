import { useQuery } from '@tanstack/react-query';

import {
  useDataModelPathParams,
  useInstancePathParams,
} from '../../../../hooks/usePathParams';
import { useFDM } from '../../../../providers/FDMProvider';
import { queryKeys } from '../../../queryKeys';
import { DataModelV2, Instance } from '../../../types';

export const useInstanceDirectRelationshipQuery = <T = any>(
  {
    type,
    field,
  }: {
    field: string;
    type: string;
  },
  {
    instance,
    model,
  }: {
    instance?: Instance;
    model?: DataModelV2;
  } = {},
  {
    suspense,
    enabled,
  }: {
    suspense?: boolean;
    enabled?: boolean;
  } = {}
) => {
  const client = useFDM();

  const dataModelPathParam = useDataModelPathParams();
  const instancePathParam = useInstancePathParams();

  const { dataType, instanceSpace, externalId } = instance || instancePathParam;
  const { dataModel, version, space } = model
    ? { ...model, dataModel: model.externalId }
    : dataModelPathParam;

  return useQuery(
    queryKeys.instanceDirect(
      { dataType, instanceSpace, externalId },
      { externalId: dataModel, version, space },
      { type, field }
    ),
    async () => {
      if (
        !(
          dataType &&
          externalId &&
          instanceSpace &&
          dataModel &&
          version &&
          space
        )
      ) {
        return Promise.reject(new Error('Missing headers...'));
      }

      const instance = await client.getDirectRelationshipInstancesById(
        {
          relatedType: type,
          relatedField: field,
        },
        {
          dataModel,
          version,
          space,
          dataType,
          instanceSpace,
          externalId,
        }
      );

      return instance[field] as T;
    },
    {
      suspense,
      enabled,
    }
  );
};