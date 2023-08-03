import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import styled, { ThemeProvider } from 'styled-components';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserHistory } from 'history';

import sdk, { loginAndAuthIfNeeded } from '@cognite/cdf-sdk-singleton';
import {
  AuthContainer,
  isUsingUnifiedSignin,
  PageTitle,
} from '@cognite/cdf-utilities';
import { FlagProvider } from '@cognite/react-feature-flags';

import ErrorBoundary from './components/ErrorBoundary';
import { ModelRoutes } from './ModelRoutes';
import configureStore from './store';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';
import { APP_TITLE, projectName } from './utils';

export const App = () => {
  const history = createBrowserHistory();
  const store = configureStore(history);
  const subAppName = 'cdf-3d-management';
  const baseUrl = isUsingUnifiedSignin() ? '/cdf' : '';
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <GlobalStyles>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <FlagProvider
              appName={subAppName}
              apiToken="v2Qyg7YqvhyAMCRMbDmy1qA6SuG8YCBE"
              projectName={projectName}
            >
              <AuthContainer
                title={APP_TITLE}
                sdk={sdk}
                login={loginAndAuthIfNeeded}
              >
                <Provider store={store}>
                  <BrowserRouter basename={baseUrl}>
                    <ThreeDAppWrapper>
                      <PageTitle title={APP_TITLE} />
                      <ReactQueryDevtools initialIsOpen={false} />
                      <ModelRoutes />
                    </ThreeDAppWrapper>
                  </BrowserRouter>
                </Provider>
              </AuthContainer>
            </FlagProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </GlobalStyles>
  );
};

export default App;

const ThreeDAppWrapper = styled.div`
  padding: 24px 40px;
`;
