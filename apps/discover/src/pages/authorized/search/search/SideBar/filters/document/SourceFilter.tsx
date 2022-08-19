import * as React from 'react';

import { DEFAULT_FILTER_ITEM_LIMIT } from 'modules/documentSearch/constants';

import { FilterPayload } from '../../types';

import { CheckboxFilter } from './CheckboxFilter';

export const SourceFilter: React.FC<FilterPayload> = React.memo(
  ({ title, data, category, ...rest }) => {
    return (
      <CheckboxFilter
        title={title}
        docQueryFacetType="location"
        category={category}
        categoryData={data}
        defaultNumberOfItemsToDisplay={DEFAULT_FILTER_ITEM_LIMIT}
        {...rest}
      />
    );
  }
);
