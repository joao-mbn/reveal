import React from 'react';
import styled from 'styled-components';
import {
  Icon,
  Colors,
  Button,
  Dropdown,
  Menu,
  Overline,
  Body,
} from '@cognite/cogs.js';
import { ListItem, SpacedRow } from 'lib/components';
import copy from 'copy-to-clipboard';
import { useTenant, useEnv } from 'lib/hooks/CustomHooks';
import { ResourceItem, ResourceType } from 'lib/types';
import { useCdfItems } from '@cognite/sdk-react-query-hooks';
import {
  FileInfo,
  Asset,
  Timeseries,
  CogniteEvent,
  Sequence,
} from '@cognite/sdk';
import EmptyCartImage from 'app/assets/empty-cart.svg';

export const ShoppingCartPreview = ({
  cart,
  setCart,
}: {
  cart: ResourceItem[];
  setCart: (cart: ResourceItem[]) => void;
}) => {
  const assetIds = cart
    .filter(el => el.type === 'asset')
    .map(({ id }) => ({ id }));
  const { data: assets = [] } = useCdfItems<Asset>('assets', assetIds);

  const fileIds = cart
    .filter(el => el.type === 'file')
    .map(({ id }) => ({ id }));
  const { data: files = [] } = useCdfItems<FileInfo>('files', fileIds);

  const eventIds = cart
    .filter(el => el.type === 'event')
    .map(({ id }) => ({ id }));
  const { data: events = [] } = useCdfItems<CogniteEvent>('events', eventIds);

  const timeseriesIds = cart
    .filter(el => el.type === 'timeSeries')
    .map(({ id }) => ({ id }));
  const { data: timeseries = [] } = useCdfItems<Timeseries>(
    'timeseries',
    timeseriesIds
  );

  const sequenceIds = cart
    .filter(el => el.type === 'sequence')
    .map(({ id }) => ({ id }));
  const { data: sequences = [] } = useCdfItems<Sequence>(
    'sequences',
    sequenceIds
  );

  const resources: {
    type: ResourceType;
    iconType: 'DataStudio' | 'Document' | 'Events' | 'Timeseries' | 'Duplicate';
    header: string;
    items: any[];
  }[] = [
    { type: 'asset', iconType: 'DataStudio', header: 'Assets', items: assets },
    { type: 'file', iconType: 'Document', header: 'Files', items: files },
    { type: 'event', iconType: 'Events', header: 'Events', items: events },
    {
      type: 'timeSeries',
      iconType: 'Timeseries',
      header: 'Timeseries',
      items: timeseries,
    },
    {
      type: 'sequence',
      iconType: 'Duplicate',
      header: 'Sequences',
      items: sequences,
    },
  ];

  const tenant = useTenant();
  const env = useEnv();

  const onDeleteClicked = (item: { id: number }) => {
    setCart(cart.filter(el => el.id !== item.id));
  };

  const renderDeleteItemButton = (item: { id: number }) => (
    <Icon
      style={{
        alignSelf: 'center',
        color: Colors.danger.hex(),
      }}
      type="Delete"
      onClick={() => onDeleteClicked(item)}
    />
  );

  return (
    <div style={{ width: 300, position: 'relative', backgroundColor: '#fff' }}>
      {cart.length === 0 ? (
        <EmptyCart>
          <img src={EmptyCartImage} alt="Empty cart" />
          <Body level={1}>Select resources to download</Body>
        </EmptyCart>
      ) : (
        <div style={{ height: '400px', overflowY: 'auto' }}>
          {resources
            .filter(resource => resource.items.length > 0)
            .map(resource => (
              <ResourceTypeSection key={resource.header}>
                <SpacedRow>
                  <ResourceTypeHeader level={2} style={{ marginBottom: 8 }}>
                    {resource.header}
                  </ResourceTypeHeader>
                  <div className="spacer" />
                </SpacedRow>
                {resource.items.map(item => (
                  <ListItem
                    key={item.id}
                    bordered
                    title={
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        <Icon
                          style={{
                            alignSelf: 'center',
                            marginRight: '4px',
                          }}
                          type={resource.iconType}
                        />
                        {/* Use id when item is event and item.name is undefined */}
                        <span>{item ? item.name || item.id : 'Loading'}</span>
                      </div>
                    }
                  >
                    {renderDeleteItemButton(item)}
                  </ListItem>
                ))}
              </ResourceTypeSection>
            ))}
        </div>
      )}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <Button
          style={{ flex: 1 }}
          type="primary"
          disabled={cart.length === 0}
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
        <Dropdown
          content={
            <Menu>
              <Menu.Item
                onClick={() => {
                  const urls = [];
                  if (assets.length > 0) {
                    urls.push(
                      `Assets?$filter=${assets
                        .map(item => `(Id eq ${item.id})`)
                        .join(' or ')}`
                    );
                  }
                  if (timeseries.length > 0) {
                    urls.push(
                      `Timeseries?$filter=${timeseries
                        .map(item => `(Id eq ${item.id})`)
                        .join(' or ')}`
                    );
                  }
                  if (files.length > 0) {
                    urls.push(
                      `Files?$filter=${files
                        .map(item => `(Id eq ${item.id})`)
                        .join(' or ')}`
                    );
                  }
                  copy(
                    JSON.stringify(
                      urls.map(
                        el =>
                          `https://${
                            env || 'api'
                          }.cognitedata.com/odata/v1/projects/${tenant}/${el}`
                      )
                    )
                  );
                }}
              >
                <Icon type="Copy" />
                Copy OData Queries
              </Menu.Item>
            </Menu>
          }
        >
          <Button variant="ghost" icon="VerticalEllipsis" />
        </Dropdown>
      </div>
    </div>
  );
};

const ResourceTypeHeader = styled(Overline)`
  margin-top: 8px;
`;

const ResourceTypeSection = styled.div`
  margin-bottom: 8px;
`;

const EmptyCart = styled.div`
  text-align: center;
  margin: 8px 0 16px;
  padding: 24px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
`;

// https://api.cognitedata.com/odata/v1/projects/contextualization/Assets?$filter=(Id eq 51865490571) or (Id eq 52579923080)
