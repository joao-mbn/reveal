import { SearchConfigDataType } from '../types';

export const searchConfigCommonColumns = [
  'Name',
  'Description / Content',
  'External Id',
  'ID',
  'Metadata',
];
export const SEARCH_CONFIG_LOCAL_STORAGE_KEY = 'SEARCH_CONFIG_KEY';

export const searchConfigData: SearchConfigDataType = {
  asset: {
    name: {
      label: 'Name',
      enabled: true,
    },
    description: {
      label: 'Description',
      enabled: true,
    },
    externalId: {
      label: 'External Id',
      enabled: true,
    },
    id: { label: 'ID', enabled: true },
    metadata: {
      label: 'Metadata',
      enabled: false,
    },
    source: {
      label: 'Source',
      enabled: false,
    },
    labels: {
      label: 'Labels',
      enabled: false,
    },
  },
  timeSeries: {
    name: {
      label: 'Name',
      enabled: true,
    },
    description: {
      label: 'Description',
      enabled: true,
    },
    externalId: { label: 'External Id', enabled: true },
    id: { label: 'ID', enabled: true },
    metadata: { label: 'Metadata', enabled: false },
    unit: { label: 'Unit', enabled: false },
  },
  file: {
    'sourceFile|name': {
      label: 'Name',
      enabled: true,
    },
    content: {
      label: 'Content',
      enabled: true,
    },
    externalId: { label: 'External Id', enabled: false },
    id: { label: 'ID', enabled: true },
    'sourceFile|metadata': {
      label: 'Metadata',
      enabled: false,
    },
    'sourceFile|source': {
      label: 'Source',
      enabled: false,
    },
    labels: { label: 'Label', enabled: false },
  },
  event: {
    type: {
      label: 'Type',
      enabled: false,
    },
    description: {
      label: 'Description',
      enabled: true,
    },
    externalId: { label: 'External Id', enabled: true },
    id: { label: 'ID', enabled: true },
    metadata: { label: 'Metadata', enabled: false },
    source: { label: 'Source', enabled: false },
    subtype: { label: 'Subtype', enabled: false },
  },
  sequence: {
    name: {
      label: 'Name',
      enabled: true,
    },
    description: {
      label: 'Description',
      enabled: true,
    },
    externalId: { label: 'External Id', enabled: true },
    id: { label: 'ID', enabled: true },
    metadata: { label: 'Metadata', enabled: false },
  },
};