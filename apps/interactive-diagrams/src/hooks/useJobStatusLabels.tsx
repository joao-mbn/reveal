import React, { useState, useEffect } from 'react';

import { useJobStatus } from '@interactive-diagrams-app/hooks';
import { JobStatus } from '@interactive-diagrams-app/modules/types';
import ResourcesLoaded from '@interactive-diagrams-app/pages/PageResultsOverview/SectionResults/ResourcesLoaded';

import { ChipProps } from '@cognite/cogs.js';

export const useJobStatusLabels = () => {
  const jobStatus = useJobStatus();
  const labels = jobStatus ? statusLabels[jobStatus] : defaultStatusLabel;

  const [jobLabel, setJobLabel] = useState(labels.jobLabel);
  const [labelVariant, setLabelVariant] = useState<ChipProps['type']>(
    labels.labelVariant
  );
  const [buttonLabel, setButtonLabel] = useState(labels.buttonLabel);

  useEffect(() => {
    setJobLabel(labels.jobLabel);
    setLabelVariant(labels.labelVariant);
    setButtonLabel(labels.buttonLabel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobStatus]);

  return { buttonLabel, jobLabel, labelVariant };
};

type StatusLabel = {
  jobLabel: string;
  labelVariant: ChipProps['type'];
  buttonLabel: string | React.ReactNode;
};

const statusLabels: { [key in JobStatus]: StatusLabel } = {
  incomplete: {
    jobLabel: 'Waiting',
    labelVariant: 'default',
    buttonLabel: 'Run',
  },
  ready: {
    jobLabel: 'Ready to run',
    labelVariant: 'default',
    buttonLabel: 'Run model',
  },
  loading: {
    jobLabel: 'Running...',
    labelVariant: 'neutral',
    buttonLabel: <ResourcesLoaded />,
  },
  running: {
    jobLabel: 'In progress',
    labelVariant: 'neutral',
    buttonLabel: 'Running...',
  },
  done: {
    jobLabel: 'Done',
    labelVariant: 'success',
    buttonLabel: 'Done',
  },
  rejected: {
    // [TODO] differentiate that from error
    jobLabel: 'Failed',
    labelVariant: 'warning',
    buttonLabel: 'Re-run model',
  },
  error: {
    jobLabel: 'Failed',
    labelVariant: 'warning',
    buttonLabel: 'Re-run model',
  },
};

const defaultStatusLabel: StatusLabel = {
  jobLabel: 'Awaiting',
  labelVariant: 'warning',
  buttonLabel: 'Please wait...',
};
