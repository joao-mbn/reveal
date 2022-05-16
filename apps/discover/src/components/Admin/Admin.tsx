import React from 'react';

import { useUserRoles } from 'services/user/useUserQuery';

export const Admin: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { data: roles } = useUserRoles();

  if (roles && roles.isAdmin) {
    return children as React.ReactElement;
  }

  return null;
};
