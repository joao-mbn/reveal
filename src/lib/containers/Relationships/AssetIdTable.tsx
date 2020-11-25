import React from 'react';
import { ResourceItem, convertResourceType } from 'lib/types';
import { useCdfItem, useCdfItems } from '@cognite/sdk-react-query-hooks';
import { Asset } from '@cognite/sdk';
import { AssetTable } from 'lib/containers';
import { SelectableItemsProps } from 'lib/CommonProps';

export const AssetIdTable = ({
  resource,
  ...props
}: {
  resource: ResourceItem;
} & SelectableItemsProps) => {
  const { data: item, isFetched: isItemFetched } = useCdfItem(
    convertResourceType(resource.type),
    { id: resource.id },
    { enabled: !!resource?.externalId }
  );

  const assetIds: number[] =
    (item as any).assetIds || [(item as any).assetId] || [];

  const { data: assets } = useCdfItems<Asset>(
    'assets',
    assetIds.map(id => ({ id })),
    { enabled: isItemFetched && assetIds }
  );

  return <AssetTable data={assets} {...props} />;
};
