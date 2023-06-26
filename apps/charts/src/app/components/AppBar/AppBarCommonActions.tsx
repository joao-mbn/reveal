import { MouseEventHandler } from 'react';

import config from '@charts-app/config/config';
import {
  makeDefaultTranslations,
  translationKeys,
} from '@charts-app/utils/translations';

import { Avatar, Icon, Menu, TopBar } from '@cognite/cogs.js';

const defaultTranslations = makeDefaultTranslations(
  'Help',
  'Charts group on Cognite Hub',
  'Privacy policy',
  'Feedback',
  'Account',
  'Profile',
  'Logout'
);

type Props = {
  userName: string;
  onProfileClick: MouseEventHandler<HTMLElement>;
  onLogoutClick: MouseEventHandler<HTMLElement>;
  translations?: typeof defaultTranslations;
};

function AppBarCommonActions({
  onProfileClick,
  onLogoutClick,
  userName,
  translations,
}: Props) {
  const t = { ...defaultTranslations, ...translations };
  return (
    <TopBar.Actions
      actions={[
        {
          key: 'help',
          name: t.Help,
          component: (
            <span className="downloadChartHide">
              <Icon type="Help" />
            </span>
          ),
          menu: (
            <Menu>
              <Menu.Item
                href={config.cogniteHubGroupUrl}
                style={{
                  color: 'var(--cogs-text-color)',
                }}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore Cogs does not have the correct typing for this element
                target="_blank"
              >
                {t['Charts group on Cognite Hub']}
              </Menu.Item>
              <Menu.Item
                href={config.privacyPolicyUrl}
                style={{
                  color: 'var(--cogs-text-color)',
                }}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore Cogs does not have the correct typing for this element
                target="_blank"
              >
                {t['Privacy policy']}
              </Menu.Item>
              <Menu.Footer>v {config.version.substring(0, 7)}</Menu.Footer>
            </Menu>
          ),
        },
        {
          key: 'avatar',
          component: <Avatar text={userName} />,
          menu: (
            <Menu style={{ minWidth: '140px' }}>
              <Menu.Header>{t.Account}</Menu.Header>
              <Menu.Item
                style={{ color: 'var(--cogs-text-color)' }}
                onClick={onProfileClick}
              >
                {t.Profile}
              </Menu.Item>
              <Menu.Item onClick={onLogoutClick}>{t.Logout}</Menu.Item>
            </Menu>
          ),
        },
      ]}
    />
  );
}

AppBarCommonActions.defaultTranslations = defaultTranslations;
AppBarCommonActions.translationKeys = translationKeys(defaultTranslations);
AppBarCommonActions.translationNamespace = 'AppBarCommonActions';
AppBarCommonActions.displayName = 'AppBarCommonActions';

export default AppBarCommonActions;