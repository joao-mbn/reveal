import { Button, Flex } from '@cognite/cogs.js';
import { PageHeader } from 'src/components/page';
import { useClassifierName } from 'src/hooks/useClassifierName';
import { useClassifierConfig } from 'src/machines/classifier/hooks/useClassifierSelectors';
import { ClassifierState } from 'src/machines/classifier/types';
import React, { FC } from 'react';
import { useClassifierManageTrainingSetsQuery } from 'src/services/query';
import { useClassifierActions } from 'src/machines/classifier/hooks/useClassifierActions';
import { CommonClassifierPage } from 'src/pages/Classifier/components/ClassifierPage';
import { ClassifierProps } from '../router';
import { LabelsModal } from './components/modal/LabelsModal';
import { ManageTrainingSetNavigation } from './components/navigation/ManageTrainSetNavigation';
import { TrainingSetsTable } from './components/table/TrainingSetsTable';

export const ManageTrainingSets: FC<ClassifierProps> = ({ Widget }) => {
  const { classifierName } = useClassifierName();

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

  return (
    <>
      <CommonClassifierPage
        Widget={Widget}
        Navigation={
          <ManageTrainingSetNavigation disabled={data.length === 0} />
        }
      >
        <PageHeader
          title={classifierName}
          subtitle="Classifier:"
          description={description}
          Action={
            <Flex alignItems="center" gap={8}>
              <Button
                type="primary"
                icon="AddLarge"
                onClick={() => toggleLabelsModal()}
                data-testid="add-labels"
              >
                Add labels
              </Button>
            </Flex>
          }
        />

        <TrainingSetsTable />
      </CommonClassifierPage>
      <LabelsModal
        visible={showLabelsModal}
        toggleVisibility={toggleLabelsModal}
      />
    </>
  );
};
