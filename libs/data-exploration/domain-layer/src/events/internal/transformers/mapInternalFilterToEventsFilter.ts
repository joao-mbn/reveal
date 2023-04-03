import { EventFilter } from '@cognite/sdk/dist/src';
import { InternalEventsFilters } from '@data-exploration-lib/core';
import isEmpty from 'lodash/isEmpty';

export const mapInternalFilterToEventsFilter = ({
  assetSubtreeIds,
}: InternalEventsFilters): EventFilter | undefined => {
  let filters: EventFilter = {};

  if (assetSubtreeIds && assetSubtreeIds.length > 0) {
    filters = {
      ...filters,
      assetSubtreeIds: assetSubtreeIds.map(({ value }) => ({
        id: value,
      })),
    };
  }

  return !isEmpty(filters) ? filters : undefined;
};