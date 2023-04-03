import { useQuery, UseQueryOptions } from 'react-query';

import { useSDK } from '@cognite/sdk-provider';
import {
  EventProperty,
  getEventsUniqueValuesByProperty,
  queryKeys,
  transformNewFilterToOldFilter,
} from '@data-exploration-lib/domain-layer';

import {
  InternalEventsFilters,
  OldEventsFilters,
} from '@data-exploration-lib/core';

export const useEventsUniqueValuesByProperty = (
  property: EventProperty,
  query?: string,
  filter?: InternalEventsFilters | OldEventsFilters,
  options?: UseQueryOptions
) => {
  const sdk = useSDK();

  return useQuery(
    queryKeys.eventsUniqueValues(property, query, filter),
    () => {
      return getEventsUniqueValuesByProperty(sdk, property, {
        filter: transformNewFilterToOldFilter(filter),
        aggregateFilter: query ? { prefix: { value: query } } : undefined,
      });
    },
    { ...(options as any) }
  );
};