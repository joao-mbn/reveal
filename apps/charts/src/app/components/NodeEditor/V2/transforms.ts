/* eslint camelcase: 0 */

import {
  Node,
  FlowElement,
  getIncomers,
  Edge,
  Elements,
  getOutgoers,
  isEdge,
  removeElements,
} from 'react-flow-renderer';

import {
  FunctionNodeData,
  FunctionNodeDataDehydrated,
} from '@charts-app/components/NodeEditor/V2/Nodes/FunctionNode/FunctionNode';
import { NodeDataVariants } from '@charts-app/components/NodeEditor/V2/types';
import {
  ChartWorkflowV2,
  ScheduledCalculation,
} from '@charts-app/models/chart/types';
import { compareVersions } from 'compare-versions';
import { uniqBy } from 'lodash';

import {
  ComputationStep,
  Operation,
  OperationVersionParams,
  OperationVersionParamsTypeEnum,
} from '@cognite/calculation-backend';

import { passthroughOperationDefinition } from './calculations';
import { AUTO_ALIGN_PARAM } from './constants';
import { SourceNodeData } from './Nodes/SourceNode';
import { NodeTypes } from './types';

export function transformParamInput(
  type: OperationVersionParamsTypeEnum,
  value: string
): string | number {
  switch (type) {
    case 'int': {
      if (value === '') return '';
      const parsedInt = parseInt(value, 10);
      return Number.isNaN(parsedInt) ? '' : parsedInt;
    }
    case 'float': {
      if (value === '') return '';
      const parsedFloat = parseFloat(value);
      return Number.isNaN(parsedFloat) ? '' : parsedFloat;
    }
    default:
      return value;
  }
}

const fillReferencedCalculations = (
  workflows: ChartWorkflowV2[],
  elements: Elements = [],
  visitedReferences: { id: string; depth: number }[],
  depth: number
): {
  transformedElements: Elements;
  visitedReferences: { id: string; depth: number }[];
  done: boolean;
} => {
  let transformedElements = [...elements];
  const hasCalculationReference = transformedElements.some(
    (node) => node.type === NodeTypes.SOURCE && node.data.type === 'workflow'
  );
  let shouldTerminate = false;

  if (!hasCalculationReference) {
    return { transformedElements, visitedReferences, done: true };
  }

  // Keep track of visited references to avoid circular dependencies
  const updatedVisitedReferences = [...visitedReferences];

  // Handle calculation references by adding their nodes & connections to current workflow
  const calculationReferences = transformedElements.filter(
    (node) => node.type === NodeTypes.SOURCE && node.data.type === 'workflow'
  );

  calculationReferences.forEach((ref) => {
    const referencedWorkflow = workflows.find(
      ({ id }) => id === ref.data.selectedSourceId
    ) as ChartWorkflowV2;

    if (!referencedWorkflow) {
      shouldTerminate = true;
      return;
    }

    // Only detect potential loops if the repeat depth is above a certain threshold
    const circularDetectionDepthLimit = 1000;
    const isPotentialCircularReference =
      visitedReferences
        .filter((visitedRef) => visitedRef.id === referencedWorkflow.id)
        .sort((a, b) => b.depth - a.depth).length >=
      circularDetectionDepthLimit;

    // Abort if potential circular reference is detected
    if (isPotentialCircularReference) {
      shouldTerminate = true;
      return;
    }

    // Update list of visited references
    if (
      !updatedVisitedReferences.find(
        (visitedRef) =>
          visitedRef.id === referencedWorkflow.id && visitedRef.depth === depth
      )
    ) {
      updatedVisitedReferences.push({ id: referencedWorkflow.id, depth });
    }

    const referencedWorkflowOutput = referencedWorkflow.flow?.elements.find(
      (el) => el.type === NodeTypes.OUTPUT
    );

    const outputEdge = referencedWorkflow.flow?.elements.find(
      (el) =>
        referencedWorkflowOutput &&
        (el as Edge).target === referencedWorkflowOutput.id
    );

    const sourceEdges = elements.filter(
      (el) => (el as Edge).source === ref.id
    ) as Edge[];

    if (!referencedWorkflowOutput || !outputEdge || !sourceEdges.length) {
      shouldTerminate = true;
      return;
    }

    // Remove source reference node
    transformedElements = removeElements([ref], transformedElements);

    // Edges to add (calc ref could have multiple edges connected to nodes)
    const edgesToAdd = sourceEdges.map((sourceEdge) => ({
      ...outputEdge,
      target: sourceEdge.target,
      targetHandle: sourceEdge.targetHandle,
    }));

    // Add nodes and edges from referenced calculation
    transformedElements.push(
      ...(referencedWorkflow.flow?.elements || []).filter(
        (el) => el.id !== referencedWorkflowOutput.id && el.id !== outputEdge.id
      ),
      ...edgesToAdd
    );
  });

  if (shouldTerminate) {
    return {
      transformedElements,
      visitedReferences: updatedVisitedReferences,
      done: true,
    };
  }

  return {
    transformedElements,
    visitedReferences: updatedVisitedReferences,
    done: false,
  };
};

const getOperationFromReactFlowNode = (node: FlowElement) => {
  switch (node.type) {
    case NodeTypes.FUNCTION:
      return (node.data as FunctionNodeData).selectedOperation.op;
    case NodeTypes.OUTPUT:
      return 'PASSTHROUGH';
    default:
      return 'PASSTHROUGH';
  }
};

const getParamsFromReactFlowNode = (
  settings: ChartWorkflowV2['settings'] = { autoAlign: true },
  node: FlowElement<NodeDataVariants>,
  operations: Operation[]
) => {
  if (!node) {
    return {};
  }

  if (node.type !== NodeTypes.FUNCTION) {
    return {};
  }

  const selectedOperation = (node as Node<FunctionNodeData>).data
    ?.selectedOperation;

  const operation = operations.find(
    ({ op }) => selectedOperation?.op?.toLowerCase() === op?.toLowerCase()
  );

  if (!operation) {
    return {};
  }

  const operationVersion = operation.versions.find(
    ({ version }) => selectedOperation?.version === version
  );

  if (!operationVersion) {
    return {};
  }

  const availableParameters = operationVersion.parameters;
  const functionNode = node as Node<FunctionNodeData>;
  let parameterValues = functionNode.data?.parameterValues || {};

  // Add auto-align parameter using the global setting
  if (
    availableParameters.some(
      (p: OperationVersionParams) => p.param === AUTO_ALIGN_PARAM
    )
  ) {
    parameterValues = {
      ...parameterValues,
      [AUTO_ALIGN_PARAM]: settings.autoAlign,
    };
  }

  return parameterValues;
};

const getInputFromReactFlowNode = (node: FlowElement, nodes: FlowElement[]) => {
  switch (node.type) {
    case NodeTypes.FUNCTION:
      return {
        type: 'result',
        value: nodes.findIndex((n) => n.id === node.id),
      };
    case NodeTypes.OUTPUT:
      return {
        type: 'result',
        value: nodes.findIndex((n) => n.id === node.id),
      };
    case NodeTypes.CONSTANT:
      return { type: 'const', value: node.data.value };
    case NodeTypes.SOURCE:
      return {
        type: 'ts',
        value:
          node.data.type === 'timeseries'
            ? (node as Node<SourceNodeData>).data?.selectedSourceId
            : '',
      };
    default:
      return { type: 'unknown', value: 'could not resolve' };
  }
};

function getVersionFromNode(
  node: FlowElement<NodeDataVariants>,
  operations: Operation[]
) {
  switch (node.type) {
    case NodeTypes.FUNCTION: {
      const { selectedOperation } = node.data as FunctionNodeDataDehydrated;

      const operation = operations.find(
        ({ op }) =>
          (node.data as FunctionNodeDataDehydrated).selectedOperation.op === op
      );

      const availableVersions = (operation?.versions || [])
        .map(({ version }) => version)
        .sort(compareVersions);

      if (availableVersions?.includes(selectedOperation.version)) {
        return selectedOperation.version;
      }
      return availableVersions[0] || '1.0';
    }
    default:
      return '1.0';
  }
}

const getInputsFromFunctionNode = (
  node: Node<FunctionNodeData>,
  elements: Elements<any>,
  operations: Operation[]
) => {
  const selectedOperation = (node as Node<FunctionNodeData>).data
    ?.selectedOperation;

  const operation = operations.find(
    ({ op }) => selectedOperation?.op?.toLowerCase() === op?.toLowerCase()
  );

  if (!operation) {
    return [];
  }

  const operationVersion = operation.versions.find(
    ({ version }) => selectedOperation?.version === version
  );

  if (!operationVersion) {
    return [];
  }

  const availableInputs = operationVersion.inputs;

  return availableInputs.map((inputSpecification) => {
    const connection = elements.find((el) => {
      return (
        isEdge(el) &&
        el.target === node.id &&
        el.targetHandle === inputSpecification.param
      );
    });

    if (!connection) {
      return undefined;
    }

    return elements.find(
      ({ id }) => id === (connection as Edge).source
    ) as Node<any>;
  });
};

export const getStepsFromWorkflowReactFlow = (
  workflow: ChartWorkflowV2 | ScheduledCalculation,
  workflows: ChartWorkflowV2[] = [],
  operations: Operation[] = []
): ComputationStep[] => {
  if (!workflow) {
    return [];
  }

  const { flow } = workflow;

  if (!flow) {
    return [];
  }

  const filteredElements = flow.elements.filter((node) => {
    switch (node.type) {
      case NodeTypes.CONSTANT:
      case NodeTypes.FUNCTION:
      case NodeTypes.OUTPUT:
      case NodeTypes.SOURCE:
        return (
          getIncomers(node as Node, flow.elements).length ||
          getOutgoers(node as Node, flow.elements).length
        );
      default:
        return true;
    }
  });

  let elements = filteredElements;
  let visitedReferences = [{ id: workflow.id, depth: 0 }];
  let depth = 1;
  let hasCalculationReference = true;
  let isDoneFilling = false;

  while (!isDoneFilling && hasCalculationReference) {
    hasCalculationReference = elements.some(
      (node) =>
        node.type === NodeTypes.SOURCE &&
        ((node.data as SourceNodeData).type || '') === 'workflow'
    );

    if (!hasCalculationReference) {
      break;
    }

    const result = fillReferencedCalculations(
      workflows,
      elements,
      visitedReferences,
      depth
    );

    elements = result.transformedElements;
    visitedReferences = result.visitedReferences;
    isDoneFilling = result.done;
    depth += 1;
  }

  const outputNode = elements.find(
    (node) => node.type === NodeTypes.OUTPUT
  ) as Node;

  if (!outputNode || elements.length === 0) {
    return [];
  }

  const validNodes: Node[] = [outputNode];

  let loopDetected = false;

  // traversing from output node and all incomers and add it to validNodes until none left.
  function findInputNodes(node: Node, visited: Node[]) {
    const incomers = uniqBy(getIncomers(node as Node, elements), 'id');

    const localLoopDetected = incomers.some((incomer) =>
      visited.includes(incomer)
    );

    if (localLoopDetected) {
      loopDetected = loopDetected || true;
      return null;
    }

    incomers.forEach((incomingNode) => {
      validNodes.unshift(incomingNode);
      findInputNodes(incomingNode, [...visited, incomingNode]);
    });

    return null;
  }

  findInputNodes(outputNode, [outputNode]);

  /**
   * If any loops are detected in the graph we
   * abort and return an empty list of steps
   */
  if (loopDetected) {
    return [];
  }

  const parsedValidNodes = validNodes
    .filter(
      (node) =>
        node.type &&
        [NodeTypes.FUNCTION, NodeTypes.OUTPUT].includes(node.type as NodeTypes)
    )
    .map((node) => {
      return {
        ...node,
        incomers: getIncomers(node as Node, elements),
        parameters: getParamsFromReactFlowNode(
          workflow.settings,
          node,
          operations
        ),
      };
    });

  const steps = parsedValidNodes
    .map((node, i) => {
      const selectedOperation = (node as Node<FunctionNodeData>).data
        ?.selectedOperation;

      const operation =
        operations.find(({ op }) => selectedOperation?.op === op) ||
        passthroughOperationDefinition;

      const operationVersion =
        operation.versions.find(
          ({ version }) => selectedOperation?.version === version
        ) || passthroughOperationDefinition.versions[0];

      const inputs =
        node.type === NodeTypes.FUNCTION
          ? getInputsFromFunctionNode(node, elements, operations)
          : node.incomers;

      const filteredInputNodes = (inputs || []).filter(Boolean) as Node<any>[];

      const filteredInputs = filteredInputNodes
        .map((incomer) => {
          return getInputFromReactFlowNode(incomer, parsedValidNodes);
        })
        .filter(Boolean);

      const assignedInputs = operationVersion?.inputs.map(
        ({ param }, inputIndex) => ({
          ...filteredInputs[inputIndex],
          param,
        })
      );

      return {
        step: i,
        op: getOperationFromReactFlowNode(node),
        version: getVersionFromNode(node, operations),
        inputs: assignedInputs,
        ...(Object.keys(node.parameters).length
          ? { params: node.parameters }
          : {}),
      };
    })
    .filter(Boolean);

  return steps as ComputationStep[];
};