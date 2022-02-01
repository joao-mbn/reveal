import { fireEvent, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';

import { getMockConfigGet } from '__mocks/getMockConfigGet';
import { getMockWellById } from '__mocks/getMockWellById';
import { getMockWell } from '__test-utils/fixtures/well/well';
import { testRenderer } from '__test-utils/renderer';
import { getMockedStore } from '__test-utils/store.utils';
import { LOADING_TEXT } from 'components/emptyState/constants';
import {
  FAVORITE_SET_NO_WELLS,
  REMOVE_FROM_SET_TEXT,
} from 'pages/authorized/favorites/constants';

import { FavoriteWellsTable, Props } from '../FavoriteWellTable';

const mockServer = setupServer(getMockWellById(), getMockConfigGet());

describe('Favorite Wellbore table', () => {
  const defaultTestInit = (viewProps?: Props, store = getMockedStore()) =>
    testRenderer(FavoriteWellsTable, store, viewProps);

  afterEach(async () => jest.clearAllMocks());
  beforeAll(() => mockServer.listen());
  afterAll(() => mockServer.close());

  it('should render table correctly', async () => {
    const well = getMockWell();
    await defaultTestInit({
      wells: {
        'test-well-1': [],
      },
      removeWell: jest.fn(),
      favoriteId: '1',
    });

    expect(screen.getAllByText(LOADING_TEXT).length).toEqual(2);
    // wait for everything to finish loading
    expect(await screen.findByText(well.name)).toBeInTheDocument();
    expect(screen.queryAllByText(LOADING_TEXT).length).toEqual(0);

    expect(screen.getByText(well.operator || '-error-')).toBeInTheDocument();
    expect(screen.getByText(well.field || '-error-')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.getByTestId('menu-button')).toBeInTheDocument();
  });

  it('should render the no well message', async () => {
    await defaultTestInit({
      wells: {},
      removeWell: jest.fn(),
      favoriteId: '1',
    });

    expect(await screen.findByText(FAVORITE_SET_NO_WELLS)).toBeInTheDocument();
  });

  it('should render loading message when `isLoading` is true and no data', async () => {
    await defaultTestInit({
      wells: {},
      removeWell: jest.fn(),
      favoriteId: '1',
    });
    expect(await screen.findByText(LOADING_TEXT)).toBeInTheDocument();
    expect(screen.getAllByText(LOADING_TEXT).length).toEqual(1);
  });

  it('should render remove button when hovering over the more options button', async () => {
    await defaultTestInit({
      wells: {
        'test-well-1': [],
      },
      removeWell: jest.fn(),
      favoriteId: '1',
    });

    // wait for everything to finish loading
    expect(await screen.findByText(getMockWell().name)).toBeInTheDocument();

    fireEvent.mouseEnter(screen.getByTestId('menu-button'), {
      bubbles: true,
    });
    expect(screen.getByText(REMOVE_FROM_SET_TEXT)).toBeInTheDocument();
  });
});
