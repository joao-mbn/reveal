import { RuleDto, useListAllRules } from '@data-quality/api/codegen';
import { useLoadDataSource } from '@data-quality/hooks';
import { BasicPlaceholder } from '@platypus-app/components/BasicPlaceholder/BasicPlaceholder';
import { Spinner } from '@platypus-app/components/Spinner/Spinner';
import { useTranslation } from '@platypus-app/hooks/useTranslation';

import { Body, Flex, Table, TableColumn, Title } from '@cognite/cogs.js';

import { renderNameColumn, renderSeverityColumn } from './helpers';

export const RulesTable = () => {
  const { t } = useTranslation('RulesTable');

  const { dataSource } = useLoadDataSource();

  const {
    data: rulesData,
    isLoading: rulesLoading,
    error: rulesError,
  } = useListAllRules(
    {
      pathParams: {
        dataSourceId: dataSource?.externalId,
      },
    },
    { enabled: !!dataSource?.externalId }
  );

  const tableColumns: TableColumn<RuleDto>[] = [
    {
      Header: 'Name',
      accessor: 'name',
      Cell: ({ row }: any) => {
        return renderNameColumn(row.values.name);
      },
    },
    {
      Header: 'Severity',
      accessor: 'severity',
      Cell: ({ row }: any) => {
        return renderSeverityColumn(row.values.severity);
      },
    },
  ];

  const renderContent = () => {
    if (rulesLoading) return <Spinner />;

    if (rulesError)
      return (
        <BasicPlaceholder
          type="EmptyStateFolderSad"
          title={t(
            'data_quality_not_found_rules',
            "Something went wrong. We couldn't load the rules."
          )}
        >
          <Body level={5}>{JSON.stringify(rulesError)}</Body>
        </BasicPlaceholder>
      );

    return (
      <Table<RuleDto>
        columns={tableColumns}
        dataSource={rulesData?.items}
        rowKey={(row) => row.externalId}
      />
    );
  };

  return (
    <Flex direction="column" gap={22}>
      <Title level={5}>{t('data_quality_all_rules', 'All rules')}</Title>
      {renderContent()}
    </Flex>
  );
};