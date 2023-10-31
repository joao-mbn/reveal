import * as React from 'react';
import { useMemo, useState } from 'react';

import { Field } from '@fdx/shared/types/filters';
import isEmpty from 'lodash/isEmpty';

import {
  EmptyState,
  ErrorState,
  Menu,
  MenuHeader,
  MenuItem,
  MenuList,
  SearchInput,
} from '../../components';

import { getFilteredFields, getMenuItemIcon } from './utils';

export interface FieldSelectorProps {
  name: string;
  displayName?: string;
  fields: Field[];
  onBackClick?: () => void;
  onSelectField: (field: Field) => void;
  isError?: boolean;
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  name,
  displayName,
  fields,
  onBackClick,
  onSelectField,
  isError,
}) => {
  const [searchInputValue, setSearchInputValue] = useState<string>('');

  const filteredFields = useMemo(() => {
    return getFilteredFields(fields, searchInputValue);
  }, [fields, searchInputValue]);

  if (isError) {
    return (
      <Menu>
        <ErrorState />
      </Menu>
    );
  }

  return (
    <Menu>
      <MenuHeader title={displayName || name} onBackClick={onBackClick} />

      <SearchInput value={searchInputValue} onChange={setSearchInputValue} />

      {isEmpty(filteredFields) ? (
        <EmptyState />
      ) : (
        <MenuList>
          {filteredFields.map((field) => {
            return (
              <MenuItem
                key={field.id}
                title={field.id}
                icon={getMenuItemIcon(field.type)}
                onClick={() => onSelectField(field)}
              />
            );
          })}
        </MenuList>
      )}
    </Menu>
  );
};
