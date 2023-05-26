import styled from 'styled-components';

import { MatchingLabels } from '@data-exploration-lib/domain-layer';
import { Row } from '@tanstack/react-table';
import isEmpty from 'lodash/isEmpty';

import { MatchingLabelsComponent } from './MatchingLabels';

export const SubRowMatchingLabel = <
  T extends {
    matchingLabels?: MatchingLabels;
  }
>(
  row: Row<T>
) => {
  if (isEmpty(row.original.matchingLabels)) {
    return null;
  }

  return (
    <LabelMatcherWrapper key={`matching-label-${row.id}`}>
      {row.original.matchingLabels && (
        <MatchingLabelsComponent
          exact={row.original.matchingLabels.exact}
          partial={row.original.matchingLabels.partial}
          fuzzy={row.original.matchingLabels.fuzzy}
        />
      )}
    </LabelMatcherWrapper>
  );
};

const LabelMatcherWrapper = styled.div`
  display: flex;
  margin-top: 4px;
`;
