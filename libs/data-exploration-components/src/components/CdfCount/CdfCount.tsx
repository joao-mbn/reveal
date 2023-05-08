import React from 'react';
import { useAggregate, SdkResourceType } from '@cognite/sdk-react-query-hooks';
import { Chip } from '@cognite/cogs.js';
import { formatNumber } from '@data-exploration-lib/core';

type Props = {
  type: SdkResourceType;
  filter?: any;
};

export const CdfCount = ({ type, filter }: Props) => {
  const { data, isFetched } = useAggregate(type, filter);
  if (isFetched && data && Number.isFinite(data?.count) && data?.count > 0) {
    return <Chip label={formatNumber(data?.count)} />;
  }

  return null;
};
