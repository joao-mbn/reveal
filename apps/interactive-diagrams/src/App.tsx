import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import debounce from 'lodash/debounce';

import sdk, { loginAndAuthIfNeeded } from '@cognite/cdf-sdk-singleton';
import {
  AuthWrapper,
  SubAppWrapper,
  getProject,
  getEnv,
} from '@cognite/cdf-utilities';
import { Loader } from '@cognite/cogs.js';
import cogsStyles from '@cognite/cogs.js/dist/cogs.css';
import { SDKProvider } from '@cognite/sdk-provider';

import { AppStateProvider } from './context';
import { setItemInStorage } from './hooks';
import RootApp from './pages/App';
import { root } from './routes/paths';
import store, { loadLocalStorage, persistedState } from './store';
import { LS_KEY_PREFIX } from './stringConstants';
import { AntStyles, GlobalStyles } from './styles';

const App = () => {
  const project = getProject();
  const env = getEnv();
  const LS_KEY = `${LS_KEY_PREFIX}_${project}`;

  const updateLocalStorage = debounce(() => {
    const localStorageContent = persistedState(store.getState());
    setItemInStorage(LS_KEY, localStorageContent);
  }, 333);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 10 * 60 * 1000, // Pretty long
      },
    },
  });

  store.subscribe(updateLocalStorage);

  useEffect(() => {
    loadLocalStorage(LS_KEY, store);
  }, [LS_KEY]);

  useEffect(() => {
    if (cogsStyles?.use) cogsStyles.use();
    return () => {
      if (cogsStyles?.unuse) cogsStyles.unuse();
    };
  }, []);

  return (
    // If styles are broken please check: .rescripts#PrefixWrap(
    <GlobalStyles>
      <AntStyles>
        <AuthWrapper
          loadingScreen={<Loader darkMode={false} />}
          login={() => loginAndAuthIfNeeded(project, env)}
        >
          <SDKProvider sdk={sdk}>
            <QueryClientProvider client={queryClient}>
              <AppStateProvider>
                <Provider store={store}>
                  <SubAppWrapper title="Interactive Engineering Diagrams">
                    <BrowserRouter>
                      <Routes>
                        <Route
                          path={`/:project/${root}/*`}
                          element={<RootApp />}
                        />
                      </Routes>
                    </BrowserRouter>
                  </SubAppWrapper>
                </Provider>
              </AppStateProvider>
            </QueryClientProvider>
          </SDKProvider>
        </AuthWrapper>
      </AntStyles>
    </GlobalStyles>
  );
};

export default App;