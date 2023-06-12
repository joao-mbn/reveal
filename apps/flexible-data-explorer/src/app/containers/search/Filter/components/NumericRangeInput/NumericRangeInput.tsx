import * as React from 'react';
import { useState } from 'react';

import isUndefined from 'lodash/isUndefined';

import { Chip } from '@cognite/cogs.js';

import { useTranslation } from '../../../../../hooks/useTranslation';
import { InputControlProps } from '../../types';
import { NumberInput } from '../NumberInput';

import { Container } from './elements';

const PLACEHOLDER = '...';

export type NumericRangeInputProps = InputControlProps<'numeric-range'>;

export const NumericRangeInput: React.FC<NumericRangeInputProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  const [min, setMin] = useState<number | undefined>(value?.[0]);
  const [max, setMax] = useState<number | undefined>(value?.[1]);

  return (
    <Container>
      <NumberInput
        placeholder={PLACEHOLDER}
        value={min}
        onChange={(newMin) => {
          setMin(newMin);

          if (!isUndefined(max)) {
            onChange([newMin, max]);
          }
        }}
      />

      <Chip label={t('filter_AND', 'AND')} tooltipProps={{ disabled: true }} />

      <NumberInput
        placeholder={PLACEHOLDER}
        value={max}
        onChange={(newMax) => {
          setMax(newMax);

          if (!isUndefined(min)) {
            onChange([min, newMax]);
          }
        }}
      />
    </Container>
  );
};
