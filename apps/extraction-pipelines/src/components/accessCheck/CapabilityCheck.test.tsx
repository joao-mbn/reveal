import React from 'react';
import { screen } from '@testing-library/react';
import { render } from 'utils/test';
import { CapabilityCheck } from 'components/accessCheck/CapabilityCheck';
import { EXTPIPES_READS, INTEGRATIONS_ACL } from 'model/AclAction';
// eslint-disable-next-line
import { useCapabilities } from '@cognite/sdk-react-query-hooks';

describe('CapabilityCheck', () => {
  const text = 'Im the content';
  const content = <p>{text}</p>;
  test('Render content when permission is ok', () => {
    useCapabilities.mockReturnValue({
      isLoading: false,
      data: [{ acl: INTEGRATIONS_ACL, actions: ['READ', 'WRITE'] }],
    });
    render(
      <CapabilityCheck requiredPermissions={EXTPIPES_READS}>
        {content}
      </CapabilityCheck>
    );
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  test('Render error when permission is NOT ok', () => {
    useCapabilities.mockReturnValue({
      isLoading: false,
      data: [{}],
    });
    render(
      <CapabilityCheck requiredPermissions={EXTPIPES_READS}>
        {content}
      </CapabilityCheck>
    );
    expect(
      screen.getByText(
        `You have insufficient access rights to access this feature`
      )
    ).toBeInTheDocument();
    expect(screen.getByText(`datasetsAcl:READ`)).toBeInTheDocument();
  });
});
