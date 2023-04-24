import React from 'react';
import { Button } from '@cognite/cogs.js';
import styled from 'styled-components';
import { ResourceType } from '@data-exploration-components/types';
import {
  DATA_EXPLORATION_COMPONENT,
  useMetrics,
} from '@data-exploration-lib/core';

export const ResetFiltersButton = <T extends Record<string, unknown>>({
  setFilter,
  resourceType,
}: {
  setFilter: (filter: T) => void;
  resourceType?: ResourceType;
}) => {
  const trackUsage = useMetrics();
  const handleResetFilters = () => {
    setFilter({} as T);
    trackUsage(DATA_EXPLORATION_COMPONENT.CLICK.RESET_ALL_FILTERS, {
      resourceType,
    });
  };

  return (
    <StyledButton onClick={handleResetFilters} type="secondary" icon="Restore">
      Reset all filters
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  width: 100%;
`;