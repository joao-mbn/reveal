import { ApiClient } from 'utils';
import { RootDispatcher } from 'store/types';
import { Group } from '@cognite/sdk';
import { ADMIN_GROUP_NAME } from 'constants/cdf';
import { setHttpError } from 'store/notification/thunks';
import * as actions from './actions';

export const fetchUserGroups = (apiClient: ApiClient) => async (
  dispatch: RootDispatcher
) => {
  dispatch(actions.loadGroups());
  try {
    const groups: Group[] = await apiClient.getUserGroups();
    dispatch(actions.loadedGroups(groups));
  } catch (e) {
    dispatch(actions.loadGroupsError(e));
    dispatch(setHttpError('Failed to fetch user groups', e));
    // trach to sentry
  }
};

export const getGroupNames = (groups: Group[] = []): string[] =>
  groups.map((group) => group.name);

export const checkIsAdmin = (groups: Group[]): boolean =>
  getGroupNames(groups).includes(ADMIN_GROUP_NAME);
