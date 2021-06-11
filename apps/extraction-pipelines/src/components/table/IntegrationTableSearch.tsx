import React from 'react';
import { FilterValue, Row, useAsyncDebounce } from 'react-table';
import { Input } from '@cognite/cogs.js';
import { trackUsage } from 'utils/Metrics';
import {
  EXTRACTION_PIPELINE,
  EXTRACTION_PIPELINES,
  SEARCH,
} from 'utils/constants';
import { StyledTooltip } from 'styles/StyledToolTip';

interface GlobalSearchProps<D extends object> {
  preGlobalFilteredRows: Array<Row<D>>;
  globalFilter: any;
  setGlobalFilter: (filterValue: FilterValue) => void;
}

const IntegrationTableSearch = <D extends object>({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: GlobalSearchProps<D>) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((val) => {
    trackUsage(SEARCH, { query: val });
    setGlobalFilter(val || []);
  }, 200);
  return (
    <StyledTooltip
      content={`Search will filter table based on search criteria. Search eg. ${EXTRACTION_PIPELINE} name, name of users etc.`}
      placement="top-start"
    >
      <Input
        title={`Search all ${EXTRACTION_PIPELINES}`}
        aria-describedby="tippy-1"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        data-testid="search-integrations"
        id="search-integrations"
      />
    </StyledTooltip>
  );
};
export default IntegrationTableSearch;
