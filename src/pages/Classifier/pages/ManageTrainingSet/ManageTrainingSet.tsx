import { Button, Flex } from '@cognite/cogs.js';
import { PageHeader } from 'components/page';
import { useClassifierParams } from 'hooks/useParams';
import { useClassifierConfig } from 'machines/classifier/hooks/useClassifierSelectors';
import { ClassifierState } from 'machines/classifier/types';
import React, { FC } from 'react';
import { useClassifierManageTrainingSetsQuery } from 'services/query';
import { useClassifierActions } from 'machines/classifier/hooks/useClassifierActions';
import { CommonClassifierPage } from 'pages/Classifier/components/ClassifierPage';
import { useNavigation } from 'hooks/useNavigation';
import { ClassifierProps } from '../router';
import { LabelsModal } from './components/modal/LabelsModal';
import { ManageTrainingSetNavigation } from './components/navigation/ManageTrainSetNavigation';
import { TrainingSetsTable } from './components/table/TrainingSetsTable';

export const ManageTrainingSets: FC<ClassifierProps> = ({ Widget }) => {
  const { toLabels } = useNavigation();
  const { classifierName } = useClassifierParams();

  const { description } = useClassifierConfig(ClassifierState.MANAGE);
  const { updateDescription } = useClassifierActions();

  const { data } = useClassifierManageTrainingSetsQuery();

  const [showLabelsModal, setShowLabelsModal] = React.useState(false);
  const toggleLabelsModal = React.useCallback(() => {
    setShowLabelsModal((prevState) => !prevState);
  }, []);

  React.useEffect(() => {
    updateDescription({
      [ClassifierState.MANAGE]: `${data.length} labels selected`,
    });
  }, [data, updateDescription]);

  if (showLabelsModal) {
    return (
      <LabelsModal
        visible={showLabelsModal}
        toggleVisibility={toggleLabelsModal}
      />
    );
  }

  return (
    <CommonClassifierPage
      Widget={Widget}
      Navigation={<ManageTrainingSetNavigation disabled={data.length === 0} />}
    >
      <PageHeader
        title={classifierName}
        subtitle="Classifier:"
        description={description}
        Action={
          <Flex alignItems="center" gap={8}>
            {/* <Body level={2}>{data.length} labels</Body> */}
            <Button onClick={() => toLabels()}>Manage labels</Button>
            <Button
              type="primary"
              icon="AddLarge"
              onClick={() => toggleLabelsModal()}
            >
              Add labels
            </Button>
          </Flex>
        }
      />

      <TrainingSetsTable />
    </CommonClassifierPage>
  );
};
