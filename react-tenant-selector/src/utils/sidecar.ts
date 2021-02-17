type SidecarConfig = {
  aadApplicationId?: string;
  AADTenantID?: string;
  applicationId: string;
  applicationName: string;
  appsApiBaseUrl: string;
  backgroundImage: string;
  cdfApiBaseUrl: string;
  cdfCluster: string;
  helpLink: string;
  locizeProjectId?: string;
};

const DEFAULT_SIDECAR: SidecarConfig = {
  // -- Bluefield -- (Azure)
  appsApiBaseUrl: 'https://apps-api.bluefield.cognite.ai',
  cdfApiBaseUrl: 'https://bluefield.cognitedata.com',

  // -- EW1 --
  // appsApiBaseUrl: 'https://apps-api.staging.cognite.ai',
  // cdfApiBaseUrl: 'https://api.cognitedata.com',

  // -- Greenfield --
  // appsApiBaseUrl: 'https://apps-api.greenfield.cognite.ai',
  // cdfApiBaseUrl: 'https://greenfield.cognitedata.com',

  applicationId: 'fas-demo',
  applicationName: 'Tenant Selector Test',
  backgroundImage: '',
  helpLink: '',

  // cdfCluster: 'greenfield',
  cdfCluster: 'bluefield',
  // cdfCluster: 'ew1',

  // for localhost testing:
  // locizeProjectId: 'dfcacf1f-a7aa-4cc2-94d7-de6ea4e66f1d', // tenant-selector project

  // use the demo app if you are testing this:
  AADTenantID: 'reactdemoapp.onmicrosoft.com',

  aadApplicationId: '7e8b0cb9-c1bf-46df-bf79-13cb1b19a8f8', // Demo App: bluefield (staging)
};

export default (): SidecarConfig => {
  // eslint-disable-next-line no-underscore-dangle
  return (window as any).__cogniteSidecar || DEFAULT_SIDECAR; // eslint-disable-line @typescript-eslint/no-explicit-any
};
