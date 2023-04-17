import { components, OptionProps, OptionTypeBase } from 'react-select';

import { Checkbox } from '@cognite/cogs.js';

import { formatBigNumbersWithSuffix } from '@data-exploration-lib/core';

import isUndefined from 'lodash/isUndefined';

import { Ellipsis } from '../../../Ellipsis';
import {
  OptionContentWrapper,
  OptionCount,
  OptionCountDisabled,
} from './elements';

export const Option = <OptionType extends OptionTypeBase>({
  data,
  isSelected,
  ...props
}: OptionProps<OptionType>) => {
  const { label, count } = data;
  const isDisabled = count === 0;

  const OptionCountChip = isDisabled ? OptionCountDisabled : OptionCount;

  return (
    <components.Option
      {...props}
      data={data}
      isSelected={isSelected}
      isFocused={false}
      isDisabled={isDisabled}
    >
      <OptionContentWrapper>
        <Checkbox checked={isSelected} disabled={isDisabled} />

        <Ellipsis value={label} />

        {!isUndefined(count) && (
          <OptionCountChip>{formatBigNumbersWithSuffix(count)}</OptionCountChip>
        )}
      </OptionContentWrapper>
    </components.Option>
  );
};