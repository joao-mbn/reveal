import { useSelector } from '@xstate/react';
import { classifierConfig } from 'configs';
import { useClassifierContext } from 'machines/classifier/contexts/ClassifierContext';
import {
  ClassifierState,
  StepProps,
} from 'pages/Classifier/components/step/types';

export const useClassifierStatus = (): { [x: string]: 'done' | 'failed' } => {
  const { classifierMachine } = useClassifierContext();

  return useSelector(classifierMachine, (store) => store.context.status);
};

export const useClassifierDescription = () => {
  const { classifierMachine } = useClassifierContext();

  return useSelector(classifierMachine, (store) => store.context.description);
};

export const useClassifierCurrentState = () => {
  const { classifierMachine } = useClassifierContext();

  const state = useSelector(classifierMachine!, (machineState) => {
    return machineState.value;
  });

  return state;
};

export const useClassifierCurrentStep = (step: ClassifierState): boolean => {
  const classifierState = useClassifierCurrentState();

  return classifierState === step;
};

export const useClassifierConfig = (
  step: Exclude<ClassifierState, 'complete'>
): StepProps => {
  return classifierConfig().steps[step];
};
