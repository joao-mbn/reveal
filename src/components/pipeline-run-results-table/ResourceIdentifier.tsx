import { Body, Flex } from '@cognite/cogs.js';

import { useTranslation } from 'common';

type ResourceIdentifierProps = {
  resource?: Record<string, unknown>;
};

const ResourceIdentifier = ({
  resource,
}: ResourceIdentifierProps): JSX.Element => {
  const { t } = useTranslation();

  if (!!resource?.name && typeof resource.name === 'string') {
    return (
      <Flex direction="column">
        <Body level={3}>{t('name')}</Body>
        <Body level={2}>{resource.name}</Body>
      </Flex>
    );
  }

  if (!!resource?.externalId && typeof resource.externalId === 'string') {
    return (
      <Flex direction="column">
        <Body level={3}>{t('external-id')}</Body>
        <Body level={2}>{resource.externalId}</Body>
      </Flex>
    );
  }

  if (!!resource?.id && typeof resource.id === 'string') {
    return (
      <Flex direction="column">
        <Body level={3}>{t('id')}</Body>
        <Body level={2}>{resource.id}</Body>
      </Flex>
    );
  }

  return <>-</>;
};

export default ResourceIdentifier;
