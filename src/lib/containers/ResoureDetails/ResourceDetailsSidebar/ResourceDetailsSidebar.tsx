import { ExternalId } from '@cognite/sdk/dist/src';
import { RelationsTable } from 'lib/containers/Relationships/RelationsTable';
import { ResourceType, ResourceItem } from 'lib/types';
import React from 'react';
import { createLink } from 'lib/utils/URLUtils';

export const ResourceDetailsSidebar = ({
  assetId,
  relations,
}: {
  assetId?: number;
  relations: (ExternalId & { type: ResourceType })[];
}) => {
  // TODO(CDF-9758): Import from cdf-utilities
  const getResourcePath = (item: ResourceItem) => {
    return createLink(`/explore/${item.type}/${item.id}`);
  };

  return (
    <div>
      <RelationsTable
        assetId={assetId}
        relations={relations}
        getResourcePath={getResourcePath}
      />
    </div>
  );
};
