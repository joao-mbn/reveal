import React, { useMemo, useState } from 'react';

import styled from 'styled-components';

import { ColumnType, Table } from '@cognite/cdf-utilities';
import { Button, Status } from '@cognite/cogs.js';

import { useTranslation } from '../../common';
import { MQTTJobWithMetrics } from '../../hooks/hostedExtractors';
import { PAGINATION_SETTINGS } from '../../utils/constants';
import { getJobStatusForCogs } from '../../utils/hostedExtractors';
import { getContainer } from '../../utils/utils';
import { Box } from '../box/Box';
import { LogsTable } from '../logs-table/LogsTable';

type JobsTableRecord = { key: string } & MQTTJobWithMetrics;

type JobsTableProps = {
  className?: string;
  jobs?: MQTTJobWithMetrics[];
};

export const JobsTable = ({
  className,
  jobs = [],
}: JobsTableProps): JSX.Element => {
  const { t } = useTranslation();

  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const handleClickExpandButton = (clickedRowKey: string) => {
    setExpandedRowKeys((prevState) =>
      prevState.includes(clickedRowKey)
        ? prevState.filter((key) => key !== clickedRowKey)
        : prevState.concat(clickedRowKey)
    );
  };

  const columns: (ColumnType<JobsTableRecord> & { title: string })[] = useMemo(
    () => [
      {
        key: 'topicFilter',
        dataIndex: 'topicFilter',
        title: t('topic-filter_one'),
      },
      {
        key: 'throughput',
        dataIndex: 'throughput',
        title: t('throughput'),
        render: (value) =>
          t('datapoints-per-hour', {
            count: value,
          }),
      },
      {
        key: 'messageCount',
        dataIndex: 'topicFilter',
        title: t('number-of-messages'),
        render: (_, job) =>
          job.metrics.reduce((acc, cur) => acc + cur.sourceMessages, 0),
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: t('status'),
        render: (_, job) =>
          job.status ? (
            <Status
              text={t(`mqtt-job-status-${job.status}`)}
              type={getJobStatusForCogs(job)}
            />
          ) : (
            '-'
          ),
      },
      {
        key: 'expandable',
        dataIndex: 'matches',
        title: '',
        render: (_, record) => (
          <Button
            icon={
              expandedRowKeys.includes(record.key) ? 'ChevronUp' : 'ChevronDown'
            }
            onClick={() => handleClickExpandButton(record.key)}
            size="small"
            type="ghost"
          />
        ),
        width: 48,
      },
    ],
    [expandedRowKeys, t]
  );

  const dataSource = useMemo(
    () => jobs.map((job) => ({ ...job, key: job.externalId })),
    [jobs]
  );

  return (
    <Box className={className}>
      <Content>
        <Table<JobsTableRecord>
          columns={columns}
          dataSource={dataSource}
          emptyContent={null}
          appendTooltipTo={getContainer()}
          pagination={PAGINATION_SETTINGS}
          expandable={{
            showExpandColumn: false,
            expandedRowKeys,
            expandedRowRender: (job) => <LogsTable job={job} />,
          }}
        />
      </Content>
    </Box>
  );
};

const Content = styled.div`
  padding: 8px 16px 16px;

  .ant-table-expanded-row > .ant-table-cell {
  }
`;