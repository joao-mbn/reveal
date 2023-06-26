import * as React from 'react';

import { translationKeys } from '../../../../../common';
import { useTranslation } from '../../../../../hooks/useTranslation';
import { InputControlProps } from '../../types';
import { Input } from '../Input';

export const DEFAULT_NUMBER_INPUT_PLACEHOLDER = 'Enter value...';

export interface NumberInputProps extends InputControlProps<number> {
  placeholder?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <Input
      type="number"
      variant="default"
      placeholder={
        placeholder ??
        t(
          translationKeys.filterNumberInputPlaceholder,
          DEFAULT_NUMBER_INPUT_PLACEHOLDER
        )
      }
      value={value}
      onChange={(inputValue) => onChange(Number(inputValue))}
    />
  );
};