import { ComponentMeta, Story } from '@storybook/react';
import { fullListOfOperations } from 'models/operations/mocks';
import { ComponentProps } from 'react';
import ActionBar from './ActionBar';

export default {
  component: ActionBar,
  title: 'Components/Node Editor/v2/Nodes/Action Bar',
} as ComponentMeta<typeof ActionBar>;

const Template: Story<ComponentProps<typeof ActionBar>> = (args) => (
  <div
    className="z-4"
    style={{
      width: 'fit-content',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 0,
    }}
  >
    <ActionBar {...args} />
  </div>
);

export const ConstantNode = Template.bind({});
export const FunctionNode = Template.bind({});
export const OutputNode = Template.bind({});
export const SourceNode = Template.bind({});

ConstantNode.args = {
  actions: {
    onEditClick: () => {},
    onDuplicateClick: () => {},
    onRemoveClick: () => {},
  },
  capabilities: {
    canEdit: true,
    canRemove: true,
    canDuplicate: true,
    canSeeInfo: false,
  },
  status: {
    isEditing: false,
  },
};

FunctionNode.args = {
  actions: {
    onEditFunctionClick: () => {},
    onDuplicateClick: () => {},
    onRemoveClick: () => {},
    onInfoClick: () => {},
  },
  capabilities: {
    canEdit: true,
    canRemove: true,
    canDuplicate: true,
    canSeeInfo: true,
  },
  status: {
    isEditing: false,
  },
  data: {
    indslFunction: fullListOfOperations[0],
  },
};

SourceNode.args = {
  actions: {
    onEditClick: () => {},
    onDuplicateClick: () => {},
    onRemoveClick: () => {},
  },
  capabilities: {
    canEdit: true,
    canRemove: true,
    canDuplicate: true,
    canSeeInfo: false,
  },
  status: {
    isEditing: false,
  },
};

OutputNode.args = {
  actions: {},
  capabilities: {
    canEdit: false,
    canRemove: false,
    canDuplicate: false,
    canSeeInfo: false,
  },
};
