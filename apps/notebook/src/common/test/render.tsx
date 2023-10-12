import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  render as testingLibraryRender,
  RenderOptions,
} from '@testing-library/react';

import sdk from '@cognite/cdf-sdk-singleton';
import { SDKProvider } from '@cognite/sdk-provider';

export const render = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) => {
  // This is where you can wrap your rendered UI component in redux stores,
  // providers, or anything else you might want.

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 10 * 60 * 1000,
      },
    },
  });

  const component = (
    <div className="cdf-ui-notebook-app-style-scope">
      <QueryClientProvider client={queryClient}>
        <SDKProvider sdk={sdk}>{ui}</SDKProvider>
      </QueryClientProvider>
    </div>
  );

  return testingLibraryRender(component, options);
};
