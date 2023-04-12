import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import styled from 'styled-components/macro';
import { ToastContainer } from '@cognite/cogs.js';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { getProject } from '@cognite/cdf-utilities';
import { queryClient } from './queryClient';

import Routes from './Routes';

function App() {
  const project = getProject();
  const basename = `${project}/explore`;

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer />
      <StyledWrapper>
        <Router
          basename={basename}
          window={window}
          children={
            <StyledPage>
              <Routes />
            </StyledPage>
          }
        />
      </StyledWrapper>
    </QueryClientProvider>
  );
}

export default App;

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  overflow: hidden;
`;

const StyledPage = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
`;
