import { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ThunkDispatch } from '@reduxjs/toolkit';
import isEqual from 'lodash/isEqual';
import { AnyAction } from 'redux';

import { AppStateContext } from '../context';
import { ResourceType } from '../modules/types';
import {
  getCountAction,
  getActiveWorkflowItems,
  useWorkflowTotalCounts,
} from '../modules/workflows';

import { useActiveWorkflow } from './useActiveWorkflow';

export const useResourceCount = () => {
  const { resourceCount, setResourceCount } = useContext(AppStateContext);
  const dispatch = useDispatch<ThunkDispatch<any, void, AnyAction>>();
  const { workflowId } = useActiveWorkflow();
  const { diagrams, resources } = useWorkflowTotalCounts(workflowId);
  const items = useSelector(getActiveWorkflowItems);

  useEffect(() => {
    if (diagrams === 0) {
      const filter = items.diagrams?.filter;
      const countAction = getCountAction('files');
      dispatch(countAction(filter));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagrams, items]);

  useEffect(() => {
    if (!resources) return;
    const resourceCounts = Object.entries(resources);
    resourceCounts.forEach((resource) => {
      const [resType, resCount] = resource;
      if (resCount !== 0) return;
      const filter = items.resources?.find((r) => r.type === resType)?.filter;
      if (!filter) return;
      const countAction = getCountAction(resType as ResourceType);
      dispatch(countAction(filter));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resources, items]);

  useEffect(() => {
    const newCount = {
      diagrams,
      ...(resources ?? {}),
    };
    if (!isEqual(newCount, resourceCount)) setResourceCount(newCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagrams, resources]);

  return resourceCount;
};