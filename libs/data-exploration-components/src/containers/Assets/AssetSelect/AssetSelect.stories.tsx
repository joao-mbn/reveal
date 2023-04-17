import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { AssetSelect } from './AssetSelect';

export default {
  title: 'Assets/Base/AssetSelect',
  component: AssetSelect,
};

export const Example = () => {
  const [selectedIds, setSelectedIds] = useState<number[] | undefined>();
  return (
    <AssetSelect
      title="Asset"
      selectedAssetIds={selectedIds}
      onAssetSelected={(item) => {
        setSelectedIds(item?.map(({ value }) => value));
        action('onAssetSelected')(item);
      }}
    />
  );
};
export const ExampleMulti = () => {
  const [selectedIds, setSelectedIds] = useState<number[] | undefined>();
  return (
    <AssetSelect
      title="Asset"
      isMulti
      selectedAssetIds={selectedIds}
      onAssetSelected={(item) => {
        setSelectedIds(item?.map(({ value }) => value));
        action('onAssetSelected')(item);
      }}
    />
  );
};