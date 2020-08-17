import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Button } from '@cognite/cogs.js';
import { RenderResourceActionsFunction } from 'types/Types';
import styled from 'styled-components';
import ResourceActionsContext from 'context/ResourceActionsContext';
import { FileExplorer } from 'containers/Files';
import { AssetExplorer } from 'containers/Assets';
import { SequenceExplorer } from 'containers/Sequences';
import { TimeseriesExplorer } from 'containers/Timeseries';
import { useHistory } from 'react-router';
import { useTenant } from 'hooks/CustomHooks';
import ResourceSelectionContext, {
  ResourceItem,
} from 'context/ResourceSelectionContext';
import { ExplorationNavbar } from './ExplorationNavbar';

const Wrapper = styled.div`
  flex: 1;
  width: 100vw;
  height: calc(100vh - 64px);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
`;

export const Explorer = () => {
  const history = useHistory();
  const tenant = useTenant();
  const { add, remove } = useContext(ResourceActionsContext);
  const { setOnSelectListener, setResourcesState } = useContext(
    ResourceSelectionContext
  );
  const [cart, setCart] = useState<ResourceItem[]>([]);

  const { pathname } = history.location;

  const renderResourceActions: RenderResourceActionsFunction = useCallback(
    ({ fileId, assetId, timeseriesId, sequenceId }) => {
      const viewButton = () => {
        let resourceName = '';
        let path = '';
        if (assetId) {
          resourceName = 'Asset';
          path = `asset/${assetId}`;
        }
        if (timeseriesId) {
          resourceName = 'Time Series';
          path = `timeseries/${timeseriesId}`;
        }
        if (fileId) {
          resourceName = 'File';
          path = `file/${fileId}`;
        }
        if (sequenceId) {
          resourceName = 'Sequence';
          path = `sequence/${sequenceId}`;
        }
        if (!pathname.includes(path)) {
          return (
            <Button
              type="secondary"
              key="view"
              onClick={() => {
                window.dispatchEvent(new Event('Resource Selected'));
                history.push(`/${tenant}/explore/${path}`);
              }}
              icon="ArrowRight"
            >
              View {resourceName}
            </Button>
          );
        }
        return null;
      };

      return [viewButton()];
    },
    [tenant, history, pathname]
  );

  useEffect(() => {
    add('explore', renderResourceActions);
  }, [add, renderResourceActions]);

  useEffect(() => {
    return () => {
      remove('explore');
    };
  }, [remove]);

  useEffect(() => {
    setOnSelectListener(() => (item: ResourceItem) => {
      const index = cart.findIndex(
        el => el.type === item.type && el.id === item.id
      );
      if (index > -1) {
        setCart(cart.slice(0, index).concat(cart.slice(index + 1)));
      } else {
        setCart(cart.concat([item]));
      }
    });
  }, [setOnSelectListener, cart]);

  useEffect(() => {
    setResourcesState(cart.map(el => ({ ...el, state: 'selected' })));
  }, [setResourcesState, cart]);

  const match = useRouteMatch();
  let showSearch = false;
  if (
    pathname.endsWith('/file') ||
    pathname.endsWith(match.path) ||
    pathname.endsWith(`${match.path}/`)
  ) {
    showSearch = true;
  }

  return (
    <Wrapper>
      <ExplorationNavbar
        cart={cart}
        setCart={setCart}
        showSearch={showSearch}
      />
      <Switch>
        <Route path={`${match.path}/file/:fileId?`} component={FileExplorer} />
        <Route
          path={`${match.path}/asset/:assetId?`}
          component={AssetExplorer}
        />
        <Route
          path={`${match.path}/sequence/:sequenceId?`}
          component={SequenceExplorer}
        />
        <Route
          path={`${match.path}/timeseries/:timeseriesId?`}
          component={TimeseriesExplorer}
        />
      </Switch>
    </Wrapper>
  );
};
