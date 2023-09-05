import React, { useState, useEffect } from 'react';

import { Title } from '@cognite/cogs.js';

import { Flex, TitledSection } from '../../../components/Common';
import { useActiveWorkflow, useJobStatus, useParsingJob } from '../../../hooks';
import { JobStatus } from '../../../modules/types';
import { useWorkflowTotalCounts } from '../../../modules/workflows';

import DiagramActions from './DiagramActions';
import FilterBar from './FilterBar';
import ResultsTable from './ResultsTable';
import ResultsTableEmpty from './ResultsTableEmpty';
import { SelectionFilter } from './types';

export default function SectionResults() {
  const [selectionFilter, setSelectionFilter] = useState<SelectionFilter>({});
  const [showResults, setShowResults] = useState(false);

  const jobStatus = useJobStatus();
  const parsingJob = useParsingJob();

  const isJobDone = jobStatus === 'done' || jobStatus === 'error';
  const shouldShowTable =
    (jobStatus && (isJobDone || jobStatus === 'running')) ||
    parsingJob?.annotationCounts;

  useEffect(() => {
    if (shouldShowTable) setShowResults(true);
    else setShowResults(false);
  }, [parsingJob, shouldShowTable]);

  return (
    <TitledSection
      useCustomPadding
      title={<TitleBar jobStatus={jobStatus} />}
      style={{ width: '100%' }}
    >
      <Flex column style={{ width: '100%' }}>
        {shouldShowTable && (
          <FilterBar
            selectionFilter={selectionFilter}
            setSelectionFilter={setSelectionFilter}
            showLoadingSkeleton={!isJobDone}
          />
        )}
        {showResults && (
          <ResultsTable
            selectionFilter={selectionFilter}
            showLoadingSkeleton={!isJobDone}
          />
        )}
        {!showResults && <ResultsTableEmpty />}
      </Flex>
    </TitledSection>
  );
}

const TitleBar = ({ jobStatus }: { jobStatus: JobStatus }) => {
  const { workflowId } = useActiveWorkflow();
  const { diagrams } = useWorkflowTotalCounts(workflowId);
  const isJobDone = jobStatus === 'done';

  return (
    <Flex row align style={{ width: '100%', justifyContent: 'space-between' }}>
      <Title level={5} style={{ margin: '16px' }}>
        Results preview{' '}
        <span style={{ fontWeight: 'lighter', color: '#8C8C8C' }}>
          {diagrams}
        </span>
      </Title>
      {isJobDone && <DiagramActions />}
    </Flex>
  );
};