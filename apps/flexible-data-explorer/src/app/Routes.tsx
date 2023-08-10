import { Outlet, Routes as ReactRoutes, Route } from 'react-router-dom';

import styled from 'styled-components';

import { RevealKeepAlive } from '@cognite/reveal-react-components';

import { SearchBar } from './containers/search/SearchBar';
import { SearchBarSwitch } from './containers/search/SearchBarSwitch';
import { useViewModeParams } from './hooks/useParams';
import { HomePage } from './pages/HomePage';
import { FilePage } from './pages/Instances/FilePage';
import { InstancesPage } from './pages/Instances/InstancesPage';
import { TimeseriesPage } from './pages/Instances/TimeseriesPage';
import { SearchPage } from './pages/SearchPage';
import { ThreeDPage } from './pages/ThreeDPage';
import { FDMProvider } from './providers/FDMProvider';

const ViewContainer = () => {
  const [viewMode] = useViewModeParams();

  if (viewMode === '3d') {
    return <ThreeDPage />;
  }

  return <Outlet />;
};

const Routes = () => {
  return (
    <RevealKeepAlive>
      <ReactRoutes>
        <Route
          element={
            <FDMProvider>
              <Outlet />
            </FDMProvider>
          }
        >
          <Route index element={<HomePage />} />

          <Route
            element={
              <Container>
                <Content>
                  <SearchBar width="1026px" inverted />
                  <SearchBarSwitch inverted />
                </Content>
                <ViewContainer />
              </Container>
            }
          >
            <Route path="search/:type?" element={<SearchPage />} />

            <Route path="timeseries/:externalId" element={<TimeseriesPage />} />
            <Route path="file/:externalId" element={<FilePage />} />
            <Route
              path="sequence/:externalId"
              element={
                <center>
                  <p>Work in progress...</p>
                </center>
              }
            />

            <Route path=":dataModel/:space/:version/">
              <Route
                path=":dataType/:instanceSpace/:externalId/overview?"
                element={<InstancesPage />}
              />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<p>404, page not found</p>} />
      </ReactRoutes>
    </RevealKeepAlive>
  );
};

export default Routes;

const Container = styled.div`
  height: calc(100% - var(--top-bar-height));
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
