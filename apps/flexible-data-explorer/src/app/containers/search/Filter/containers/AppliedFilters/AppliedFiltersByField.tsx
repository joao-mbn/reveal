import * as React from 'react';

import unset from 'lodash/unset';

import { Chip } from '@cognite/cogs.js';

import { ValueByField } from '../../types';

import { getChipLabel } from './utils';

export interface AppliedFiltersByFieldProps {
  dataType?: string;
  value?: ValueByField;
  onRemove?: (value: ValueByField) => void;
}

export const AppliedFiltersByField: React.FC<AppliedFiltersByFieldProps> = ({
  dataType,
  value = {},
  onRemove,
}) => {
  const handleRemove = (field: string) => {
    const newValue = { ...value };
    unset(newValue, field);

    onRemove?.(newValue);
  };

  return (
    <>
      {Object.entries(value).map(([field, fieldValue]) => {
        const label = getChipLabel({ dataType, field, fieldValue });

        return (
          <Chip
            key={label}
            type="neutral"
            label={label}
            onRemove={() => handleRemove(field)}
          />
        );
      })}
    </>
  );
};