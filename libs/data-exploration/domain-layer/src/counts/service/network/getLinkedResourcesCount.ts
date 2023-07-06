import {
  AggregateResponse,
  CogniteClient,
  CursorResponse,
  IdEither,
} from '@cognite/sdk';
import { SdkResourceType } from '@cognite/sdk-react-query-hooks';

type Payload = {
  resourceType: SdkResourceType;
  resourceId: IdEither;
};

export const getLinkedResourcesCount = (
  sdk: CogniteClient,
  payload: Payload
) => {
  const { resourceId, resourceType } = payload;

  return sdk
    .post<CursorResponse<AggregateResponse[]>>(
      `/api/v1/projects/${sdk.project}/${resourceType}/aggregate`,
      {
        headers: {
          'cdf-version': 'alpha',
        },
        data: {
          filter: {
            assetSubtreeIds: [resourceId],
          },
        },
      }
    )
    .then(({ data }) => {
      return data.items[0].count;
    })
    .catch(() => {
      return 0;
    });
};
