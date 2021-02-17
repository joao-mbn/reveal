import { useQuery } from 'react-query';
import { getRuns } from '../utils/RunsAPI';
import { useAppEnv } from './useAppEnv';
import { StatusRow } from '../model/Runs';
import { SDKError } from '../model/SDKErrors';

export const useRuns = (externalId?: string) => {
  const { project } = useAppEnv();
  return useQuery<StatusRow[], SDKError>(
    [project, externalId],
    (ctx) => {
      return getRuns(ctx.queryKey[0], ctx.queryKey[1]);
    },
    {
      enabled: !!externalId,
    }
  );
};
