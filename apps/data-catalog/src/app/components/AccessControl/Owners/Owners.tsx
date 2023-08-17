import { useTranslation } from '@data-catalog-app/common/i18n';
import { getAllSetOwnersFromGroups } from '@data-catalog-app/utils/shared';

import { Table } from '@cognite/cogs.js';
import { Group } from '@cognite/sdk';
import { useMemo } from 'react';

interface OwnersProps {
  dataSetId: number;
  groups: Group[];
  isOidcEnv: boolean;
}

const Owners = (props: OwnersProps) => {
  const { dataSetId, groups } = props;
  const { t } = useTranslation();

  const ownerColumns = useMemo(
    () => [
      {
        Header: t('group'),
        id: 'group',
        accessor: 'name',
      },
      {
        Header: t('sourceid'),
        id: 'sourceId',
        accessor: 'sourceId',
      },
    ],
    []
  );

  const ownersDataSource = useMemo(() => {
    const ownerGroups = getAllSetOwnersFromGroups(dataSetId, groups);

    return ownerGroups.map((ownerGroup: Group) => ({
      groupId: ownerGroup.id,
      name: ownerGroup.name,
      sourceId: ownerGroup?.sourceId,
    }));
  }, [dataSetId, groups]);

  return (
    <div className="resource-table">
      <Table
        css={{ marginTop: '20px' }}
        columns={ownerColumns as any}
        dataSource={ownersDataSource}
        rowKey={(d) => `${d['groupId']}`}
      />
    </div>
  );
};

export default Owners;