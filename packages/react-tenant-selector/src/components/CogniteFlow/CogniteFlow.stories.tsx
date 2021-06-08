import { action } from '@storybook/addon-actions';

import { StyledContentWrapper } from '../CardContainer/elements';
import { Error } from '../../components';

import CogniteFlow from './CogniteFlow';

export default {
  title: 'Authentication/CogniteFlow',
};

const cogniteFlowProps = {
  tenant: '',
  loading: false,
  errorList: null,
  tenantError: '',
  onSubmit: action('onSubmit'),
  handleOnChange: action('handleOnChange'),
  setClusterSelectorShown: action('setClusterSelectorShown'),
};

export const Base = () => (
  <StyledContentWrapper>
    <CogniteFlow {...cogniteFlowProps} />
  </StyledContentWrapper>
);

export const WithInitialTenant = () => (
  <StyledContentWrapper>
    <CogniteFlow {...cogniteFlowProps} tenant="initial-tenant" />
  </StyledContentWrapper>
);

export const Loading = () => (
  <StyledContentWrapper>
    <CogniteFlow {...cogniteFlowProps} tenant="initial-tenant" loading />
  </StyledContentWrapper>
);

export const WithError = () => (
  <StyledContentWrapper>
    <CogniteFlow
      {...cogniteFlowProps}
      errorList={
        <Error style={{ marginTop: '16px' }}>This is just a storybook</Error>
      }
    />
  </StyledContentWrapper>
);
