import {
  AccountInfo,
  AuthenticationResult,
  PublicClientApplication,
} from '@azure/msal-node';
import { Logger } from '@platypus/platypus-core';
import QRCode from 'qrcode-terminal';

import { readFromCache, cachePlugin } from '../../utils/msalTokenCache';

import { handleResponse } from './common';

export type DeviceCodeRequest = {
  clientId: string;
  authority: string;
  baseUrl: string;
  account?: string;
  logger: Logger;
};

export const getAccessTokenForDeviceCode = async (
  request: DeviceCodeRequest
) => {
  const { clientId, authority, baseUrl, account: accountString } = request;
  const scopes = [
    `${baseUrl}/IDENTITY`,
    `${baseUrl}/user_impersonation`,
    'offline_access',
  ];
  const pca = new PublicClientApplication({
    auth: {
      clientId,
      authority,
    },
    cache: { cachePlugin },
  });

  const account = accountString
    ? (JSON.parse(accountString) as AccountInfo)
    : undefined;

  // MUST DO: Need to load credentials from local cache store first.
  readFromCache(pca.getTokenCache());

  let authResult: AuthenticationResult | null = null;

  if (account) {
    // try to refresh the token silently otherwise
    try {
      authResult = await pca.acquireTokenSilent({
        account: account,
        scopes: scopes,
      });
      return handleResponse(authResult);
    } catch {
      throw new Error(
        'Failed to authenticate you, make sure you use correct credentials for the sign in.'
      );
    }
  }

  // get `code` for user and complete authentication
  authResult = await pca.acquireTokenByDeviceCode({
    deviceCodeCallback: ({ userCode, verificationUri }) => {
      QRCode.generate(verificationUri, { small: true }, (url) => {
        request.logger.info(
          `To sign in, please use a web browser to open this page:`
        );
        request.logger.log(url);
        request.logger.info(verificationUri);
        request.logger.info(`And enter:`);
        request.logger.info(userCode);
      });
    },
    scopes,
  });

  if (authResult) {
    return handleResponse(authResult);
  }
  throw new Error(
    'Failed to authenticate you, make sure you use correct credentials for the sign in.'
  );
};