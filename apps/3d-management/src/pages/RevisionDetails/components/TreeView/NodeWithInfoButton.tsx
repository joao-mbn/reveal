import React from 'react';

import { Icon } from '@cognite/cogs.js';

import { TREE_NODE_CLASSNAME } from './constants';

type Props = {
  name: string;
};

export function NodeWithInfoButton({ name }: Props) {
  return (
    <div className={TREE_NODE_CLASSNAME}>
      {name}&nbsp;
      <Icon type="Info" />
    </div>
  );
}