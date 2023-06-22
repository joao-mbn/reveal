import React from 'react';

import styled from 'styled-components';

import { JobsTable } from '../../components/jobs-table/JobsTable';
import { MessageHistoryChart } from '../../components/message-history-chart/MessageHistoryChart';
import { MQTTSourceWithJobMetrics } from '../../hooks/hostedExtractors';
import { PAGE_WIDTH } from '../../utils/constants';

type HostedExtractionPipelineInsightProps = {
  source: MQTTSourceWithJobMetrics;
};

export const HostedExtractionPipelineInsight = ({
  source,
}: HostedExtractionPipelineInsightProps): JSX.Element => {
  return (
    <InsightGrid>
      <MessageHistorySection jobs={source.jobs} />
      <JobsTableSection jobs={source.jobs} />
    </InsightGrid>
  );
};

const InsightGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-rows: [start] 300px [first] auto [end];
  width: ${PAGE_WIDTH}px;
`;

const MessageHistorySection = styled(MessageHistoryChart)`
  grid-row: start / first;
  margin-bottom: 0;
`;

const JobsTableSection = styled(JobsTable)`
  grid-row: first / end;
`;
