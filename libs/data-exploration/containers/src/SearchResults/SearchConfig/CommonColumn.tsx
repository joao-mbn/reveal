import { Flex } from '@cognite/cogs.js';
import {
  COMMON_COLUMN_HEADER,
  fuzzySearchToggleColumns,
  searchConfigCommonColumns,
  SearchConfigDataType,
} from '@data-exploration-lib/core';
import { checkFuzzySearchEnabled } from '../utils/checkFuzzySearchEnabled';
import { getNumberOfCheckedColumns } from '../utils/getNumberOfCheckedColumns';
import {
  ColumnHeader,
  CommonColumnWrapper,
  CommonWrapper,
  ModalCheckbox,
  ModalSwitch,
} from './elements';

type Props = {
  searchConfigData: SearchConfigDataType;
  onChange: (enabled: boolean, index: number) => void;
  onToggleFuzzySearch: (enabled: boolean, index: number) => void;
};

export const CommonColumn = ({
  searchConfigData,
  onChange,
  onToggleFuzzySearch,
}: Props) => {
  const resourcesLength = Object.keys(searchConfigData).length;

  const isOptionIndeterminate = (checkedColumnsLength: number) => {
    return checkedColumnsLength > 0 && checkedColumnsLength < resourcesLength;
  };

  const isOptionChecked = (checkedColumnsLength: number) => {
    return (
      checkedColumnsLength === resourcesLength ||
      (checkedColumnsLength > 0 && checkedColumnsLength < resourcesLength)
    );
  };

  return (
    <CommonColumnWrapper>
      <CommonWrapper direction="column">
        <ColumnHeader>{COMMON_COLUMN_HEADER}</ColumnHeader>
        {searchConfigCommonColumns.map((column, index) => {
          const checkedColumnsLength = getNumberOfCheckedColumns(
            searchConfigData,
            index
          );

          const isFuzzySearchEnabled = checkFuzzySearchEnabled(
            searchConfigData,
            index
          );

          const showFuzzySearchToggle =
            fuzzySearchToggleColumns.includes(column);

          return (
            <Flex>
              <ModalCheckbox
                key={`common_${column}`}
                onChange={(_, isChecked) => onChange(!!isChecked, index)}
                indeterminate={isOptionIndeterminate(checkedColumnsLength)}
                checked={isOptionChecked(checkedColumnsLength)}
                data-testid={`common-column-checkbox-${column}`}
              >
                {column}
              </ModalCheckbox>
              {showFuzzySearchToggle && (
                <ModalSwitch
                  checked={isFuzzySearchEnabled}
                  onChange={(_: unknown, nextState: boolean) =>
                    onToggleFuzzySearch(nextState, index)
                  }
                />
              )}
            </Flex>
          );
        })}
      </CommonWrapper>
    </CommonColumnWrapper>
  );
};
