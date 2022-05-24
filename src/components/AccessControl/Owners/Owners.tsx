import Table from 'antd/lib/table';

import { Group } from '@cognite/sdk';
import { getAllSetOwnersFromGroups, getContainer } from 'utils/shared';
import { useTranslation } from 'common/i18n';

interface OwnersProps {
  dataSetId: number;
  groups: Group[];
  isOidcEnv: boolean;
}

const Owners = (props: OwnersProps) => {
  const { dataSetId, groups } = props;
  const { t } = useTranslation();

  const ownerColumns = [
    {
      title: t('group'),
      key: 'group',
      dataIndex: 'name',
    },
    {
      title: t('sourceid'),
      key: 'sourceId',
      dataIndex: 'sourceId',
    },
  ];

  const ownerGroups = getAllSetOwnersFromGroups(dataSetId, groups);

  const ownersDataSource = ownerGroups.map((ownerGroup: Group) => ({
    groupId: ownerGroup.id,
    name: ownerGroup.name,
    sourceId: ownerGroup?.sourceId,
  }));

  return (
    <Table
      style={{ marginTop: '20px' }}
      columns={ownerColumns}
      dataSource={ownersDataSource}
      rowKey="groupId"
      getPopupContainer={getContainer}
    />
  );
};

export default Owners;
