import { FunctionComponent, PropsWithChildren } from 'react';

import { isOidcEnv } from '@data-catalog-app/utils/shared';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface OidcCheckProps {}

export const OidcCheck: FunctionComponent<OidcCheckProps> = ({
  children,
}: PropsWithChildren<OidcCheckProps>) => {
  return <>{!isOidcEnv() && <>{children}</>}</>;
};