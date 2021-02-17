import { CdfClient, ApiClient } from 'utils';
import { SUITES_TABLE_NAME } from 'constants/cdf';
import { RootDispatcher } from 'store/types';
import { setNotification } from 'store/notification/actions';
import { setHttpError } from 'store/notification/thunks';
import { SuiteRow, Suite, SuiteRowInsert, SuiteRowDelete } from './types';
import * as actions from './actions';

export const fetchSuites = (apiClient: ApiClient) => async (
  dispatch: RootDispatcher
) => {
  dispatch(actions.loadSuitesTable());
  try {
    const suites: Suite[] = await getSuites(apiClient);
    dispatch(actions.loadedSuitesTable(suites as Suite[]));
  } catch (e) {
    dispatch(actions.loadSuitesTableFailed());
    dispatch(setHttpError(`Failed to fetch suites`, e));
    // track to Senrty
  }
};

export const insertSuite = (
  client: CdfClient,
  apiClient: ApiClient,
  suite: Suite
) => async (dispatch: RootDispatcher) => {
  dispatch(actions.insertSuiteTableRow());
  try {
    const suiteRow = fromSuiteToRow(suite);
    await client.insertTableRow(SUITES_TABLE_NAME, suiteRow);
    dispatch(fetchSuites(apiClient));
    dispatch(setNotification('Saved'));
  } catch (e) {
    dispatch(actions.suiteTableRowError());
    dispatch(setHttpError('Failed to save a suite', e));
    // track to Senrty
  }
};

export const deleteSuite = (
  client: CdfClient,
  apiClient: ApiClient,
  key: SuiteRowDelete[]
) => async (dispatch: RootDispatcher) => {
  try {
    dispatch(actions.deleteSuiteTableRow());
    await client.deleteTableRow(SUITES_TABLE_NAME, key);
    dispatch(fetchSuites(apiClient));
    dispatch(setNotification('Deleted successfully'));
  } catch (e) {
    dispatch(actions.suiteTableRowError());
    dispatch(setHttpError('Failed to delete a suite', e));
    // track to Senrty
  }
};

export const fetchImageUrls = (client: CdfClient, ids: string[]) => async (
  dispatch: RootDispatcher
) => {
  try {
    dispatch(actions.fetchImgUrls());
    const imgUrls = await client.getDownloadUrls(ids);
    dispatch(actions.fetchedImgUrls(imgUrls));
  } catch (e) {
    dispatch(actions.fetchImgUrlsFailed());
    dispatch(setHttpError('Failed to fetch image urls ', e));
    // track to Senrty
  }
};

async function getSuites(apiClient: ApiClient) {
  const { items: rows } = await apiClient.getSuitesRows();
  return getSuitesFromRows(rows);
}

function getSuitesFromRows(rows: SuiteRow[] = []): Suite[] {
  return rows.map(
    (row) =>
      ({
        key: row.key,
        lastUpdatedTime: row.lastUpdatedTime,
        ...row.columns,
      } as Suite)
  );
}

function fromSuiteToRow(suite: Suite) {
  const { key, ...rest } = suite;
  return [{ key, columns: rest }] as SuiteRowInsert[];
}
