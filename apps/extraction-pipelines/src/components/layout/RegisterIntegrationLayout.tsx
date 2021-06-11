import React, { FunctionComponent, PropsWithChildren } from 'react';
import { createLink } from '@cognite/cdf-utilities';
import {
  PageWrapper,
  GridBreadCrumbsWrapper,
  MainWithAsidesWrapper,
} from 'styles/StyledPage';
import { INTEGRATIONS_OVERVIEW_PAGE_PATH } from 'routing/RoutingConfig';
import {
  EXTRACTION_PIPELINE_OVERVIEW,
  ADD_EXTRACTION_PIPELINE,
} from 'utils/constants';
import { BackBtn } from 'components/buttons/BackBtn';
import { PageTitle } from 'styles/StyledHeadings';

interface RegisterIntegrationLayoutProps {
  backPath?: string;
}

export const RegisterIntegrationLayout: FunctionComponent<RegisterIntegrationLayoutProps> = ({
  backPath,
  children,
}: PropsWithChildren<RegisterIntegrationLayoutProps>) => {
  return (
    <PageWrapper>
      <GridBreadCrumbsWrapper to={createLink(INTEGRATIONS_OVERVIEW_PAGE_PATH)}>
        {EXTRACTION_PIPELINE_OVERVIEW}
      </GridBreadCrumbsWrapper>
      <PageTitle>{ADD_EXTRACTION_PIPELINE}</PageTitle>
      <MainWithAsidesWrapper>
        {backPath && <BackBtn path={backPath} />}
        {children}
      </MainWithAsidesWrapper>
    </PageWrapper>
  );
};
