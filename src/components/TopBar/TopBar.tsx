import React, { useEffect } from 'react';
import { Avatar, Menu, Title, TopBar, Icon } from '@cognite/cogs.js';
import sidecar from 'config/sidecar';
import { useUserInfo } from '@cognite/sdk-react-query-hooks';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'hooks';
import { useChart, useUpdateChart } from 'hooks/firebase';
import styled from 'styled-components/macro';
import dayjs from 'dayjs';
import { ChartActions } from 'components/TopBar';
import EditableText from 'components/EditableText';
import useChat from 'hooks/useChat';
import { Metrics } from '@cognite/metrics';

const TopBarWrapper = () => {
  const { data: user } = useUserInfo();
  const move = useNavigate();
  const chat = useChat();

  const { chartId } = useParams<{ chartId: string }>();
  const { data: chart } = useChart(chartId);
  const { mutate: updateChart } = useUpdateChart();

  useEffect(() => {
    if (user) {
      Metrics.identify(user.email || user.displayName || user.id);
    }
  }, [user]);

  return (
    <TopBarWrap>
      <TopBar>
        <TopBar.Left>
          <TopBar.Logo title="Cognite Charts" onLogoClick={() => move('')} />
          {!chart && <TopBar.Navigation links={[]} />}
          {!!chart && (
            <>
              <TopBar.Actions
                actions={[
                  {
                    key: 'backToCharts',
                    component: (
                      <span
                        className="downloadChartHide"
                        style={{ color: 'var(--cogs-greyscale-grey9)' }}
                      >
                        ← All charts
                      </span>
                    ),
                    onClick: () => move(''),
                  },
                ]}
              />
              <TopBar.Item>
                <Title level={4} style={{ marginLeft: 17 }}>
                  <EditableText
                    value={chart?.name || ''}
                    onChange={(value) => {
                      if (chart) {
                        updateChart({ ...chart, name: value });
                      }
                    }}
                  />
                </Title>
              </TopBar.Item>
            </>
          )}
        </TopBar.Left>
        <TopBar.Right>
          {!!chart && (
            <>
              <TopBar.Item style={{ borderLeft: 'none' }}>
                <ChartDetails>
                  {dayjs(chart?.updatedAt).format('YYYY-MM-DD')} ·{' '}
                  {chart.userInfo?.displayName ||
                    chart.userInfo?.email ||
                    chart.user}
                </ChartDetails>
              </TopBar.Item>
            </>
          )}
          {/** Need to keep the actions component in DOM even if chart does not exist
           * to ensure update/delete callbacks are working properly */}
          <ChartActions className="downloadChartHide" />
          <TopBar.Actions
            actions={[
              {
                key: 'chat',
                name: 'Feedback',
                component: (
                  <span className="downloadChartHide">
                    <Icon type="SpeechBubble" />
                  </span>
                ),
                onClick: () => chat.show(),
              },
              {
                key: 'help',
                name: 'Help',
                component: (
                  <span className="downloadChartHide">
                    <Icon type="Help" />
                  </span>
                ),
                menu: (
                  <Menu>
                    <Menu.Item
                      onClick={() => window.open(sidecar.privacyPolicyUrl)}
                    >
                      Privacy policy
                    </Menu.Item>
                    <Menu.Footer>
                      v. {process.env.REACT_APP_VERSION_NAME || 'local'}
                    </Menu.Footer>
                  </Menu>
                ),
              },
              {
                key: 'avatar',
                component: (
                  <Avatar
                    text={user?.displayName || user?.email || 'Unknown'}
                  />
                ),
              },
            ]}
          />
        </TopBar.Right>
      </TopBar>
    </TopBarWrap>
  );
};

const ChartDetails = styled.span`
  color: var(--cogs-greyscale-grey6);
  margin: 0 17px;
`;

const TopBarWrap = styled.div`
  background-color: #fff;
`;

export default TopBarWrapper;
