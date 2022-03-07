import { Table } from '@cognite/cogs.js';
import { LabelDefinition } from '@cognite/sdk';
import { Loading } from 'src/components/states/Loading';
import { useNavigation } from 'src/hooks/useNavigation';
import React from 'react';
import { useClassifierManageTrainingSetsQuery } from 'src/services/query';
import { useLabelsQuery } from 'src/services/query/labels/query';
import { sortByName } from 'src/utils/sort';
import { curateColumns } from './curateLabelsColumns';

export type Labels = LabelDefinition & { id: number };

interface Props {
  onSelectionChange: (event: Labels[]) => void;
  showAllLabels?: boolean;
}
export const LabelsTable: React.FC<Props> = React.memo(
  ({ onSelectionChange, showAllLabels }) => {
    const navigate = useNavigation();

    const { data: labelsData, isLoading } = useLabelsQuery();
    const { data: trainingSetsData } = useClassifierManageTrainingSetsQuery(
      Boolean(showAllLabels)
    );

    const columns = React.useMemo(
      () => curateColumns({ navigate }),
      [navigate]
    );

    // Hide labels that already exists in the classifier's training set.
    const data = React.useMemo(() => {
      if (showAllLabels) {
        return labelsData;
      }

      return labelsData.filter((label) => {
        return !trainingSetsData.some(
          (trainingSet) => trainingSet.id === label.externalId
        );
      });
    }, [labelsData, trainingSetsData, showAllLabels]);

    if (isLoading) {
      return <Loading />;
    }

    return (
      <Table<Labels>
        onSelectionChange={onSelectionChange}
        pagination={false}
        filterable
        dataSource={sortByName(data) as Labels[]}
        columns={columns as any}
      />
    );
  }
);
