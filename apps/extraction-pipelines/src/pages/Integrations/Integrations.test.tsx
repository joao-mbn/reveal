import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { sdkv3 } from '@cognite/cdf-sdk-singleton';
import { QueryClient } from 'react-query';
import { act } from '@testing-library/react-hooks';
import Integrations from 'pages/Integrations/Integrations';
import { render } from 'utils/test';
import { getMockResponse, unauthorizedError } from 'utils/mockResponse';
import { renderWithReQueryCacheSelectedIntegrationContext } from 'utils/test/render';
import {
  CDF_ENV_GREENFIELD,
  ORIGIN_DEV,
  PROJECT_ITERA_INT_GREEN,
} from 'utils/baseURL';
// eslint-disable-next-line
import { useCapabilities } from '@cognite/sdk-react-query-hooks';
import { EXTPIPES_ACL_READ, INTEGRATIONS_ACL } from 'model/AclAction';

jest.mock('hooks/useRawDBAndTables', () => {
  return {
    useRawDBAndTables: jest.fn(),
  };
});

describe('Integrations', () => {
  beforeEach(() => {
    useCapabilities.mockReturnValue({
      isLoading: false,
      data: [{ acl: INTEGRATIONS_ACL, actions: ['READ', 'WRITE'] }],
    });
  });

  test('Render with out fail', async () => {
    sdkv3.get.mockResolvedValue({ data: { items: getMockResponse() } });
    sdkv3.datasets.retrieve.mockResolvedValue([]);
    const client = new QueryClient();
    const { wrapper } = renderWithReQueryCacheSelectedIntegrationContext(
      client,
      ORIGIN_DEV,
      PROJECT_ITERA_INT_GREEN,
      CDF_ENV_GREENFIELD
    );
    render(<Integrations />, { wrapper });
    await waitFor(() => {
      const sidePanelHeading = screen.getByRole('grid');
      expect(sidePanelHeading).toBeInTheDocument();
    });
  });

  test('Should render no integrations message when no integrations', async () => {
    sdkv3.get.mockResolvedValue({ data: { items: [] } });
    const queryCache = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    await act(async () => {
      const { wrapper } = renderWithReQueryCacheSelectedIntegrationContext(
        queryCache,
        ORIGIN_DEV,
        PROJECT_ITERA_INT_GREEN,
        CDF_ENV_GREENFIELD
      );
      render(<Integrations />, { wrapper });
      const errorMessage = await screen.findByText(/No integration/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test('Render error on fail', async () => {
    sdkv3.get.mockRejectedValue(unauthorizedError);
    const queryCache = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    await act(async () => {
      const { wrapper } = renderWithReQueryCacheSelectedIntegrationContext(
        queryCache,
        ORIGIN_DEV,
        PROJECT_ITERA_INT_GREEN,
        CDF_ENV_GREENFIELD
      );
      render(<Integrations />, { wrapper });
      const errorMessage = await screen.findByText(
        unauthorizedError.data.message
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test('Render permission error when user dont have access', async () => {
    sdkv3.get.mockRejectedValue(unauthorizedError);
    useCapabilities.mockReturnValue({
      isLoading: false,
      data: [{ acl: INTEGRATIONS_ACL, actions: [] }],
    });
    const queryCache = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    await act(async () => {
      const { wrapper } = renderWithReQueryCacheSelectedIntegrationContext(
        queryCache,
        ORIGIN_DEV,
        PROJECT_ITERA_INT_GREEN,
        CDF_ENV_GREENFIELD
      );
      render(<Integrations />, { wrapper });
      const errorMessage = await screen.findByText(
        `${EXTPIPES_ACL_READ.acl}:${EXTPIPES_ACL_READ.action}`
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
