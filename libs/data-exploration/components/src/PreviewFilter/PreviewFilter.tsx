import React from 'react';

import styled from 'styled-components';

import {
  DATA_EXPLORATION_COMPONENT,
  useDebounceTrackUsage,
} from '@data-exploration-lib/core';

import { Input } from '@cognite/cogs.js';

interface Props {
  query?: string;
  onQueryChange?: (newQuery: string) => void;
}
export const DefaultPreviewFilter: React.FC<React.PropsWithChildren<Props>> = ({
  query,
  onQueryChange,
  children,
}) => {
  const track = useDebounceTrackUsage();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange?.(event.target.value);
    track(DATA_EXPLORATION_COMPONENT.SEARCH.PREVIEW_SEARCH, {
      query: event.target.value,
    });
  };
  return (
    <>
      <StyledInput
        variant="default"
        value={query || ''}
        placeholder="Search for name, description, etc..."
        onChange={handleOnChange}
      />
      <FlexGrow />
      {children}
    </>
  );
};

const FlexGrow = styled.div`
  flex-grow: 1;
`;

const StyledInput = styled(Input)`
  width: 100%;
  max-width: 300px;
  border-color: #cccccc;
`;
