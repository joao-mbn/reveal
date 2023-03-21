import { DateRange } from '@cognite/sdk';

export type InternalCommonFilters = {
  assetSubtreeIds?: { label?: string; value: number }[];
  dataSetIds?: { label?: string; value: number }[];
  // metadata?: Metadata;
  createdTime?: DateRange;
  lastUpdatedTime?: DateRange;
  externalIdPrefix?: string;
  internalId?: number;
};

export interface MatchingLabels {
  exact: string[];
  partial: string[];
  fuzzy: string[];
}

export type Order = 'asc' | 'desc';

export type InternalSortBy = {
  property: string[];
  order: Order;
};

export type TableSortBy = {
  id: string;
  desc: boolean;
};

export interface MatchingLabels {
  exact: string[];
  partial: string[];
  fuzzy: string[];
}