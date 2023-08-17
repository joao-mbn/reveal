import React, { useState } from 'react';

import { useTranslation } from '@access-management/common/i18n';
import LegacyLoginFlowWarning from '@access-management/pages/IDP/LegacyLoginFlowWarning';
import { useQuery } from '@tanstack/react-query';
import { Col, Input, Checkbox, Row, Table } from 'antd';

import { useSDK } from '@cognite/sdk-provider';

import { stringContains } from '../Groups/utils';

import { useAPIKeyTableColumns } from './columns';

export default function APIKeys() {
  const { t } = useTranslation();
  const { columns } = useAPIKeyTableColumns();
  const sdk = useSDK();

  const [searchValue, setSearchValue] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  const { data: apiKeys = [], isFetched } = useQuery(['api-keys'], async () => {
    const serviceAccounts = await sdk.serviceAccounts.list();
    const list = await sdk.apiKeys.list({ all: true, includeDeleted: true });
    return list.map((k) => ({
      ...k,
      serviceAccountName: serviceAccounts.find(
        (s) => s.id === k.serviceAccountId
      )?.name,
    }));
  });

  return (
    <>
      <LegacyLoginFlowWarning />
      <Row justify="space-between">
        <Col>
          <Input.Search
            placeholder={t('filter-by-service-account-or-id')}
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            allowClear
            style={{
              width: '326px',
              height: '40px',
            }}
          />
        </Col>
        <Col>
          <Checkbox
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.target.checked)}
          >
            {t('display-deleted-key')}
          </Checkbox>
        </Col>
      </Row>
      <Table
        loading={!isFetched}
        columns={columns}
        rowKey="id"
        dataSource={apiKeys
          .filter((a) => (showDeleted ? true : a.status === 'ACTIVE'))
          .filter(
            (a) =>
              stringContains(String(a.serviceAccountId) ?? a.id, searchValue) ||
              stringContains(String(a.serviceAccountName) ?? a.id, searchValue)
          )}
        pagination={{ pageSize: 25, hideOnSinglePage: true }}
      />
    </>
  );
}