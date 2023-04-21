import { Flex } from '@cognite/cogs.js';
import AddNodeButton from 'components/edge-hover-buttons/AddNodeButton';
import DeleteEdgeButton from 'components/edge-hover-buttons/DeleteEdgeButton';
import { useWorkflowBuilderContext } from 'contexts/WorkflowContext';
import { EdgeProps, getBezierPath } from 'reactflow';
import styled from 'styled-components';

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps): JSX.Element => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const { changeEdges } = useWorkflowBuilderContext();

  const midpoint = {
    x: (sourceX + targetX) / 2,
    y: (sourceY + targetY) / 2,
  };

  const deleteEdge = () => {
    changeEdges((edge) => {
      const i = edge.findIndex((e) => e.id === id);
      edge.deleteAt(i);
    });
  };
  return (
    <>
      <EdgeContainer>
        <path
          id={id}
          style={{ ...style, stroke: 'transparent', strokeWidth: 1 }}
          className="react-flow__edge-path"
          d={edgePath}
          markerEnd={markerEnd}
        />
        <path
          id={id}
          style={{ ...style }}
          className="react-flow__edge-path"
          d={edgePath}
          stroke="red"
          strokeWidth={1}
        />
        <foreignObject
          className="node"
          x={midpoint.x}
          y={midpoint.y}
          width="100"
          height="100"
        >
          <Flex gap={10}>
            <AddNodeButton
              className="edge-button"
              xPos={midpoint.x}
              yPos={midpoint.y}
              id={id}
            />
            <DeleteEdgeButton className="edge-button" onDelete={deleteEdge} />
          </Flex>
        </foreignObject>
      </EdgeContainer>
    </>
  );
};

const EdgeContainer = styled.g`
  .edge-button {
    visibility: hidden;
  }

  :hover {
    .edge-button {
      visibility: visible;
    }
  }
`;
