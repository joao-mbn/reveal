import styled from 'styled-components';

import { useLoadDataSource, useLoadRules } from '@data-quality/hooks';
import { emptyDatapoints } from '@data-quality/utils/validationTimeseries';
import { BasicPlaceholder } from '@platypus-app/components/BasicPlaceholder/BasicPlaceholder';
import { Spinner } from '@platypus-app/components/Spinner/Spinner';
import { useTranslation } from '@platypus-app/hooks/useTranslation';

import { Body, Detail, Flex, Overline } from '@cognite/cogs.js';

import { useDataSourceValidity } from './useDataSourceValidity';
import { ValidationStatistics } from './ValidationStatistics';

export const TotalValidityCard = () => {
  const { t } = useTranslation('TotalValidityCard');

  const { dataSource } = useLoadDataSource();
  const { error: errorRules, loadingRules } = useLoadRules();
  const { datapoints, loadingDatapoints } = useDataSourceValidity();

  const isLoading = loadingRules || loadingDatapoints;
  const isError = errorRules;
  const noValidationScore = !datapoints || emptyDatapoints(datapoints);

  const renderContent = () => {
    if (isLoading)
      return (
        <div>
          <Spinner size={14} />
        </div>
      );

    if (isError || !dataSource)
      return (
        <BasicPlaceholder
          type="EmptyStateFolderSad"
          title={t(
            'data_quality_not_found_ds_validity',
            "Something went wrong. We couldn't load the validity of the data source."
          )}
        >
          <Body level={5}>{JSON.stringify(errorRules)}</Body>
        </BasicPlaceholder>
      );

    if (noValidationScore)
      return (
        <Detail muted>
          <i>
            {t(
              'data_quality_no_score',
              'No score yet. Validate now to get the quality of your data.'
            )}
          </i>
        </Detail>
      );

    return (
      <Flex direction="column">
        <ValidationStatistics dataSourceId={dataSource.externalId} />
        {/* Add here the graph */}
      </Flex>
    );
  };

  return (
    <Card>
      <Overline level={3}>
        {t('data_quality_total_validity', 'Total validity')}
      </Overline>

      {renderContent()}
    </Card>
  );
};

const Card = styled.div`
  border-radius: 6px;
  box-shadow: var(--cogs-elevation--surface--interactive);
  overflow: auto;
  padding: 0.5rem 1.5rem 2rem 1.5rem;
  width: min(40vw, 600px);

  .cogs-overline-3 {
    margin-bottom: 1rem;
  }
`;