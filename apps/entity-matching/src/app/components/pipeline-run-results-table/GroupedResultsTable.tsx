import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import styled from 'styled-components';

import { useTranslation } from '@entity-matching-app/common';
import { PAGINATION_SETTINGS } from '@entity-matching-app/common/constants';
import {
  EMPipelineGeneratedRule,
  EMPipelineRun,
  Pipeline,
} from '@entity-matching-app/hooks/entity-matching-pipelines';
import { TableRowSelection } from 'antd/lib/table/interface';

import { ColumnType, Table } from '@cognite/cdf-utilities';
import { Icon } from '@cognite/cogs.js';
import { CogniteInternalId } from '@cognite/sdk';

import ExpandedRule from './ExpandedRule';
import Extractor from './Extractor';

type GroupedResultsTableRecord = EMPipelineGeneratedRule & { key: string };

type GroupedResultsTableColumnType = ColumnType<GroupedResultsTableRecord> & {
  title: string;
};

type GroupedResultsTableProps = {
  pipeline: Pipeline;
  run: EMPipelineRun;
  selectedSourceIds: CogniteInternalId[];
  setSelectedSourceIds: Dispatch<SetStateAction<CogniteInternalId[]>>;
};

const GROUPED_RESULTS_TABLE_KEY_PATTERN_SEPARATOR =
  'GROUPED_RESULTS_TABLE_KEY_PATTERN_SEPARATOR';

const getRuleKey = (rule: EMPipelineGeneratedRule) => {
  return (
    rule.extractors
      ?.map(({ pattern }) => pattern)
      .join(GROUPED_RESULTS_TABLE_KEY_PATTERN_SEPARATOR) ?? ''
  );
};

const GroupedResultsTable = ({
  run,
  selectedSourceIds,
  setSelectedSourceIds,
}: GroupedResultsTableProps): JSX.Element => {
  const { t } = useTranslation();

  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const handleClickExpandButton = (clickedRowKey: string) => {
    setExpandedRowKeys((prevState) =>
      prevState.includes(clickedRowKey)
        ? prevState.filter((key) => key !== clickedRowKey)
        : prevState.concat(clickedRowKey)
    );
  };

  const selectedRuleKeys = useMemo(() => {
    return run.generatedRules
      ?.filter(({ matches }) =>
        matches?.every(({ source }) =>
          selectedSourceIds.includes(
            typeof source.id === 'number' ? source.id : -1
          )
        )
      )
      .map((rule) => getRuleKey(rule));
  }, [selectedSourceIds, run]);

  const columns: GroupedResultsTableColumnType[] = useMemo(
    () => [
      {
        title: t('source'),
        dataIndex: 'extractors',
        key: 'source',
        render: (extractors) => (
          <Extractor extractors={extractors} entitySetToRender="sources" />
        ),
      },
      {
        title: t('target'),
        dataIndex: 'extractors',
        key: 'target',
        render: (extractors) => (
          <Extractor extractors={extractors} entitySetToRender="targets" />
        ),
      },
      {
        title: t('rules-matches'),
        key: 'numberOfMatches',
        width: 100,
        sorter: (a: GroupedResultsTableRecord, b: GroupedResultsTableRecord) =>
          (a.matches?.length ?? 0) - (b.matches?.length ?? 0),
        render: (rule: GroupedResultsTableRecord) => rule.matches?.length,
      },
      {
        title: '',
        dataIndex: 'extractors',
        key: 'expandable',
        render: (_, record) => (
          <ExpandButton onClick={() => handleClickExpandButton(record.key)}>
            <Icon
              type={
                expandedRowKeys.includes(record.key)
                  ? 'ChevronUp'
                  : 'ChevronDown'
              }
            />
          </ExpandButton>
        ),
        width: 64,
      },
    ],
    [expandedRowKeys, t]
  );

  const dataSource = useMemo(
    () =>
      run.generatedRules?.map((rule) => ({
        ...rule,
        key: getRuleKey(rule),
      })) ?? [],
    [run.generatedRules]
  );

  const rowSelection: TableRowSelection<GroupedResultsTableRecord> = {
    selectedRowKeys: selectedRuleKeys,
    onChange: (rowKeys, _, info) => {
      if (info.type === 'single') {
        const rules = run.generatedRules?.filter((rule) =>
          rowKeys.includes(getRuleKey(rule))
        );
        setSelectedSourceIds(
          rules?.flatMap(
            ({ matches }) =>
              matches?.map(({ source }) =>
                typeof source.id === 'number' ? source.id : -1
              ) ?? []
          ) ?? []
        );
      }
    },
    onSelectAll: (all) => {
      if (all) {
        setSelectedSourceIds(
          dataSource.flatMap(
            ({ matches }) => matches?.map(({ source }) => source.id) ?? []
          )
        );
      } else {
        setSelectedSourceIds([]);
      }
    },
  };

  return (
    <Table<GroupedResultsTableRecord>
      columns={columns}
      dataSource={dataSource}
      emptyContent={undefined}
      appendTooltipTo={undefined}
      pagination={PAGINATION_SETTINGS}
      expandable={{
        showExpandColumn: false,
        expandedRowKeys: expandedRowKeys,
        expandedRowRender: (record) =>
          !!record.matches && !!record.extractors && !!record.conditions ? (
            <ExpandedRule
              conditions={record.conditions}
              extractors={record.extractors}
              matches={record.matches}
              selectedSourceIds={selectedSourceIds}
              setSelectedSourceIds={setSelectedSourceIds}
            />
          ) : (
            false
          ),
        indentSize: 64,
      }}
      rowSelection={rowSelection}
    />
  );
};

export const ExpandButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  box-shadow: none;
  cursor: pointer;
  display: flex;
  height: 36px;
  justify-content: center;
  padding: 0;
  width: 36px;
`;

export default GroupedResultsTable;
