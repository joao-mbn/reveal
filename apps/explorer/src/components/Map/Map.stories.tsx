import { CogniteClient } from '@cognite/sdk';
import SIDECAR from 'utils/sidecar';

import Map from './Map';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Map',
};

export const Base = () => {
  const client = new CogniteClient({
    project: 'atlas-greenfield',
    appId: SIDECAR.applicationId,
    baseUrl: SIDECAR.cdfApiBaseUrl,
    getToken: () => Promise.resolve('123'),
  });
  return (
    <Map
      client={client!}
      modelOptions={{
        modelId: 3838447502587280,
        revisionId: 8081245322726425,
      }}
      setNodeIdInUrl={() => null}
    />
  );
};
