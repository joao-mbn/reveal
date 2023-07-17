import { useMemo } from 'react';

import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';

import { DocumentSearchItem } from '@cognite/sdk';

import {
  InternalDocumentFilter,
  ResourceTypes,
} from '@data-exploration-lib/core';

import {
  RelationshipsFilterInternal,
  addDetailViewData,
  buildAdvancedFilterFromDetailViewData,
  useRelatedResourceDataForDetailView,
} from '../../../relationships';
import { TableSortBy } from '../../../types';
import { useDocumentSearchQuery } from '../../service';
import {
  mapFiltersToDocumentSearchFilters,
  mapTableSortByToDocumentSortFields,
} from '../transformers';

export const useRelatedDocumentsQuery = ({
  resourceExternalId,
  relationshipFilter,
  documentFilter = {},
  query,
  sortBy,
  enabled = true,
}: {
  resourceExternalId?: string;
  relationshipFilter?: RelationshipsFilterInternal;
  documentFilter?: InternalDocumentFilter;
  query?: string;
  sortBy?: TableSortBy[];
  enabled?: boolean;
}) => {
  const { data: detailViewRelatedResourcesData } =
    useRelatedResourceDataForDetailView({
      resourceExternalId: resourceExternalId,
      relationshipResourceType: ResourceTypes.File,
      filter: relationshipFilter,
    });

  const filter = useMemo(() => {
    return {
      and: compact([
        buildAdvancedFilterFromDetailViewData(detailViewRelatedResourcesData),
        mapFiltersToDocumentSearchFilters(documentFilter, query),
      ]),
    };
  }, [documentFilter, detailViewRelatedResourcesData, query]);

  const sort = useMemo(
    () => mapTableSortByToDocumentSortFields(sortBy),
    [sortBy]
  );

  const hasRelatedDocuments = !isEmpty(detailViewRelatedResourcesData);

  const { data, isLoading, ...rest } = useDocumentSearchQuery(
    {
      filter,
      sort,
      limit: 20,
    },
    { enabled: enabled && hasRelatedDocuments }
  );

  const transformedData = useMemo(() => {
    const documents = data
      ? data?.pages
          .reduce((result, page) => {
            return [...result, ...page.items];
          }, [] as DocumentSearchItem[])
          .map(({ item }) => item)
      : [];

    return addDetailViewData(documents, detailViewRelatedResourcesData);
  }, [data, detailViewRelatedResourcesData]);

  return {
    data: transformedData,
    isLoading: enabled && hasRelatedDocuments && isLoading,
    ...rest,
  };
};
