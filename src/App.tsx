import { I18nWrapper } from '@cognite/cdf-i18n-utils';
import sdk, { loginAndAuthIfNeeded } from '@cognite/cdf-sdk-singleton';
import {
  AuthWrapper,
  getEnv,
  getProject,
  SubAppWrapper,
} from '@cognite/cdf-utilities';
import { Loader } from '@cognite/cogs.js';
import { SDKProvider } from '@cognite/sdk-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { translations } from 'common/i18n';
import Home from 'pages/Home';
import GlobalStyles from 'styles/GlobalStyles';
import { FlagProvider } from '@cognite/react-feature-flags';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Details from 'pages/Details';
import QuickMatch from 'pages/QuickMatch';
import CreatePipeline from 'pages/CreatePipeline';

const queryClient = new QueryClient();
const env = getEnv();
const project = getProject();

const App = () => {
  return (
    <FlagProvider
      appName="cdf-ui-entity-matching"
      apiToken="v2Qyg7YqvhyAMCRMbDmy1qA6SuG8YCBE"
      projectName={project}
    >
      <I18nWrapper
        translations={translations}
        defaultNamespace="entity-matching"
      >
        <QueryClientProvider client={queryClient}>
          <GlobalStyles>
            <SubAppWrapper title="Entity matching">
              <AuthWrapper
                loadingScreen={<Loader />}
                login={() => loginAndAuthIfNeeded(project, env)}
              >
                <SDKProvider sdk={sdk}>
                  <BrowserRouter>
                    <Routes>
                      <Route
                        path="/:projectName/:subAppPath"
                        element={<Home />}
                      />
                      <Route
                        path="/:projectName/:subAppPath/quick-match"
                        element={<QuickMatch />}
                      />
                      <Route
                        path="/:projectName/:subAppPath/create"
                        element={<CreatePipeline />}
                      />
                      <Route
                        path="/:projectName/:subAppPath/:id"
                        element={<Details />}
                      />
                    </Routes>
                  </BrowserRouter>
                </SDKProvider>
              </AuthWrapper>
            </SubAppWrapper>
          </GlobalStyles>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </I18nWrapper>
    </FlagProvider>
  );
};

export default App;
