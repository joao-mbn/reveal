import { Flex, Chip } from '@cognite/cogs.js';

import { getReleaseState } from '../../utils/utils';

type ReleaseTagProp = {
  version?: string;
};

const ReleaseTag = ({ version }: ReleaseTagProp): JSX.Element => {
  const releaseState = getReleaseState(version);

  if (!releaseState) {
    return <></>;
  }

  return (
    <Flex gap={6} alignItems="center">
      <Chip selectable label={releaseState} size="x-small" />
    </Flex>
  );
};

export default ReleaseTag;
