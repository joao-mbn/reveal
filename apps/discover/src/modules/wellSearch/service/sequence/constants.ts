import { SequenceColumn } from '@cognite/sdk';

import { TrajectoryColumnR } from 'modules/wellSearch/types';

export const TRAJECTORY_COLUMNS: TrajectoryColumnR[] = [
  {
    externalId: 'md',
    valueType: 'DOUBLE',
    name: 'md',
  },
  {
    externalId: 'azimuth',
    valueType: 'DOUBLE',
    name: 'azimuth',
  },
  {
    externalId: 'inclination',
    valueType: 'DOUBLE',
    name: 'inclination',
  },
  {
    externalId: 'tvd',
    valueType: 'DOUBLE',
    name: 'tvd',
  },
  {
    externalId: 'x_offset',
    valueType: 'DOUBLE',
    name: 'x_offset',
  },
  {
    externalId: 'y_offset',
    valueType: 'DOUBLE',
    name: 'y_offset',
  },
  {
    externalId: 'equivalent_departure',
    valueType: 'DOUBLE',
    name: 'equivalent_departure',
  },
];

export const TRAJECTORY_COLUMN_NAME_MAP = {
  md: 'measuredDepth',
  azimuth: 'azimuth',
  inclination: 'inclination',
  tvd: 'trueVerticalDepth',
  x_offset: 'eastOffset',
  y_offset: 'northOffset',
  equivalent_departure: 'equivalentDeparture',
};

export const SEQUENCE_COLUMNS = [
  {
    externalId: 'comp_md_top',
    valueType: 'DOUBLE',
    name: 'comp_md_top',
  },
  {
    externalId: 'comp_body_outside_diameter',
    valueType: 'DOUBLE',
    name: 'comp_body_outside_diameter',
  },
  {
    externalId: 'comp_body_inside_diameter',
    valueType: 'DOUBLE',
    name: 'comp_body_inside_diameter',
  },
] as SequenceColumn[];

export const CASINGS_COLUMN_NAME_MAP = {
  comp_md_top: 'originalMeasuredDepthTop',
  comp_body_outside_diameter: 'minOutsideDiameter',
  comp_body_inside_diameter: 'minInsideDiameter',
};
