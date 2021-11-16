import React from 'react';

import { DEFAULT_FILTER_ITEM_LIMIT } from 'modules/documentSearch/constants';
import { useFacets } from 'modules/documentSearch/selectors';

import { FilterPayload } from '../../types';

import { CheckboxFilter } from './CheckboxFilter';

export const FileTypeFilter: React.FC<FilterPayload> = React.memo(
  ({ title, data, category, ...rest }) => {
    const { filetype } = useFacets();

    return (
      <CheckboxFilter
        title={title}
        category={category}
        docQueryFacetType="filetype"
        categoryData={data}
        resultFacets={filetype}
        defaultNumberOfItemsToDisplay={DEFAULT_FILTER_ITEM_LIMIT}
        {...rest}
      />
    );
  }
);
