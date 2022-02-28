import React, { useState } from 'react';

import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import { caseInsensitiveSort } from 'utils/sort';

import { Select, OptionType } from '@cognite/cogs.js';

import { useDeepEffect, useDeepMemo } from 'hooks/useDeep';

import {
  formatOptionLabelDefault,
  renderMultiSelectDropdown,
  renderPlaceholderSelectElement,
  renderTitleAboveSelectComponent,
} from './commonMultiSelectComponents';
import { MultiSelectContainer } from './elements';
import { MultiSelectProps, MultiSelectOptionType } from './types';

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options: data = [],
  selectedOptions,
  onValueChange,
  isTextCapitalized = false,
  isOptionsSorted = true,
  footer = () => null,
  title,
  titlePlacement = 'default',
  displayValue,
  theme,
  formatOptionLabel,
  placeholderSelectElement,
  hideClearIndicator,
  styles,
  ...rest
}) => {
  const options: OptionType<MultiSelectOptionType>[] = useDeepMemo(() => {
    const processedOptions = data.map((option) => ({
      label: get(option, 'value', option),
      value: option,
    }));

    return isOptionsSorted
      ? processedOptions.sort((a, b) => caseInsensitiveSort(a.label, b.label))
      : processedOptions;
  }, [data, isOptionsSorted]);

  const [value, setValue] = useState<OptionType<MultiSelectOptionType>[]>([]);

  useDeepEffect(() => {
    if (isUndefined(selectedOptions)) return;

    const value = options.filter((option) =>
      selectedOptions.includes(option.label)
    );
    setValue(value);
  }, [options, selectedOptions]);

  const onChange = (values: OptionType<MultiSelectOptionType>[]) => {
    if (isUndefined(selectedOptions)) {
      setValue(values);
    }
    onValueChange((values || []).map((option) => option.label));
  };

  return (
    <MultiSelectContainer
      outlined={isUndefined(theme)}
      hideClearIndicator={hideClearIndicator}
      data-testid="multi-select-container"
      aria-label={`${title} list`}
    >
      {renderTitleAboveSelectComponent(title, titlePlacement)}
      <Select
        isMulti
        options={options}
        // aria-labelledby={title}
        value={value}
        onChange={onChange}
        formatOptionLabel={
          formatOptionLabel || formatOptionLabelDefault(isTextCapitalized)
        }
        title={titlePlacement === 'default' && title}
        placeholderSelectElement={renderPlaceholderSelectElement(
          placeholderSelectElement,
          displayValue
        )}
        theme={theme}
        dropdownRender={renderMultiSelectDropdown(footer)}
        styles={styles}
        {...rest}
      />
    </MultiSelectContainer>
  );
};
