// @ts-nocheck
import React from 'react';

import { getContainer } from '@interactive-diagrams-app/utils/utils';
import ConfigProvider from 'antd/lib/config-provider';
import { ids } from 'cogs-variables';

import { Tooltip as CogsTooltip, Modal as CogsModal } from '@cognite/cogs.js';
// import { useGlobalStyles } from '@cognite/cdf-utilities';
// import cogsStyles from '@cognite/cogs.js/dist/cogs.css';

// This will override the appendTo prop on all Tooltips used from cogs
CogsTooltip.defaultProps = {
  ...CogsTooltip.defaultProps,
  appendTo: getContainer,
};

CogsModal.defaultProps = {
  ...CogsModal.defaultProps,
  getContainer: getContainer,
};

export function GlobalStyles(props: { children: React.ReactNode }) {
  // useGlobalStyles([cogsStyles]);
  return (
    <ConfigProvider getPopupContainer={getContainer}>
      <div className={ids.styleScope}>{props.children}</div>
    </ConfigProvider>
  );
}
