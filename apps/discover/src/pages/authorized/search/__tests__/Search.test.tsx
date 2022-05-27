import '__mocks/mockContainerAuth'; // should be first
import '__mocks/mockCogniteSDK';
import 'services/wellSearch/__mocks/setupWellsMockSDK';

import { getMockDocumentSearch } from 'domain/documents/service/__mocks/getMockDocumentSearch';
import { getMockUserMe } from 'domain/userManagementService/service/__mocks/getMockUserMe';

import { screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { Store } from 'redux';
import { getMockLabelsPost } from 'services/labels/__mocks/getMockLabels';
import { getMockConfigGet } from 'services/projectConfig/__mocks/getMockConfigGet';
import { getMockSavedSearchList } from 'services/savedSearches/__mocks/getMockSavedSearchList';
import { getMockSearchHistoryGet } from 'services/searchHistory/__mocks/getMockSearchHistoryGet';
import { getMockSummariesGet } from 'services/wellSearch/__mocks/getMockSummariesGet';
import { getMockWellSourceGet } from 'services/wellSearch/__mocks/getMockWellsSourcesGet';

import { testRenderer } from '__test-utils/renderer';
import { getMockedStore } from '__test-utils/store.utils';

import { Search } from '../Search';

jest.mock('../map/Map', () => {
  return () => <div>fake map</div>;
});

const mockServer = setupServer(
  getMockConfigGet(),
  getMockLabelsPost(),
  getMockDocumentSearch(),
  getMockSavedSearchList(),
  getMockSearchHistoryGet(),
  getMockSummariesGet(),
  getMockWellSourceGet(),
  getMockUserMe()
);

const page = (store: Store) => testRenderer(Search, store);

const defaultTestInit = async () => {
  const store = getMockedStore({
    resultPanel: {
      panelWidth: 1920,
      sortBy: { documents: [] },
    },
  });
  return { ...page(store) };
};

describe('Search', () => {
  beforeAll(() => mockServer.listen());
  afterAll(() => mockServer.close());

  it('should render the search content as expected', async () => {
    await defaultTestInit();
    expect(await screen.findByTestId('search-container')).toBeInTheDocument();
  });
});
