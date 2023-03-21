import React from 'react';
import styled from 'styled-components';
import { Colors } from '@cognite/cogs.js';
import { Asset } from '@cognite/sdk';
import { useCdfItem } from '@cognite/sdk-react-query-hooks';
import noop from 'lodash/noop';

const BreadCrumbItem = styled.li`
  color: ${Colors['decorative--grayscale--600']};
  font-size: 14px;
  cursor: pointer;
`;
const Separator = styled.span`
  padding: 0 5px;
`;

interface Props {
  assetId: number;
  maxLength?: number;
  parents?: number;
  onBreadcrumbClick?: (asset: Asset, depth: number) => void;
}

export function AssetBreadcrumbItems({
  assetId,
  maxLength = 3,
  parents = 0,
  onBreadcrumbClick = noop,
}: Props) {
  const { data: asset, isFetched } = useCdfItem<Asset>(
    'assets',
    { id: assetId! },
    {
      enabled: !!assetId,
    }
  );

  if (!isFetched) {
    return null;
  }

  if (!asset) {
    return null;
  }

  if (asset?.parentId && asset?.parentId !== asset?.id) {
    return (
      <>
        <AssetBreadcrumbItems
          assetId={asset.parentId}
          maxLength={maxLength}
          parents={parents + 1}
          onBreadcrumbClick={onBreadcrumbClick}
        />
        {maxLength - 1 === parents ? (
          <BreadCrumbItem>
            ...
            {parents !== 0 ? <Separator>/</Separator> : null}
          </BreadCrumbItem>
        ) : null}
        {maxLength - 1 > parents ? (
          <BreadCrumbItem onClick={() => onBreadcrumbClick(asset, parents)}>
            {asset.name}
            {parents !== 0 ? <Separator>/</Separator> : null}
          </BreadCrumbItem>
        ) : null}
      </>
    );
  }

  return (
    <BreadCrumbItem onClick={() => onBreadcrumbClick(asset!, parents)}>
      {asset?.name}
      <Separator>/</Separator>
    </BreadCrumbItem>
  );
}

const BreadcrumbList = styled.ul`
  list-style-type: none;
  display: flex;
  padding: 0;
  margin-left: 16px;
`;

export function AssetBreadcrumb({
  assetId,
  maxLength,
  onBreadcrumbClick,
}: Omit<Props, 'parents'>) {
  return (
    <BreadcrumbList>
      <AssetBreadcrumbItems
        assetId={assetId}
        maxLength={maxLength}
        onBreadcrumbClick={onBreadcrumbClick}
      />
    </BreadcrumbList>
  );
}