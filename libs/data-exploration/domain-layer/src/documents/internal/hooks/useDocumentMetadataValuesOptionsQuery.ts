import { InternalDocumentFilter } from '@data-exploration-lib/core';
import { UseQueryOptions } from 'react-query';
import { useDocumentsMetadataValuesAggregateQuery } from '../../service';

export const useDocumentMetadataValuesOptionsQuery =
  (filter?: InternalDocumentFilter) =>
  (
    metadataKeys?: string | null,
    query?: string,
    options?: UseQueryOptions<any>
  ) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, isLoading } = useDocumentsMetadataValuesAggregateQuery(
      metadataKeys,
      query,
      options
    );

    const transformedOptions = (data || []).map((item) => ({
      label: item.values[0],
      value: item.values[0],
      count: item.count,
    }));

    return { options: transformedOptions, isLoading };
  };