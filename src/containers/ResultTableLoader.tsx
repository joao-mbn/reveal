import React from 'react';
import { SelectableItemsProps, TableStateProps } from 'CommonProps';
import { TableProps } from 'components';
import {
  FileInfo,
  Asset,
  CogniteEvent,
  Timeseries,
  Sequence,
} from '@cognite/sdk';
import {
  SearchResultLoader,
  SearchResultLoaderProps,
} from 'containers/SearchResults';
import {
  RelatedResourcesLoader,
  RelatedResourcesLoaderProps,
} from 'containers/Relationships';

type Resource = FileInfo | Asset | CogniteEvent | Sequence | Timeseries;

export const ResultTableLoader = <T extends Resource>({
  excludedIds = [],
  mode = 'search',
  children,
  ...props
}: {
  excludedIds?: number[];
  mode?: 'search' | 'relatedResources';
  children: (tableProps: TableProps<T>) => React.ReactNode;
} & Partial<SearchResultLoaderProps> &
  Partial<RelatedResourcesLoaderProps> &
  Partial<SelectableItemsProps> &
  TableStateProps) => {
  if (mode === 'search') {
    return (
      <SearchResultLoader
        excludedIds={excludedIds}
        {...(props as SearchResultLoaderProps)}
      >
        {children}
      </SearchResultLoader>
    );
  }

  return (
    <RelatedResourcesLoader {...(props as RelatedResourcesLoaderProps)}>
      {children}
    </RelatedResourcesLoader>
  );
};
