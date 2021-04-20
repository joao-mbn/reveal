import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { QueryClient } from 'react-query';
import moment from 'moment';
import { renderWithSelectedIntegrationContext } from 'utils/test/render';
import { getMockResponse } from 'utils/mockResponse';
import { INTEGRATIONS } from 'utils/baseURL';
import { TableHeadings } from 'components/table/IntegrationTableCol';
import { DetailFieldNames } from 'model/Integration';
import {
  DOCUMENTATION_HEADING,
  GENERAL_INFO_HEADING,
  NO_SCHEDULE,
  SINGLE_INTEGRATION,
} from 'utils/constants';
import { IntegrationView } from 'components/integration/IntegrationView';
import { trackUsage } from 'utils/Metrics';
import { sdkv3 } from '@cognite/cdf-sdk-singleton';

describe('IntegrationView', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  test('Displays integration', async () => {
    const mockIntegration = getMockResponse()[0];
    sdkv3.get.mockResolvedValue({ data: mockIntegration });
    renderWithSelectedIntegrationContext(<IntegrationView />, {
      initIntegration: mockIntegration,
      client: new QueryClient(),
      route: `${INTEGRATIONS}/${mockIntegration.id}`,
    });
    // test tracking
    expect(trackUsage).toHaveBeenCalledTimes(1);
    expect(trackUsage).toHaveBeenCalledWith(SINGLE_INTEGRATION, {
      id: mockIntegration.id,
    });
    await waitFor(() => {
      screen.getAllByText(new RegExp(TableHeadings.NAME, 'i'));
      screen.getByText(GENERAL_INFO_HEADING);
      screen.getByText(DOCUMENTATION_HEADING);
    });
    expect(
      screen.getAllByText(new RegExp(TableHeadings.NAME, 'i')).length
    ).toEqual(2); // integration name heading, contacts heading name
    expect(screen.getByText(mockIntegration.name)).toBeInTheDocument();

    expect(
      screen.getByText(new RegExp(DetailFieldNames.EXTERNAL_ID, 'i'))
    ).toBeInTheDocument();
    expect(screen.getByText(mockIntegration.externalId)).toBeInTheDocument();

    expect(
      screen.getByText(new RegExp(DetailFieldNames.ID, 'i'))
    ).toBeInTheDocument();
    expect(screen.getByText(mockIntegration.id)).toBeInTheDocument();

    expect(
      screen.getByText(new RegExp(DetailFieldNames.CREATED_BY, 'i'))
    ).toBeInTheDocument();
    expect(screen.getByText(mockIntegration.createdBy)).toBeInTheDocument();

    expect(
      screen.getByText(new RegExp(DetailFieldNames.CREATED_TIME, 'i'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(moment(mockIntegration.createdTime).fromNow())
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(DetailFieldNames.LAST_UPDATED_TIME, 'i'))
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(new RegExp(TableHeadings.SCHEDULE, 'i')).length
    ).toEqual(2); // general info and top bar
    expect(screen.getAllByText('At 09:00 AM').length).toEqual(2);

    expect(
      screen.getByText(new RegExp(DetailFieldNames.DESCRIPTION, 'i'))
    ).toBeInTheDocument();
    expect(screen.getByText(mockIntegration.description)).toBeInTheDocument();
  });

  test('Renders with minimal required info', async () => {
    const mockIntegration = {
      id: 123,
      externalId: 'lisa.external.id',
      name: 'My integration',
    };
    sdkv3.get.mockResolvedValue({ data: mockIntegration });
    renderWithSelectedIntegrationContext(<IntegrationView />, {
      initIntegration: mockIntegration,
      client: new QueryClient(),
      route: `${INTEGRATIONS}/${mockIntegration.id}`,
    });
    await waitFor(() => {
      screen.getByText(mockIntegration.externalId);
    });
    expect(screen.getByText(mockIntegration.externalId)).toBeInTheDocument();
    expect(screen.getByText(mockIntegration.id)).toBeInTheDocument();
    expect(screen.getByText(mockIntegration.name)).toBeInTheDocument();
    expect(screen.getAllByText(NO_SCHEDULE).length).toEqual(2);
  });
});
