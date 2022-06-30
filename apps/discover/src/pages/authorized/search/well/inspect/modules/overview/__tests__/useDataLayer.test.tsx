import 'domain/wells/__mocks/setupWellsMockSDK';
import { getMockConfigGet } from 'domain/projectConfig/service/__mocks/getMockConfigGet';
import { getMockUserMe } from 'domain/userManagementService/service/__mocks/getMockUserMe';
import { getMockTrajectoriesList } from 'domain/wells/trajectory/service/__mocks/getMockWellTrajectories';
import { getMockWellsById } from 'domain/wells/well/service/__mocks/getMockWellsById';

import { screen } from '@testing-library/react';
import { setupServer } from 'msw/node';

import { testRenderer } from '__test-utils/renderer';
import { getMockedStore } from '__test-utils/store.utils';

import { useDataLayer } from '../useDataLayer';

const mockServer = setupServer(
  getMockConfigGet(),
  getMockUserMe(),
  getMockTrajectoriesList(),
  getMockWellsById()
);

describe('Overview hook', () => {
  beforeAll(() => mockServer.listen());
  afterAll(() => mockServer.close());

  test('load overview data', async () => {
    const store = getMockedStore({
      wellInspect: {
        selectedWellIds: { 'test-well-1': true },
        selectedWellboreIds: { 'test-well-1': true },
      },
    });

    const TestComponent: React.FC = () => {
      const { overviewData, isLoading } = useDataLayer();

      if (isLoading && !overviewData.length) {
        return <div>Loading...</div>;
      }

      const [data] = overviewData;

      return (
        <section>
          <div>Name: {data?.name}</div>
          <div>Water-depth: {data?.waterDepth?.value}</div>
          <div>MD: {data?.md}</div>
          <div>TVD: {data?.tvd}</div>
        </section>
      );
    };

    testRenderer(TestComponent, store);

    const name = await screen.findByText('Name: wellbore B');
    expect(name).toBeInTheDocument();

    const waterDepth = await screen.findByText('Water-depth: 10');
    expect(waterDepth).toBeInTheDocument();

    const md = await screen.findByText('MD: 41');
    expect(md).toBeInTheDocument();

    const tvd = await screen.findByText('TVD: 32');
    expect(tvd).toBeInTheDocument();
  });
});
