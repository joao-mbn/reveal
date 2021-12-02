import { CogniteEvent } from '@cognite/sdk';

import { createdAndLastUpdatedTime } from './log';

export const mockCogniteEvent: CogniteEvent = {
  assetIds: [759155409324883], // wellbore id
  ...createdAndLastUpdatedTime,
  id: 1,
};

export const mockCogniteEventList: CogniteEvent[] = [
  {
    assetIds: [12, 10],
    ...createdAndLastUpdatedTime,
    id: 1,
  },
  {
    assetIds: [5],
    ...createdAndLastUpdatedTime,
    id: 1,
  },
  {
    ...createdAndLastUpdatedTime,
    id: 1,
  },
  { assetIds: [], ...createdAndLastUpdatedTime, id: 1 },
];
