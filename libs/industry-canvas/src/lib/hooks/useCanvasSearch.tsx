import { useMemo } from 'react';

import { useDebounce } from 'use-debounce';

import caseInsensitiveIncludes from '../utils/caseInsensitiveIncludes';

const SEARCH_DEBOUNCE_MS = 100;

type UseCanvasSearchProps<T> = {
  canvases: T[];
  searchString: string;
};

type UseCanvasSearchReturnType<T> = {
  filteredCanvases: T[];
};

const useCanvasSearch = <T extends { name: string; externalId: string }>({
  canvases,
  searchString,
}: UseCanvasSearchProps<T>): UseCanvasSearchReturnType<T> => {
  const [debouncedSearchString] = useDebounce(searchString, SEARCH_DEBOUNCE_MS);

  const filteredCanvases = useMemo(
    () =>
      canvases.filter((canvas) =>
        caseInsensitiveIncludes(canvas.name, debouncedSearchString)
      ),
    [debouncedSearchString, canvases]
  );

  return {
    filteredCanvases,
  };
};

export default useCanvasSearch;