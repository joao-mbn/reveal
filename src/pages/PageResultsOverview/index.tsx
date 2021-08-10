import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import { WorkflowStep } from 'modules/workflows';
import { useActiveWorkflow } from 'hooks';
import { Flex, PageTitle } from 'components/Common';
import { diagramSelection } from 'routes/paths';
import { AppStateContext } from 'context';
// import { TOOLTIP_STRINGS } from 'stringConstants';
import { getSelectedDiagramsIds } from 'pages/PageResultsOverview/selectors';
import { getWorkflowItems } from './selectors';
import SectionProgress from './SectionProgress';
import SectionSetup from './SectionSetup';
import SectionResults from './SectionResults';
import SettingsBar from './SettingsBar';

type Props = {
  step: WorkflowStep;
};

export default function PageResultsOverview(props: Props) {
  const { step } = props;
  const history = useHistory();
  const { tenant } = useContext(AppStateContext);
  const { workflowId } = useActiveWorkflow(step);
  const { workflow } = useSelector(getWorkflowItems(workflowId));
  const selectedDiagramsIds = useSelector(getSelectedDiagramsIds);

  const [jobStarted, setJobStarted] = useState(false);

  const areDiagramsSelected = Boolean(selectedDiagramsIds?.length);

  useEffect(() => {
    if (!workflow) {
      message.error('Invalid data selections');
      history.push(diagramSelection.path(tenant, String(workflowId)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow]);

  // const convertToSvgTooltip = () => {
  //   if (selectedKeys.length === 0)
  //     return TOOLTIP_STRINGS.CONVERT_TO_SVG_NOT_SELECTED;
  //   if (!canDeploy) return TOOLTIP_STRINGS.CONVERT_TO_SVG_DISABLED;
  //   return TOOLTIP_STRINGS.CONVERT_TO_SVG_ALLOWED;
  // };

  return (
    <Flex column style={{ width: '100%', position: 'relative' }}>
      <PageTitle>Run the model</PageTitle>
      <Flex
        row
        style={{
          width: '100%',
          margin: '24px 0 16px 0',
          justifyContent: 'space-between',
        }}
      >
        <SectionSetup jobStarted={jobStarted} setJobStarted={setJobStarted} />
        <SectionProgress />
      </Flex>
      <SectionResults jobStarted={jobStarted} />
      {areDiagramsSelected && <SettingsBar />}
    </Flex>
  );
}
