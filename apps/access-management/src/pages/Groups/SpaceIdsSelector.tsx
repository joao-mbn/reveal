import React from 'react';

import { useTranslation } from '@access-management/common/i18n';
import { getContainer } from '@access-management/utils/utils';
import { useQuery } from '@tanstack/react-query';
import Select from 'antd/lib/select';

import sdk from '@cognite/cdf-sdk-singleton';
import { getProject } from '@cognite/cdf-utilities';

interface SpaceIdsSelectorProps {
  value: number[];
  onChange(newSelectedResources: number[]): void;
}

const SpaceIdsSelector = ({
  value = [],
  onChange = () => {},
}: SpaceIdsSelectorProps) => {
  const { t } = useTranslation();

  const { data: spaces, isLoading } = useSpaces();

  return (
    <Select
      mode="tags"
      loading={isLoading}
      value={value}
      placeholder={t('space-id-select-placeholder')}
      onChange={onChange}
      options={spaces?.map((el) => ({
        value: el.space,
        label: `${el.space} ${el.name ? ` (${el.name})` : ''}`,
      }))}
      getPopupContainer={getContainer}
      style={{ width: '100%' }}
    />
  );
};

type Space = {
  space: string;
  description?: string;
  name?: string;
};

const useSpaces = () => {
  const autoPageToArray = async <T,>(
    fn: (cursor?: string) => Promise<{ items: T[]; nextCursor?: string }>,
    cursor?: string
  ): Promise<T[]> => {
    const { items, nextCursor } = await fn(cursor);
    if (nextCursor) {
      return items.concat(await autoPageToArray(fn, nextCursor));
    }
    return items;
  };
  const project = getProject();

  return useQuery(['getSpaces', project], () => {
    return autoPageToArray(
      async (cursor) =>
        (
          await sdk.get<{ items: Space[]; nextCursor?: string }>(
            `/api/v1/projects/${project}/models/spaces`,
            {
              params: {
                cursor,
                limit: 100,
              },
            }
          )
        ).data
    );
  });
};

export default SpaceIdsSelector;
