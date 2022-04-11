import { rest } from 'msw';
import { TEST_PROJECT } from 'setupTests';

import { Well, WellItems } from '@cognite/sdk-wells-v3';

import { getMockWell } from '__test-utils/fixtures/well/well';
import { MSWRequest } from '__test-utils/types';
import { SIDECAR } from 'constants/app';

export const getMockWellsById = (customData?: Well[]): MSWRequest => {
  const url = `https://${SIDECAR.cdfCluster}.cognitedata.com/api/playground/projects/${TEST_PROJECT}/wdl/wells/byids`;

  // console.log('STARTING MOCK', url);

  return rest.post<{ items: { matchingId: string }[] }>(
    url,
    (req, res, ctx) => {
      const items =
        customData ||
        req.body.items.map(({ matchingId }) => {
          return getMockWell({ matchingId });
        });
      const responseData: WellItems = {
        items,
        nextCursor: undefined,
      };
      return res(ctx.json(responseData));
    }
  );
};
