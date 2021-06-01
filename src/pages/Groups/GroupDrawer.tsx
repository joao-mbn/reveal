import React, { useState } from 'react';
import { Button as CogsButton } from '@cognite/cogs.js';
import { Drawer, Form, Input, notification } from 'antd';
import styled from 'styled-components';
import { Group, GroupSpec } from '@cognite/sdk';
import { useSDK } from '@cognite/sdk-provider';
import { useMutation, useQueryClient } from 'react-query';
import { sleep } from 'utils/utils';

import CapabilitiesSelector from './CapabilitiesSelector';

const Button = styled(CogsButton)`
  margin-right: 8px;
`;

type Props = {
  group?: Group;
  onClose: () => void;
  onUpdate?: (_: Group) => Promise<void>;
  onCreate?: (_: GroupSpec) => Promise<void>;
};
export default function GroupDrawer({ group, onClose }: Props) {
  const sdk = useSDK();
  const legacyAuth = sdk.getOAuthFlowType() === 'CDF_OAUTH';
  const client = useQueryClient();
  const [caps, setCaps] = useState(group?.capabilities || []);

  const { mutateAsync: updateGroup, isLoading } = useMutation(
    async (g: Group) => {
      // @ts-ignore
      const { name, sourceId, source, capabilities } = g;
      const serviceAccounts = legacyAuth
        ? await sdk.serviceAccounts.list()
        : [];
      const groupAccountIds = serviceAccounts
        .filter(a => !!group?.id && a.groups?.includes(group?.id))
        .map(account => account.id);
      const newGroup = await sdk.groups.create([
        // @ts-ignore
        { name, sourceId, source, capabilities },
      ]);

      if (groupAccountIds.length > 0) {
        await sdk.groups.addServiceAccounts(newGroup[0].id, groupAccountIds);
      }

      if (group?.id) {
        await sdk.groups.delete([group?.id]);
      }
      // eslint-disable-next-line
      // todo: service acconts
      await sleep(500);
      return newGroup;
    },
    {
      onMutate() {
        notification.info({
          key: 'group-update',
          message: `${group ? 'Updating' : 'Creating'} group`,
        });
      },
      onSuccess() {
        client.invalidateQueries(['groups']);
        notification.success({
          key: 'group-update',
          message: `Group ${group ? 'updated' : 'created'}`,
        });
        onClose();
      },
      onError(error) {
        notification.error({
          key: 'group-update',
          message: `Group not ${group ? 'updated' : 'created'}`,
          description: (
            <>
              <p>
                An error occured when ${group ? 'updating' : 'creating'} the
                group
              </p>
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </>
          ),
        });
      },
    }
  );

  return (
    <Drawer visible onClose={onClose} width={720} title="Create new group">
      <Form
        layout="vertical"
        onFinish={(g: Group) => {
          updateGroup({
            ...g,
            capabilities: caps,
          });
        }}
        initialValues={{
          id: group?.id,
          name: group?.name,
          capabilities: group?.capabilities,
          sourceId: group?.sourceId,
          // @ts-ignore
          source: group?.source,
        }}
      >
        <Form.Item
          hasFeedback={isLoading}
          validateStatus="validating"
          name="name"
          label="Unique name"
          rules={[{ required: true, message: 'Please input the group name!' }]}
          extra="Enter a unique name for the group."
        >
          <Input disabled={isLoading} />
        </Form.Item>
        <Form.Item
          hasFeedback={isLoading}
          validateStatus="validating"
          label="Cabability"
          extra={
            <>
              Select the capabilities to add to the group. These capabilities
              grant access to the group to perform particular operations on some
              data.{' '}
              <a
                href="https://docs.cognite.com/dev/guides/iam/authorization.html#capabilities"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </a>
            </>
          }
        >
          <>
            <CapabilitiesSelector value={caps} onChange={c => setCaps(c)} />
          </>
        </Form.Item>

        <Form.Item
          hasFeedback={isLoading}
          validateStatus="validating"
          name="sourceId"
          label="Source ID"
          extra=" Enter the ID of the group exactly as it exists in the source IdP system."
        >
          <Input
            disabled={isLoading}
            placeholder="e.g., Azure AD group global unique identifier"
          />
        </Form.Item>
        <Form.Item
          hasFeedback={isLoading}
          validateStatus="validating"
          name="source"
          label="Source name"
          extra="Enter the name of the group in the source IdP system."
        >
          <Input
            disabled={isLoading}
            placeholder="e.g., Azure AD group descriptor"
          />
        </Form.Item>
        <Form.Item>
          <Button disabled={isLoading} type="primary" htmlType="submit">
            {group ? 'Update' : 'Create'}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
