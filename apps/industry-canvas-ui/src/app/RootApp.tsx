import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Loader } from '@data-exploration/components';
import {
  IndustryCanvasHomePage,
  IndustryCanvasPage,
} from '@fusion/industry-canvas';

import { getFlow } from '@cognite/cdf-sdk-singleton';
import { useSDK } from '@cognite/sdk-provider';

import { useUserInformation } from '@data-exploration-app/hooks/hooks';

import { ICProvider } from './ICProvider';

const Spinner = () => <Loader />;

export default function App() {
  const sdk = useSDK();
  const { flow } = getFlow();
  const { data: userInfo } = useUserInformation();

  return (
    <Suspense fallback={<Spinner />}>
      <ICProvider flow={flow} sdk={sdk} userInfo={userInfo}>
        <Routes>
          <Route
            path="/industrial-canvas"
            element={<IndustryCanvasHomePage />}
          />
          <Route
            path="/industrial-canvas/canvas"
            element={<IndustryCanvasPage />}
          />
        </Routes>
      </ICProvider>
    </Suspense>
  );
}