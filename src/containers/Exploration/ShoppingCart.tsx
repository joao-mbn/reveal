import React from 'react';
import { Asset, GetTimeSeriesMetadataDTO, FilesMetadata } from '@cognite/sdk';
import { Icon, Colors, Button } from '@cognite/cogs.js';
import { SmallTitle, ListItem } from 'components/Common';

export type ShoppingCart = {
  assets: {
    [key: number]: Asset;
  };
  timeseries: {
    [key: number]: GetTimeSeriesMetadataDTO;
  };
  files: {
    [key: number]: FilesMetadata;
  };
};
export const ShoppingCartPreview = ({
  cart,
  setCart,
}: {
  cart: ShoppingCart;
  setCart: (cart: ShoppingCart) => void;
}) => {
  const onDeleteClicked = ({
    assetId,
    timeseriesId,
    fileId,
  }: {
    assetId?: number;
    timeseriesId?: number;
    fileId?: number;
  }) => {
    const newCart = { ...cart };
    if (fileId) {
      delete newCart.files[fileId];
    } else if (timeseriesId) {
      delete newCart.timeseries[timeseriesId];
    } else if (assetId) {
      delete newCart.assets[assetId];
    }
    setCart(newCart);
  };

  const renderDeleteItemButton = (ids: {
    assetId?: number;
    timeseriesId?: number;
    fileId?: number;
  }) => (
    <Icon
      style={{
        alignSelf: 'center',
        color: Colors.danger.hex(),
      }}
      type="Delete"
      onClick={() => onDeleteClicked(ids)}
    />
  );
  return (
    <div style={{ width: 300, position: 'relative' }}>
      <div style={{ height: '400px', overflowY: 'auto' }}>
        <SmallTitle>Asset</SmallTitle>
        {Object.values(cart.assets).map(el => {
          return (
            <ListItem
              key={el.id}
              title={
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <Icon
                    style={{
                      alignSelf: 'center',
                      marginRight: '4px',
                    }}
                    type="DataStudio"
                  />
                  <span>{el.name}</span>
                </div>
              }
            >
              {renderDeleteItemButton({ assetId: el.id })}
            </ListItem>
          );
        })}
        <SmallTitle>Time series</SmallTitle>
        {Object.values(cart.timeseries).map(el => {
          return (
            <ListItem
              key={el.id}
              title={
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <Icon
                    style={{
                      alignSelf: 'center',
                      marginRight: '4px',
                    }}
                    type="DataStudio"
                  />
                  <span>{el.name}</span>
                </div>
              }
            >
              {renderDeleteItemButton({ timeseriesId: el.id })}
            </ListItem>
          );
        })}
        <SmallTitle>Files</SmallTitle>
        {Object.values(cart.files).map(el => {
          return (
            <ListItem
              key={el.id}
              title={
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <Icon
                    style={{
                      alignSelf: 'center',
                      marginRight: '4px',
                    }}
                    type="DataStudio"
                  />
                  <span>{el.name}</span>
                </div>
              }
            >
              {renderDeleteItemButton({ fileId: el.id })}
            </ListItem>
          );
        })}
      </div>
      <Button
        style={{ width: '100%' }}
        type="primary"
        onClick={() => {
          const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(cart)
          )}`;
          const dlAnchorElem = document.createElement('a');
          dlAnchorElem.setAttribute('href', dataStr);
          dlAnchorElem.setAttribute('download', 'resources.json');
          dlAnchorElem.click();
        }}
      >
        Download JSON
      </Button>
    </div>
  );
};
