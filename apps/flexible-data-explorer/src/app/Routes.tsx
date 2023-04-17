import React from 'react';
import { Outlet, Routes as ReactRoutes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { useFusionQuery } from './hooks/useFusionQuery';

const Routes = () => {
  useFusionQuery();

  return (
    <ReactRoutes>
      <Route path="/" element={<Outlet />}>
        <Route index element={<HomePage />} />
      </Route>
    </ReactRoutes>
  );
};

export default Routes;