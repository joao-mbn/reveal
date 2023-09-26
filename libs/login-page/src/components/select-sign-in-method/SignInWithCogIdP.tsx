import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useQuery } from '@tanstack/react-query';
import { parse } from 'query-string';

import { Icon, Chip } from '@cognite/cogs.js';
import {
  cogIdpAuthority,
  cogIdpInternalId,
  getSelectedIdpDetails,
  saveSelectedIdpDetails,
  useCogniteIdPUserManager,
} from '@cognite/login-utils';

import { Microsoft } from '../../components/icons';
import SignInButton from '../../components/sign-in-button/SignInButton';

export default function SignInWithCogniteIdP({
  organization,
  clientId,
  autoInitiate,
}: {
  organization: string;
  clientId: string;
  autoInitiate: boolean;
}) {
  const navigate = useNavigate();

  const { internalId: activeInternalId } = getSelectedIdpDetails() ?? {};
  const active = activeInternalId === cogIdpInternalId;

  const { code } = parse(window.location.search);

  const userManager = useCogniteIdPUserManager({
    authority: cogIdpAuthority,
    client_id: clientId,
  });

  const { data: user, isInitialLoading: isLoading } = useQuery(
    ['cognite_idp', 'user'],
    async () => {
      try {
        if (code) {
          const cdfUser = userManager.signinRedirectCallback();
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          return cdfUser;
        } else {
          return userManager.getUser();
        }
      } finally {
        userManager.clearStaleState();
      }
    },
    { enabled: active }
  );

  useEffect(() => {
    if (user) {
      navigate('/select-project');
    }
  }, [user, navigate]);

  if (isLoading) {
    return <Icon type="Loader" />;
  }

  const initiateSignIn = () => {
    saveSelectedIdpDetails({
      internalId: cogIdpInternalId,
      type: 'COGNITE_IDP',
    });
    userManager.signinRedirect({
      extraQueryParams: {
        organization_hint: organization,
      },
    });
  };

  // If we have a code or user it means we're in the IdP sign-in callback
  const shouldAutoInitiate = autoInitiate && !code && !user;
  if (shouldAutoInitiate) {
    initiateSignIn();
  }

  return (
    <SignInButton
      disabled={isLoading || shouldAutoInitiate}
      isLoading={isLoading || shouldAutoInitiate}
      onClick={initiateSignIn}
      icon={<Microsoft />}
    >
      {'Sign in with Microsoft '}
      <Chip
        type="danger"
        label="Experimental"
        size="x-small"
        hideTooltip
        appearance="solid"
      />
    </SignInButton>
  );
}