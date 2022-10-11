import React, { useState, useEffect } from 'react';
import { Input } from '@cognite/cogs.js';
import { debounce } from 'lodash';
import { useQueryString } from 'app/hooks/hooks';
import { SEARCH_KEY } from 'app/utils/constants';
import { useFlagFilter } from 'app/hooks';

export const ExplorationSearchBar = () => {
  const [urlQuery, setUrlQuery] = useQueryString(SEARCH_KEY);
  const debouncedSetUrlQuery = debounce(setUrlQuery, 200);
  const [localQuery, setLocalQuery] = useState(urlQuery);
  const isFilterEnabled = useFlagFilter();

  useEffect(() => {
    if (localQuery !== urlQuery) {
      debouncedSetUrlQuery(localQuery);
    }
    return () => debouncedSetUrlQuery.cancel();
  }, [debouncedSetUrlQuery, localQuery, urlQuery]);

  useEffect(() => {
    if (localQuery !== urlQuery) {
      setLocalQuery(urlQuery);
    }
    // Disabeling react-hooks/exhaustive-deps because this should /not/ be
    // triggered when localQuery changes.
    // eslint-disable-next-line
  }, [urlQuery, setLocalQuery]);

  return (
    <Input
      size="large"
      variant="noBorder"
      fullWidth
      style={{
        background: isFilterEnabled ? undefined : 'transparent',
        border: isFilterEnabled ? undefined : 'none',
        outline: isFilterEnabled ? undefined : 'none',
        boxShadow: isFilterEnabled ? undefined : 'none',
      }}
      icon="Search"
      placeholder="Search..."
      onChange={ev => setLocalQuery(ev.target.value)}
      value={localQuery}
    />
  );
};
