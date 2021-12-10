import { Operation } from '@cognite/calculation-backend';
import classNames from 'classnames';
import { memo, useEffect, useState } from 'react';
import { NodeProps, Position } from 'react-flow-renderer';
import styled from 'styled-components/macro';
import { Flex } from '@cognite/cogs.js';
import { NodeTypes } from '../../types';
import {
  AUTO_ALIGN_PARAM,
  FUNCTION_NODE_DRAG_HANDLE_CLASSNAME,
  PIN_MIN_HEIGHT,
} from '../../constants';
import { NodeWrapper } from '../elements';
import NodeHandle from '../NodeHandle';
import NodeWithActionBar from '../NodeWithActionBar';
import FunctionParameterForm from './FunctionParameterForm/FunctionParameterForm';

export type FunctionNodeDataDehydrated = {
  toolFunction: Operation;
  functionData: { [key: string]: any };
  readOnly: boolean;
};

export type FunctionNodeCallbacks = {
  onFunctionDataChange: (
    nodeId: string,
    formData: { [key: string]: any }
  ) => void;
  onDuplicateNode: (nodeId: string, nodeType: NodeTypes) => void;
  onRemoveNode: (nodeId: string) => void;
};

export type FunctionNodeData = FunctionNodeDataDehydrated &
  FunctionNodeCallbacks & {};

const FunctionNode = memo(
  ({ id, data, selected }: NodeProps<FunctionNodeData>) => {
    const {
      toolFunction,
      functionData,
      readOnly,
      onFunctionDataChange,
      onDuplicateNode,
      onRemoveNode,
    } = data;

    const nodeHeight = toolFunction.inputs.length * PIN_MIN_HEIGHT;

    // Remove auto-align parameter so it's not rendered in the form
    const parameters = (toolFunction.parameters || []).filter(
      (p) => p.param !== AUTO_ALIGN_PARAM
    );

    const [areParamsVisible, setAreParamsVisible] = useState<boolean>(false);

    useEffect(() => {
      setAreParamsVisible(false);
    }, [selected]);

    const containerClasses = classNames(FUNCTION_NODE_DRAG_HANDLE_CLASSNAME, {
      selected,
    });

    return (
      <NodeWithActionBar
        capabilities={{
          canEdit: !readOnly && parameters.length > 0,
          canDuplicate: !readOnly,
          canRemove: !readOnly,
          canSeeInfo: Boolean(toolFunction.description),
        }}
        actions={{
          onEditFunctionClick:
            parameters.length > 0
              ? () => setAreParamsVisible((isVisible) => !isVisible)
              : undefined,
          onDuplicateClick: () => onDuplicateNode(id, NodeTypes.CONSTANT),
          onRemoveClick: () => onRemoveNode(id),
        }}
        data={{
          indslFunction: toolFunction,
        }}
        status={{
          isEditing: areParamsVisible,
        }}
        isActionBarVisible={selected}
      >
        <NodeWrapper
          className={containerClasses}
          style={{
            minHeight: nodeHeight,
            position: 'relative',
            padding: 10,
          }}
          onDoubleClick={() =>
            parameters.length && setAreParamsVisible((isVisible) => !isVisible)
          }
        >
          <HandleContainer height={nodeHeight} position="left">
            {toolFunction.inputs.map((input) => (
              <FunctionNodeHandle
                key={input.param}
                id={`${input.param}`}
                type="target"
                position={Position.Left}
              />
            ))}
          </HandleContainer>
          <FunctionName>{toolFunction.name}</FunctionName>
          {!areParamsVisible && (
            <Flex gap={8} justifyContent="space-between" alignItems="center">
              <div>
                {toolFunction.inputs.map(({ param, name }) => (
                  <InputName key={param}>{name}</InputName>
                ))}
              </div>
              <div>
                {toolFunction.outputs.map(({ name }) => (
                  <InputName>{name}</InputName>
                ))}
              </div>
            </Flex>
          )}
          {areParamsVisible && !!parameters.length && (
            <FunctionParameterForm
              nodeId={id}
              parameters={parameters}
              functionData={functionData}
              onFunctionDataChange={(nodeId, formData) => {
                onFunctionDataChange(nodeId, formData);
                setAreParamsVisible(false);
              }}
            />
          )}
          <HandleContainer height={nodeHeight} position="right">
            {toolFunction.outputs.map((output, i) => (
              <FunctionNodeHandle
                key={`out-result-${output.name}`}
                id={`out-result-${i}`}
                type="source"
                position={Position.Right}
              />
            ))}
          </HandleContainer>
        </NodeWrapper>
      </NodeWithActionBar>
    );
  }
);

const HandleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  justify-items: center;
  position: absolute;
  bottom: -3px;
  height: ${(props: { height?: number; position: 'left' | 'right' }) =>
    props.height}px;
  left: ${(props: { height?: number; position: 'left' | 'right' }) =>
    props.position === 'left' ? '-4px' : 'unset'};
  right: ${(props: { height?: number; position: 'left' | 'right' }) =>
    props.position === 'right' ? '-4px' : 'unset'};
  pointer-events: all;
`;

const FunctionNodeHandle = styled(NodeHandle)`
  position: unset;
`;

const FunctionName = styled.span`
  font-weight: 500;
`;

const InputName = styled.p`
  font-size: 10px;
  font-weight: 400;
  line-height: 24px;
  color: var(--cogs-text-color-secondary);
  margin-bottom: 0;
`;

export default FunctionNode;
