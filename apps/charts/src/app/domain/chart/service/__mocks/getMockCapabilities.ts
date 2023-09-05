import { MOCK_CAPABILITIES } from '@charts-app/domain/chart/service/__fixtures/capabilities';
import { TEST_BASE_URL } from '@charts-app/tests/testConstants';
import { rest, RequestHandler } from 'msw';

const inspectUrl = `${TEST_BASE_URL}/api/v1/token/inspect`;

export const getMockCapabilities = (): RequestHandler<any, any, any, any> => {
  return rest.get<Request>(inspectUrl, (_req, res, ctx) => {
    return res(ctx.json({ capabilities: MOCK_CAPABILITIES }));
  });
};