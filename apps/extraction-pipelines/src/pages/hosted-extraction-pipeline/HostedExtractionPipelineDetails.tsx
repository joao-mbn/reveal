import React from 'react';

import { SecondaryTopbar, createLink } from '@cognite/cdf-utilities';
import { Loader, Menu, Tabs } from '@cognite/cogs.js';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { useTranslation } from 'common';
import { StyledHeadingContainer } from 'components/extpipe/ExtpipeHeading';
import { StyledPageContainer } from 'components/styled';
import { useMQTTSourceWithMetrics } from 'hooks/hostedExtractors';

import { HostedExtractionPipelineInsight } from './HostedExtractionPipelineInsight';
import { HostedExtractionPipelineOverview } from './HostedExtractionPipelineOverview';
import { useFlag } from '@cognite/react-feature-flags';

export const HostedExtractionPipelineDetails = (): JSX.Element => {
  const { t } = useTranslation();

  const { externalId = '' } = useParams<{
    externalId: string;
  }>();

  const { isEnabled: shouldShowHostedExtractors, isClientReady } = useFlag(
    'FUSION_HOSTED_EXTRACTORS'
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const detailsTab = searchParams.get('detailsTab') ?? 'overview';

  const { data: source, isFetched } = useMQTTSourceWithMetrics(externalId);

  if (!isFetched || !isClientReady) {
    return <Loader />;
  }

  if (isClientReady && !shouldShowHostedExtractors) {
    return <Navigate replace to={createLink('/extpipes')} />;
  }

  if (!source) {
    return <>not found</>;
  }

  return (
    <StyledPageContainer>
      <StyledHeadingContainer>
        <SecondaryTopbar
          optionsDropdownProps={{ content: <Menu></Menu> }}
          extraContent={
            <TabsContainer>
              <Tabs
                activeKey={detailsTab}
                onTabClick={(key) => {
                  setSearchParams(
                    (prev) => {
                      prev.set('detailsTab', key);
                      return prev;
                    },
                    { replace: true }
                  );
                }}
              >
                <Tabs.Tab tabKey="overview" label={t('overview')} />
                <Tabs.Tab tabKey="insight" label={t('insight')} />
              </Tabs>
            </TabsContainer>
          }
          title={externalId}
        />
      </StyledHeadingContainer>
      <Content>
        {detailsTab === 'insight' ? (
          <HostedExtractionPipelineInsight source={source} />
        ) : (
          <HostedExtractionPipelineOverview source={source} />
        )}
      </Content>
    </StyledPageContainer>
  );
};

const TabsContainer = styled.div`
  .cogs-tabs__list {
    height: 56px;
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px;
`;
