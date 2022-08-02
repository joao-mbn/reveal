import GlobalStyles from 'global-styles';
import sidecar from 'utils/sidecar';
import { Loader } from '@cognite/cogs.js';
import { ContainerWithoutI18N, AuthConsumer } from '@cognite/react-container';
import { AppRouter } from 'pages/App/AppRouter';
import { ProvideAuthSetup } from 'components/ProvideAuthSetup';
import { RecoilRoot } from 'recoil';
import { MapProvider } from 'components/Map/MapProvider';

const App = () => (
  <ContainerWithoutI18N sidecar={sidecar}>
    <>
      <GlobalStyles />
      <AuthConsumer>
        {(authState) => {
          if (!authState || !authState.authState?.authenticated) {
            return <Loader />;
          }

          return (
            <ProvideAuthSetup authState={authState}>
              <MapProvider>
                <RecoilRoot>
                  <AppRouter />
                </RecoilRoot>
              </MapProvider>
            </ProvideAuthSetup>
          );
        }}
      </AuthConsumer>
    </>
  </ContainerWithoutI18N>
);

export default App;
