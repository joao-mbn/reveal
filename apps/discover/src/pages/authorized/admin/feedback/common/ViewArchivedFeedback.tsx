import * as React from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '@cognite/cogs.js';

import { useTranslation } from 'hooks/useTranslation';
import { toggleFeedbackDelete } from 'modules/feedback/actions';

import { useFeedback } from '../Selector';

export const ViewArchivedFeedback: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('Admin');
  const { generalFeedbackShowDeleted } = useFeedback();

  const toggleShowDeleted = () => {
    dispatch(toggleFeedbackDelete());
  };

  return (
    <Button
      data-testid="view-archived"
      toggled={generalFeedbackShowDeleted}
      onClick={toggleShowDeleted}
    >
      {t('View archived')}
    </Button>
  );
};
