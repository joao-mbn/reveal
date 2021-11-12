import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Flex, Input } from '@cognite/cogs.js';
import { activeFilters } from 'components/TableContent/mock';
import { Pagination } from './Pagination';
import { Menu } from './Menu';

export type FilterType = { type: string; value: number };
export const FilterBar = (): JSX.Element => {
  const [isColumnActive] = useState<boolean>(true);

  const onFilterClick = (_filter: FilterType) => {
    /** do something */
  };

  return (
    <Bar justifyContent="space-between" alignItems="center">
      <FilterBar.List justifyContent="center" alignItems="center">
        <Input placeholder="Search columns, values" />
        {activeFilters.map((filter: FilterType) => (
          <Button type="tertiary" onClick={() => onFilterClick(filter)}>
            {filter.value} {filter.type}
          </Button>
        ))}
      </FilterBar.List>
      <Flex justifyContent="center" alignItems="center">
        {isColumnActive ? <FilterBar.Menu /> : <FilterBar.Pagination />}
      </Flex>
    </Bar>
  );
};

const Bar = styled(Flex)`
  padding: 16px;
`;

const List = styled(Flex)`
  & > * {
    margin-right: 8px;
  }
`;

FilterBar.List = List;
FilterBar.Menu = Menu;
FilterBar.Pagination = Pagination;
