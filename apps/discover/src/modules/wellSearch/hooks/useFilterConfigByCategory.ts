import { useMemo } from 'react';

import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import head from 'lodash/head';

import { useProjectConfigByKey } from 'hooks/useProjectConfig';
import { useUserPreferencesMeasurement } from 'hooks/useUserPreferences';
import { Modules } from 'modules/sidebar/types';
import { FilterConfig } from 'modules/wellSearch/types';
import { filterConfigs } from 'modules/wellSearch/utils/sidebarFilters';

import { useEnabledWellSdkV3 } from './useEnabledWellSdkV3';

export const useFilterConfigByCategory = () => {
  const { data: config } = useProjectConfigByKey(Modules.WELLS);

  const enabledWellSDKV3 = useEnabledWellSdkV3();

  const userPreferredUnit = useUserPreferencesMeasurement();

  return useMemo(() => {
    const filteredConfigData = filterConfigs(
      userPreferredUnit,
      config?.well_characteristics_filter?.dls
    )
      .filter((item) => {
        if (enabledWellSDKV3) {
          // if this is explicitly disabled, then don't show the filter
          if (item.enableOnlySdkV3 === false) {
            return false;
          }

          return true;
        }

        // if this is explicitly disabled, then don't show the filter
        if (item.enableOnlySdkV3 === true) {
          return false;
        }

        return true;
      })
      .filter((item) => {
        if (!item.key) return true;
        const filterItem = get(config, item.key);
        return filterItem?.enabled;
      });

    return filterCategoricalData(filteredConfigData);
  }, [config, userPreferredUnit, enabledWellSDKV3]);
};

export const filterCategoricalData = (filteredConfigData: FilterConfig[]) => {
  return Object.values(groupBy(filteredConfigData, 'category')).map(
    (categoryFilterConfigs) => {
      return {
        title: head(categoryFilterConfigs)?.category || '',
        filterConfigs: categoryFilterConfigs,
        filterConfigIds: categoryFilterConfigs.map(
          (filterConfig) => filterConfig.id
        ),
      };
    }
  );
};
