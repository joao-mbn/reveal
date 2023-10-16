import { getProject } from '@cognite/cdf-utilities';

import { getCogniteSDKClient } from '../../../../../../environments/cogniteSdk';
import { RuleRunDto } from '../../api/codegen';

import { ValidationStatus } from './types';

/** Creates an auth session needed to start a validation job. */
export const createSession = () => {
  const sdk = getCogniteSDKClient();
  return sdk
    .post(`/api/v1/projects/${getProject()}/sessions`, {
      data: {
        items: [{ tokenExchange: true }],
      },
    })
    .then((res) => res.data.items[0]);
};

/**
 * Returns validation status based on the latest rule runs.
 * Validation progress = triggering time + any rule run still being in progress.
 */
export const getValidationStatus = (
  ruleRuns: RuleRunDto[],
  isLoadingRuleRuns: boolean,
  isTriggeringValidation: boolean
): ValidationStatus => {
  if (
    isTriggeringValidation ||
    (ruleRuns.length !== 0 && isLoadingRuleRuns) ||
    ruleRuns.some((rr) => rr.status === 'InProgress')
  ) {
    return 'InProgress';
  }

  const failedCount = ruleRuns.filter((rr) => rr.status === 'Error').length;
  if (failedCount > 0) {
    return 'Error';
  }

  if (ruleRuns.length > 0 && ruleRuns.every((rr) => rr.status === 'Success')) {
    return 'Success';
  }

  return 'Idle';
};
