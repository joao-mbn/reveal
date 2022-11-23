import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Button, Flex, Input } from '@cognite/cogs.js';
import { AssetMappingsList } from 'app/containers/ThreeD/AssetMappingsList';
import {
  AugmentedMapping,
  useInfiniteAssetMappings,
} from 'app/containers/ThreeD/hooks';
import styled from 'styled-components';
import { useCdfItem } from '@cognite/sdk-react-query-hooks';
import { Asset } from '@cognite/sdk';
import { trackUsage } from 'app/utils/Metrics';

import { Cognite3DModel, Cognite3DViewer } from '@cognite/reveal';

type ThreeDSidebarProps = {
  modelId: number;
  revisionId: number;
  selectedAssetId?: number;
  setSelectedAssetId: (assetId?: number) => void;
  viewer: Cognite3DViewer;
  threeDModel: Cognite3DModel;
};

export const AssetMappingsSidebar = ({
  modelId,
  revisionId,
  selectedAssetId,
  setSelectedAssetId,
}: ThreeDSidebarProps) => {
  const { data: asset } = useCdfItem<Asset>(
    'assets',
    { id: selectedAssetId! },
    { enabled: Number.isFinite(selectedAssetId) }
  );

  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);

  const {
    error,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteAssetMappings(modelId, revisionId, 1000);

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const items = useMemo(
    () =>
      data?.pages
        .reduce((accl, p) => [...accl, ...p.items], [] as AugmentedMapping[])
        .sort((a, b) => a.assetName.localeCompare(b.assetName)),
    [data?.pages]
  );

  const handleAssetClick = (clickedAssetId: number) => {
    setSelectedAssetId(clickedAssetId);
  };

  const searchRef = useRef<HTMLInputElement>(null);

  window.addEventListener('keydown', function (e) {
    if (
      e.keyCode === 75 &&
      document.getElementById('search') !== document.activeElement
    ) {
      e.preventDefault();
      document.getElementById('search')?.focus();
    }
    if (e.key === 'Escape' && expanded) {
      setQuery('');
      setExpanded(false);
      searchRef.current?.blur();
    }
  });

  return (
    <SidebarContainer
      expanded={expanded}
      onFocus={() => {
        setExpanded(true);
        trackUsage('Exploration.Preview.AssetMapping');
      }}
    >
      <Flex gap={5} justifyContent="flex-end" alignItems="center">
        <StyledInput
          ref={searchRef}
          id="search"
          style={{ flexGrow: 1 }}
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            trackUsage('Exploration.Action.Search', { name: query });
          }}
          placeholder={asset?.name || 'Search (⌘ + K)'}
          fullWidth
          size="large"
          iconPlacement="left"
          icon={isFetching || hasNextPage ? 'Loader' : 'Search'}
        />
        {expanded && (
          <StyledButton
            aria-label="close-asset-mappings-button"
            onClick={() => {
              if (query) {
                setQuery('');
              } else {
                setExpanded(false);
              }
              trackUsage('Exploration.Preview.AssetMapping');
            }}
          >
            {query ? 'Clear' : 'Close'}
          </StyledButton>
        )}
      </Flex>
      {expanded && (
        <AssetMappingsList
          error={error}
          query={query}
          assets={items ?? []}
          selectedAssetId={selectedAssetId}
          onClick={e => {
            handleAssetClick(e);
            setExpanded(false);
            trackUsage('Exploration.Action.Select', { selectedAssetId });
          }}
          itemCount={items?.length ?? 0}
          isItemLoaded={i => i < (items?.length || 0)}
        />
      )}
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div<{ expanded?: boolean }>`
  height: ${props => (props.expanded ? '400px' : 'initial')};
  background: ${props => (props.expanded ? ' var(--cogs-white)' : 'initial')};
  overflow: hidden;
`;

const StyledButton = styled(Button)`
  position: absolute;
  background: white;
  margin-right: 5px;
  &:hover {
    background: white;
  }
`;

const StyledInput = styled(Input)`
  height: 50px;
  border-radius: 4px;
  .cogs-input {
    border: none;
    width: 260px;
    &:focus {
      outline: none;
      border: none;
    }
  }
  .cogs-input.with-icon-left {
    padding-left: 43px;
  }
  .cogs-input:hover {
    border: none;
  }
`;
