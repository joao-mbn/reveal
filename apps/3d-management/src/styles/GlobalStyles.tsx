import antdTableStyles from '@3d-management/styles/antd/antdTableStyles';
import antdGlobalStyles from '@3d-management/styles/antd/antdGlobalStyles';
import React from 'react';
import { useGlobalStyles } from '@cognite/cdf-utilities';
import cogsStyles from '@cognite/cogs.js/dist/cogs.css';
import { getContainer } from '@3d-management/utils';
import { styleScope } from '@3d-management/utils/styleScope';
import { ConfigProvider } from 'antd';
import appGlobalStyles from './global.css';

export default function AntStyles(props: React.PropsWithChildren<any>) {
  useGlobalStyles([
    appGlobalStyles,
    cogsStyles,
    ...antdGlobalStyles,
    ...antdTableStyles,
  ]);

  return (
    <ConfigProvider getPopupContainer={getContainer}>
      <div className={styleScope}>{props.children}</div>
    </ConfigProvider>
  );
}
