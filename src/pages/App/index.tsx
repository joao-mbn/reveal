import React, { useEffect, useMemo, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useRouteMatch,
  useHistory,
  Route,
  Switch,
  Redirect,
  useLocation,
} from 'react-router-dom';
import { RootState } from 'store';
import sdk, { getAuthState } from 'sdk-singleton';
import queryString from 'query-string';
import { trackUsage } from 'utils/Metrics';
import { setCdfEnv, setTenant, fetchUserGroups } from 'modules/app';
import {
  Loader,
  FileContextualizationContextProvider,
  DataExplorationProvider,
} from '@cognite/data-exploration';
import { ResourceActionsProvider } from 'context/ResourceActionsContext';
import { ResourceSelectionProvider } from 'context/ResourceSelectionContext';
import NotFound from 'pages/NotFound';
import { staticRoot } from 'routes/paths';

const Routes = React.lazy(() => import('routes'));

export default function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { location } = history;
  const { username } = getAuthState();
  const { pathname, search, hash } = useLocation();

  const cdfEnv = queryString.parse(window.location.search).env as string;
  const {
    params: { tenant },
  } = useRouteMatch<{ tenant: string }>();

  useEffect(() => {
    const init = () => {
      dispatch(setTenant({ tenant }));
      dispatch(setCdfEnv({ cdfEnv }));
      dispatch(fetchUserGroups());
    };
    init();
  }, [dispatch, tenant, cdfEnv]);

  const cdfEnvStore = useSelector((state: RootState) => state.app.cdfEnv);

  useEffect(() => {
    if (cdfEnvStore && !cdfEnv) {
      // if env is not visible via URL add it in
      history.replace({
        pathname: location.pathname,
        search: `?env=${cdfEnvStore}`,
      });
    }
  }, [cdfEnv, cdfEnvStore, history, location.pathname]);

  useEffect(() => {
    trackUsage('App.Load');
  }, [username]);

  useEffect(() => {
    trackUsage('App.navigation');
  }, [location]);

  return (
    <Suspense fallback={<Loader />}>
      <FileContextualizationContextProvider>
        <ResourceSelectionProvider allowEdit mode="multiple">
          <ResourceActionsProvider>
            <DataExplorationProvider sdk={sdk}>
              <Switch>
                <Redirect
                  from="/:url*(/+)"
                  to={{
                    pathname: pathname.slice(0, -1),
                    search,
                    hash,
                  }}
                />
                <Route
                  key={staticRoot}
                  path={staticRoot}
                  component={useMemo(() => Routes, [])}
                />
                <Route path="/:tenant/*" component={() => <NotFound />} />
              </Switch>
            </DataExplorationProvider>
          </ResourceActionsProvider>
        </ResourceSelectionProvider>
      </FileContextualizationContextProvider>
    </Suspense>
  );
}
