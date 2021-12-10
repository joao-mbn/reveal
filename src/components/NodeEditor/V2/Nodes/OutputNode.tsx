import { memo, useEffect, useState } from 'react';
import { NodeProps, Position } from 'react-flow-renderer';
import { Input } from '@cognite/cogs.js';
import { ColorBlock, InputWrapper, NodeWrapper } from './elements';
import NodeHandle from './NodeHandle';

export type OutputNodeDataDehydrated = { readOnly: boolean };

export type OutputNodeCallbacks = {
  onOutputNameChange: (newName: string) => void;
};

export type OutputNodeData = OutputNodeDataDehydrated &
  OutputNodeCallbacks & {
    color: string;
    name: string;
  };

const OutputNode = memo(({ data, selected }: NodeProps<OutputNodeData>) => {
  const { color, name, readOnly, onOutputNameChange } = data;

  const [localName, setLocalName] = useState(name);

  useEffect(() => {
    setLocalName(name);
  }, [name]);

  return (
    <NodeWrapper className={selected ? 'selected' : ''}>
      <NodeHandle id="datapoints" type="target" position={Position.Left} />
      <div>Output</div>
      {readOnly ? (
        localName
      ) : (
        <InputWrapper>
          <ColorBlock color={color} />
          <Input
            value={localName}
            onChange={(event) => {
              setLocalName(event.target.value);
            }}
            onBlur={() => {
              onOutputNameChange(localName);
            }}
          />
        </InputWrapper>
      )}
    </NodeWrapper>
  );
});

export default OutputNode;
