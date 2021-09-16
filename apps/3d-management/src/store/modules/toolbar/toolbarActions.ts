import { Dispatch } from 'redux';
import {
  GhostModeUpdated,
  SetNodePropertyFilter,
  SetNodePropertyLoadingState,
} from 'src/store/modules/toolbar/types';
import { RootState } from 'src/store';

import { NodePropertyFilterType } from 'src/utils';

export const toggleGhostMode = (isEnabled?: boolean) => (
  dispatch: Dispatch<GhostModeUpdated>,
  getState: () => RootState
) => {
  const { ghostModeEnabled } = getState().toolbar;
  dispatch({
    type: 'toolbar/ghostModeUpdated',
    payload: typeof isEnabled === 'undefined' ? !ghostModeEnabled : isEnabled,
  });
};

// filter

export const setNodeFilterLoadingState = (isLoading: boolean) => (
  dispatch: Dispatch<SetNodePropertyLoadingState>
) =>
  dispatch({
    type: 'toolbar/setNodePropertyFilterLoadingState',
    payload: isLoading,
  });

export const setNodePropertyFilter = (
  filter: NodePropertyFilterType | null
) => (dispatch: Dispatch<SetNodePropertyFilter>) =>
  dispatch({ type: 'toolbar/setNodePropertyFilterValue', payload: filter });
