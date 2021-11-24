import { Page, PageContent, PageHeader } from 'components/page';
import { TableWrapper } from 'components/table/TableWrapper';
import { useNavigation } from 'hooks/useNavigation';
import { useClassifierId } from 'machines/classifier/hooks/useClassifierSelectors';
import { BottomNavigation } from 'pages/Classifier/components/navigations/BottomNavigation';
import React from 'react';
import { useDocumentsActiveClassifierPipelineMutate } from 'services/query/pipelines/mutate';
import { useDocumentsClassifierByIdQuery } from 'services/query/classifier/query';
import { ClassifierProps } from '../router';
import { MatrixTable } from './components';
import { ReviewModelNavigation } from './components/navigation/ReviewModelNavigation';

// const test = {
//   projectId: 123,
//   name: 'name',
//   createdAt: 1628080015804,
//   status: 'finished',
//   active: true,
//   id: 4784470505715878,
//   metrics: {
//     precision: 0.9450549450549451,
//     recall: 0.9230769230769231,
//     f1Score: 0.9209401709401709,
//     confusionMatrix: [
//       [7, 0, 0, 0, 0, 0, 4],
//       [1, 3, 1, 0, 0, 0, 0],
//       [0, 0, 10, 0, 0, 0, 0],
//       [0, 0, 0, 10, 0, 0, 0],
//       [0, 0, 0, 0, 0, 0, 0],
//       [0, 0, 0, 0, 0, 11, 0],
//       [0, 0, 0, 0, 0, 0, 10],
//       [0, 0, 0, 0, 0, 0, 10],
//       [0, 0, 0, 0, 0, 0, 10],
//       [0, 0, 0, 0, 0, 0, 10],
//       [0, 0, 0, 0, 0, 0, 10],
//       [0, 0, 0, 0, 0, 0, 10],
//       [0, 0, 0, 0, 0, 0, 10],
//       [0, 0, 0, 0, 0, 0, 10],
//     ],
//     labels: [
//       'CORE_DESCRIPTION',
//       'APA_APPLICATION',
//       'PID',
//       'SCIENTIFIC_ARTICLE',
//       'FINAL_WELL_REPORT',
//       'RISK_ASSESSMENT',
//       'Unknown',
//     ],
//   },
// };

export const ReviewModel: React.FC<ClassifierProps> = ({ Widget }) => {
  const { toHome } = useNavigation();

  const classifierId = useClassifierId();
  const { data: classifier } = useDocumentsClassifierByIdQuery(classifierId);

  const { mutateAsync: updateActiveClassifierMutate } =
    useDocumentsActiveClassifierPipelineMutate();

  const handleDeployClassifierClick = () => {
    if (classifier) {
      updateActiveClassifierMutate(classifier.id).then(() => {
        toHome();
      });
    }
  };

  return (
    <Page
      Widget={Widget()}
      BottomNavigation={
        <BottomNavigation>
          <ReviewModelNavigation onDeployClick={handleDeployClassifierClick} />
        </BottomNavigation>
      }
      breadcrumbs={[{ title: 'New classifier' }]}
    >
      <PageHeader title="Review Model" />
      <PageContent>
        <TableWrapper alignValuesCenter stickyHeader stickyFirstColumn>
          <MatrixTable classifier={classifier} />
        </TableWrapper>
      </PageContent>
    </Page>
  );
};
