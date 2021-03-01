import React from 'react';
import { INTEGRATIONS } from '../utils/baseURL';

export const LazyCreateIntegrationCreate = React.lazy(
  () =>
    import(
      '../pages/create/CreateIntegration'
      /* webpackChunkName: "pnid_integration_create" */
    )
);
export const LazyCreateIntegrationName = React.lazy(
  () =>
    import(
      '../pages/create/NamePage'
      /* webpackChunkName: "pnid_integration_create_name" */
    )
);
export const LazyCreateIntegrationExternalId = React.lazy(
  () =>
    import(
      '../pages/create/ExternalIdPage'
      /* webpackChunkName: "pnid_integration_create_external_id" */
    )
);
export const LazyCreateIntegrationDescription = React.lazy(
  () =>
    import(
      '../pages/create/DescriptionPage'
      /* webpackChunkName: "pnid_integration_create_description" */
    )
);
export const LazyCreateIntegrationContacts = React.lazy(
  () =>
    import(
      '../pages/create/ContactsPage'
      /* webpackChunkName: "pnid_integration_create_contacts" */
    )
);

export const LazyCreateIntegrationDataSet = React.lazy(
  () =>
    import(
      '../pages/create/DataSetPage'
      /* webpackChunkName: "pnid_integration_create_data_set" */
    )
);

export const LazyCreateIntegrationRawTable = React.lazy(
  () =>
    import(
      '../pages/create/RawTablePage'
      /* webpackChunkName: "pnid_integration_create_raw_table" */
    )
);
export const LazyCreateIntegrationRawTableConnect = React.lazy(
  () =>
    import(
      '../pages/create/ConnectRawTablesPage'
      /* webpackChunkName: "pnid_integration_create_raw_table_connect" */
    )
);

export const LazyCreateIntegrationSchedule = React.lazy(
  () =>
    import(
      '../pages/create/SchedulePage'
      /* webpackChunkName: "pnid_integration_create_schedule" */
    )
);

export const LazyCreateIntegrationDataSetId = React.lazy(
  () =>
    import(
      '../pages/create/DataSetIdPage'
      /* webpackChunkName: "pnid_integration_create_data_set_id" */
    )
);
const LazyCreateIntegrationCronExpression = React.lazy(
  () =>
    import(
      '../pages/create/CronPage'
      /* webpackChunkName: "pnid_integration_create_cron" */
    )
);

export const NAME_PATH = `name`;
export const NAME_PAGE_PATH = `/${INTEGRATIONS}/create/${NAME_PATH}`;
export const EXTERNAL_ID = `external-id`;
export const EXTERNAL_ID_PAGE_PATH = `/${INTEGRATIONS}/create/${EXTERNAL_ID}`;
export const DESCRIPTION = `description`;
export const DESCRIPTION_PAGE_PATH = `/${INTEGRATIONS}/create/${DESCRIPTION}`;
const CONTACTS = `contacts`;
export const CONTACTS_PAGE_PATH = `/${INTEGRATIONS}/create/${CONTACTS}`;
const SCHEDULE = `schedule`;
export const SCHEDULE_PAGE_PATH = `/${INTEGRATIONS}/create/${SCHEDULE}`;
const DATA_SET = `dataset`;
export const DATA_SET_PAGE_PATH = `/${INTEGRATIONS}/create/${DATA_SET}`;
const DATA_SET_ID = `dataset-id`;
export const DATA_SET_ID_PAGE_PATH = `/${INTEGRATIONS}/create/${DATA_SET_ID}`;
const CRON = `cron`;
export const CRON_PAGE_PATH = `/${INTEGRATIONS}/create/${CRON}`;
const RAW_TABLES = `raw-table`;
export const RAW_TABLE_PAGE_PATH = `/${INTEGRATIONS}/create/${RAW_TABLES}`;
const RAW_TABLE_LIST = `raw-table-list`;
export const CONNECT_RAW_TABLES_PAGE_PATH = `/${INTEGRATIONS}/create/${RAW_TABLE_LIST}`;
const META_DATA = `meta-data`;
export const METADATA_PAGE_PATH = `/${INTEGRATIONS}/create/${META_DATA}`;
export const CREATE_INTEGRATION_PAGE_PATH = `/${INTEGRATIONS}/create`;

export const createIntegrationRoutes = [
  {
    name: 'Create integration - Intro',
    path: `/:tenant${CREATE_INTEGRATION_PAGE_PATH}`,
    exact: true,
    component: LazyCreateIntegrationCreate,
  },
  {
    name: 'Create integration - name',
    path: `/:tenant${NAME_PAGE_PATH}`,
    component: LazyCreateIntegrationName,
  },
  {
    name: 'Create integration - external id',
    path: `/:tenant${EXTERNAL_ID_PAGE_PATH}`,
    component: LazyCreateIntegrationExternalId,
  },
  {
    name: 'Create integration - description',
    path: `/:tenant${DESCRIPTION_PAGE_PATH}`,
    exact: true,
    component: LazyCreateIntegrationDescription,
  },
  {
    name: 'Create integration - contacts',
    path: `/:tenant${CONTACTS_PAGE_PATH}`,
    exact: true,
    component: LazyCreateIntegrationContacts,
  },
  {
    name: 'Create integration - data set',
    path: `/:tenant${DATA_SET_PAGE_PATH}`,
    exact: true,
    component: LazyCreateIntegrationDataSet,
  },
  {
    name: 'Create integration - Raw Tables',
    path: `/:tenant${RAW_TABLE_PAGE_PATH}`,
    exact: true,
    component: LazyCreateIntegrationRawTable,
  },
  {
    name: 'Create integration - Raw Tables connect',
    path: `/:tenant${CONNECT_RAW_TABLES_PAGE_PATH}`,
    exact: true,
    component: LazyCreateIntegrationRawTableConnect,
  },
  {
    name: 'Create integration - schedule',
    path: `/:tenant${SCHEDULE_PAGE_PATH}`,
    exact: true,
    component: LazyCreateIntegrationSchedule,
  },
  {
    name: 'Create integration - schedule cron',
    path: `/:tenant${CRON_PAGE_PATH}`,
    exact: true,
    component: LazyCreateIntegrationCronExpression,
  },
  {
    name: 'Create integration - Data set id',
    path: `/:tenant${DATA_SET_ID_PAGE_PATH}`,
    exact: true,
    component: LazyCreateIntegrationDataSetId,
  },
];
