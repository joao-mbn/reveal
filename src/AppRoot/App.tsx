import React, { useEffect, useMemo, useState } from 'react';
import { usePossibleTenant } from 'hooks';
import { validateTenant } from 'utils/tenant';
import {
  createBrowserHistory as createNewBrowserHistory,
  History,
} from 'history';
import Authentication from './Authentication';
import AppProviders from './AppProviders';

const AppRoot = (): JSX.Element => {
  const tenant = usePossibleTenant();

  const history = useMemo(() => createBrowserHistory(tenant), [tenant]);

  const [tenantOk, setTenantOk] = useState(false);

  useEffect(() => {
    validateTenant(tenant).then((valid) => {
      if (valid) {
        setTenantOk(valid);
      } else if (tenant) {
        window.location.pathname = '/';
      }
    });
  }, [tenant]);

  if (!tenantOk || !tenant) {
    return <></>;
  }

  return (
    <AppProviders history={history} tenant={tenant}>
      <Authentication />
    </AppProviders>
  );
};

const createBrowserHistory = (possibleTenant: string): History =>
  createNewBrowserHistory({
    basename: possibleTenant,
  });

export default AppRoot;
