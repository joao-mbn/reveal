import '@cognite/cogs.js/dist/cogs.css';
import { AuthProvider } from '@cognite/auth-react';
import { I18nWrapper } from '@cognite/cdf-i18n-utils';

import App from './app/App';
import { translations } from './app/common';
import { AuthProvider as InternalAuthProvider } from './app/common/auth/AuthProvider';
import GlobalStyle from './app/utils/globalStyles';
import GlobalStyles from './GlobalStyles';

export const AppWrapper = () => {
  const projectName = 'flexible-data-explorer';

  return (
    <GlobalStyles>
      <I18nWrapper translations={translations} defaultNamespace={projectName}>
        <AuthProvider>
          <InternalAuthProvider>
            <App />
          </InternalAuthProvider>
        </AuthProvider>
      </I18nWrapper>
      <GlobalStyle />
    </GlobalStyles>
  );
};