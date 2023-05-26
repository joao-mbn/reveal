import * as React from 'react';

import { BaseFilterProps, Operator } from '../../types';
import { CommonFilter } from '../CommonFilter';

const CONFIG = {
  [Operator.IS_TRUE]: 'boolean',
  [Operator.IS_FALSE]: 'boolean',
  [Operator.IS_SET]: 'no-input',
  [Operator.IS_NOT_SET]: 'no-input',
} as const;

export type BooleanFilterProps = BaseFilterProps<typeof CONFIG>;

export const BooleanFilter: React.FC<BooleanFilterProps> = (props) => {
  return <CommonFilter config={CONFIG} {...props} />;
};