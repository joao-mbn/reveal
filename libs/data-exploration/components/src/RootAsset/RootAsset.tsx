import * as React from 'react';
import { useCallback } from 'react';

import {
  DASH,
  DATA_EXPLORATION_COMPONENT,
  useMetrics,
} from '@data-exploration-lib/core';
import { useRootAssetQuery } from '@data-exploration-lib/domain-layer';

import { Asset } from '@cognite/sdk';

import { LoadingState } from './LoadingState';
import { RootAssetButton } from './RootAssetButton';

export interface RootAssetProps {
  assetId?: number;
  onClick?: (rootAsset: Asset) => void;
}

export const RootAsset: React.FC<RootAssetProps> = ({ assetId, onClick }) => {
  const { data: rootAsset, isLoading } = useRootAssetQuery(assetId);
  const trackUsage = useMetrics();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();

      if (rootAsset && onClick) {
        trackUsage(DATA_EXPLORATION_COMPONENT.CLICK.ROOT_ASSET, {
          name: rootAsset.name,
        });
        onClick(rootAsset);
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClick, rootAsset]
  );
  if (!assetId) return <>{DASH}</>;

  if (isLoading) {
    return <LoadingState />;
  }

  if (!rootAsset) {
    return <>{DASH}</>;
  }

  return <RootAssetButton label={rootAsset.name} onClick={handleClick} />;
};
