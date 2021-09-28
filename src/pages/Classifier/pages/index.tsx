import { useClassifierCurrentState } from 'machines/classifier/selectors/useClassifierSelectors';
import React, { FC } from 'react';
import { ManageTrainingSets } from './ManageTraningSets';

export const Pages: FC = () => {
  const classifierState = useClassifierCurrentState();

  if (classifierState === 'manage') {
    return <ManageTrainingSets />;
  }

  if (classifierState === 'train') {
    return <p>train</p>;
  }

  if (classifierState === 'results') {
    return <p>results</p>;
  }

  return null;
};
