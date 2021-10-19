import { useMemo } from 'react';

import useSelector from 'hooks/useSelector';

export const useWellInspect = () => {
  return useSelector((state) => state.wellInspect);
};

export const useInspectSidebarWidth = () => {
  const state = useWellInspect();
  return useMemo(() => state.inspectSidebarWidth, [state.inspectSidebarWidth]);
};

export const useNPTGraphSelectedWellboreData = () => {
  const state = useWellInspect();
  return useMemo(
    () => state.nptGraphSelectedWellboreData,
    [state.nptGraphSelectedWellboreData]
  );
};
