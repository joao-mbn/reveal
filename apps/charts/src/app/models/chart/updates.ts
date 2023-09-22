import {
  Edge,
  Elements,
  FlowElement,
  FlowExportObject,
  Node,
} from 'react-flow-renderer';

import { ConstantNodeDataDehydrated } from '@charts-app/components/NodeEditor/V2/Nodes/ConstantNode';
import { FunctionNodeDataDehydrated } from '@charts-app/components/NodeEditor/V2/Nodes/FunctionNode/FunctionNode';
import { SourceNodeDataDehydrated } from '@charts-app/components/NodeEditor/V2/Nodes/SourceNode';
import {
  NodeDataDehydratedVariants,
  NodeTypes,
} from '@charts-app/components/NodeEditor/V2/types';
import { initializeParameterValues } from '@charts-app/components/NodeEditor/V2/utils';
import { AxisUpdate } from '@charts-app/components/PlotlyChart/utils';
import { calcDeepCloneAndReplaceNodeElementsId } from '@charts-app/utils/calculations';
import { getEntryColor } from '@charts-app/utils/colors';
import { compareVersions } from 'compare-versions';
import dayjs from 'dayjs';
import { omit } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { Operation } from '@cognite/calculation-backend';
import {
  Chart,
  ChartSource,
  ChartTimeSeries,
  ChartWorkflow,
  ChartWorkflowV2,
  ScheduledCalculation,
  SourceCollectionData,
  CollectionType,
  StorableNode,
} from '@cognite/charts-lib';
import { Timeseries } from '@cognite/sdk';

import { removeItem, addItem } from './helpers';

function updateCollItem<T extends ChartSource>(
  chart: Chart,
  collectionType: CollectionType,
  collId: string,
  diff: Partial<T>
): Chart {
  return {
    ...chart,
    [collectionType]: chart[collectionType]?.map((t) =>
      t.id === collId
        ? {
            ...t,
            ...diff,
          }
        : t
    ),
  };
}

export function updateTimeseries(
  chart: Chart,
  tsId: string,
  update: Partial<ChartTimeSeries>
): Chart {
  return updateCollItem<ChartTimeSeries>(
    chart,
    'timeSeriesCollection',
    tsId,
    update
  );
}

export const updateScheduledCalculation = (
  chart: Chart,
  scId: string,
  update: Partial<ScheduledCalculation>
): Chart => {
  return updateCollItem<ScheduledCalculation>(
    chart,
    'scheduledCalculationCollection',
    scId,
    update
  );
};

export function removeTimeseries(chart: Chart, tsId: string): Chart {
  return removeItem(chart, 'timeSeriesCollection', tsId);
}

export function addTimeseries(chart: Chart, ts: ChartTimeSeries): Chart {
  return addItem(chart, 'timeSeriesCollection', ts);
}

export function updateWorkflow(
  chart: Chart,
  tsId: string,
  update: Partial<ChartWorkflow>
): Chart {
  return updateCollItem<ChartWorkflow>(
    chart,
    'workflowCollection',
    tsId,
    update
  );
}

export function updateChartSource(
  chart: Chart,
  id: string,
  diff: Partial<ChartTimeSeries | ChartWorkflow>
) {
  return {
    ...chart,
    timeSeriesCollection: chart.timeSeriesCollection?.map((ts) =>
      ts.id === id
        ? {
            ...(ts as ChartTimeSeries),
            ...(diff as Partial<ChartTimeSeries>),
          }
        : ts
    ),
    workflowCollection: chart.workflowCollection?.map((wf) =>
      wf.id === id
        ? {
            ...(wf as ChartWorkflowV2),
            ...(diff as Partial<ChartWorkflowV2>),
          }
        : wf
    ),
    scheduledCalculationCollection: chart.scheduledCalculationCollection?.map(
      (sc) =>
        sc.id === id
          ? {
              ...(sc as ScheduledCalculation),
              ...(diff as Partial<ScheduledCalculation>),
            }
          : sc
    ),
  };
}

export function removeWorkflow(chart: Chart, wfId: string): Chart {
  return removeItem(chart, 'workflowCollection', wfId);
}

export function removeSource(chart: Chart, sourceId: string): Chart {
  return {
    ...chart,
    timeSeriesCollection: chart.timeSeriesCollection?.filter(
      ({ id }) => id !== sourceId
    ),
    workflowCollection: chart.workflowCollection?.filter(
      ({ id }) => id !== sourceId
    ),
    scheduledCalculationCollection:
      chart.scheduledCalculationCollection?.filter(({ id }) => id !== sourceId),
    sourceCollection: chart.sourceCollection?.filter(
      ({ id }) => id !== sourceId
    ),
  };
}

export function duplicateWorkflow(chart: Chart, wfId: string): Chart {
  const wf = chart.workflowCollection?.find((w) => w.id === wfId);
  if (wf) {
    const clonedWf = calcDeepCloneAndReplaceNodeElementsId(wf);

    const newWf = {
      ...clonedWf,
      id: uuidv4(),
      name: `${clonedWf.name} Copy`,
      color: getEntryColor(chart.id, clonedWf.id),
    };
    return addWorkflow(chart, newWf);
  }
  return chart;
}

export function addWorkflow(chart: Chart, wf: ChartWorkflow): Chart {
  return addItem(chart, 'workflowCollection', wf);
}

export function addWorkflows(chart: Chart, wfs: ChartWorkflow[]): Chart {
  return wfs.reduce(
    (oldChart, wf) => addItem(oldChart, 'workflowCollection', wf),
    chart
  );
}

export function convertTSToChartTS(
  ts: Pick<
    Timeseries,
    'name' | 'externalId' | 'id' | 'unit' | 'isStep' | 'description'
  >,
  chartId: string,
  range: number[] = []
): ChartTimeSeries {
  return {
    id: uuidv4(),
    name: ts.name || ts.externalId || ts.id.toString(),
    tsId: ts.id,
    tsExternalId: ts.externalId,
    unit: ts.unit || '',
    type: 'timeseries',
    originalUnit: ts.unit || '',
    preferredUnit: ts.unit || '',
    color: getEntryColor(chartId, ts.id.toString()),
    lineWeight: 1,
    lineStyle: 'solid',
    interpolation: ts.isStep ? 'hv' : 'linear',
    displayMode: 'lines',
    enabled: true,
    description: ts.description || '-',
    range,
    createdAt: Date.now(),
  };
}

export function initializeSourceCollection(chart: Chart): Chart {
  return {
    ...chart,
    sourceCollection: [
      ...(chart?.timeSeriesCollection || []).map((ts) => ({
        type: ts.type ?? 'timeseries',
        id: ts.id,
      })),
      ...(chart?.workflowCollection || []).map((flow) => ({
        id: flow.id,
        type: flow.type ?? 'workflow',
      })),
    ] as SourceCollectionData[],
  };
}

export function updateSourceAxisForChart(
  chart: Chart,
  { x, y }: { x: string[]; y: AxisUpdate[] }
): Chart {
  const updatedChart = {
    ...chart,
    ...(x.length === 2
      ? {
          dateFrom: `${x[0]}`,
          dateTo: `${x[1]}`,
        }
      : {}),
    ...(y.length > 0
      ? {
          timeSeriesCollection: chart.timeSeriesCollection?.map((ts) => {
            const correspondingUpdate = y.find((update) => update.id === ts.id);
            return correspondingUpdate
              ? { ...ts, range: correspondingUpdate.range }
              : ts;
          }),
          workflowCollection: chart.workflowCollection?.map((wf) => {
            const correspondingUpdate = y.find((update) => update.id === wf.id);
            return correspondingUpdate
              ? { ...wf, range: correspondingUpdate.range }
              : wf;
          }),
        }
      : {}),
  };

  return updatedChart;
}

/**
 * function updateVisibilityForAllSources
 * @param chart Charts object
 * @param enabled Boolean value to maintain charts rows visibility
 * @returns Updated charts object with all rows of both collection [Timeseries/Workflow] enable status to be uniform.
 */
export const updateVisibilityForAllSources = (
  chart: Chart,
  enabled: boolean
) => {
  return {
    ...chart,
    timeSeriesCollection: chart.timeSeriesCollection?.map((ts) => ({
      ...ts,
      enabled,
    })),
    workflowCollection: chart.workflowCollection?.map((ts) => ({
      ...ts,
      enabled,
    })),
    scheduledCalculationCollection: chart.scheduledCalculationCollection?.map(
      (sc) => ({
        ...sc,
        enabled,
      })
    ),
  };
};

export const updateChartDateRange = (
  chart: Chart,
  dateFrom: Date | string | undefined,
  dateTo: Date | string | undefined
) => {
  const requestedDateFrom = dayjs(dateFrom || chart.dateFrom!);
  const requestedDateTo = dayjs(dateTo || chart.dateTo!);
  const isFromAfterTo = requestedDateFrom.isAfter(requestedDateTo);
  const newDateFrom = isFromAfterTo ? requestedDateTo : requestedDateFrom;
  const newDateTo = isFromAfterTo ? requestedDateFrom : requestedDateTo;

  return {
    ...chart,
    dateFrom: newDateFrom.toJSON(),
    dateTo: newDateTo.toJSON(),
  };
};

export const updateSourceCollectionOrder = (
  chart: Chart,
  fromIndex: number,
  toIndex: number
) => {
  const sourceCollection = chart.sourceCollection || [];
  const sourceCollectionCopy = sourceCollection.slice();
  const [removed] = sourceCollectionCopy.splice(fromIndex, 1);
  sourceCollectionCopy.splice(toIndex, 0, removed);

  return {
    ...chart,
    sourceCollection: sourceCollectionCopy,
  };
};

/**
 * Migration to introduce versions for operations in calculations
 */
export const updateWorkflowsToSupportVersions = (chart: Chart): Chart => {
  return {
    ...chart,
    workflowCollection: (chart.workflowCollection || []).map((workflow) => {
      if (workflow.version === 'v2') {
        return {
          ...workflow,
          flow: {
            ...workflow.flow!,
            elements: (workflow.flow?.elements || []).map((el) => {
              switch (el.type) {
                case NodeTypes.FUNCTION: {
                  const elData = el.data as FunctionNodeDataDehydrated;

                  return {
                    ...(el as FlowElement<FunctionNodeDataDehydrated>),
                    data: {
                      ...elData,
                      selectedOperation: elData.selectedOperation
                        ? {
                            ...elData.selectedOperation,
                            version:
                              elData.selectedOperation.version === '0.0'
                                ? '1.0'
                                : elData.selectedOperation.version || '1.0',
                          }
                        : {
                            op: (elData as StorableNode).toolFunction.op,
                            version: '1.0',
                          },
                      parameterValues: elData.parameterValues
                        ? elData.parameterValues
                        : (elData as StorableNode).functionData,
                    } as FunctionNodeDataDehydrated,
                  };
                }
                default:
                  return el;
              }
            }),
          },
        };
      }
      return workflow;
    }),
  };
};

export const getUpgradedOperationName = (operationName: string) => {
  let opName = operationName;

  switch (opName) {
    case 'T_RES_DETECTOR':
      opName = 'extreme';
      break;
    case 'OUTLIER_DETECTOR':
      opName = 'extreme';
      break;
    case 'DRIFT_DETECTOR':
      opName = 'drift';
      break;
    case 'SS_DETECTOR':
      opName = 'ssid';
      break;
    case 'VARIABLE_MA':
      opName = 'vma';
      break;
    case 'STATUS_FLAG_FILTER':
      opName = 'status_flag_filter';
      break;
    case 'WAVELET_FILTER':
      opName = 'wavelet_filter';
      break;
    case 'ARMA_FORECAST':
      opName = 'arma_predictor';
      break;
    case 'PI_CALC':
      opName = 'productivity_index';
      break;
    case 'SHUTIN_CALC':
      opName = 'calculate_shutin_interval';
      break;
    case 'POLY_REGRESSOR':
      opName = 'poly_regression';
      break;
    case 'INTERPOLATE':
      opName = 'interpolate';
      break;
    case 'RESAMPLE':
      opName = 'resample_to_granularity';
      break;
    case 'RESAMPLE_EXTENDED':
      opName = 'resample';
      break;
    case 'ALMA_SMOOTHER':
      opName = 'alma';
      break;
    case 'ARMA_SMOOTHER':
      opName = 'arma';
      break;
    case 'BTR_SMOOTHER':
      opName = 'butterworth';
      break;
    case 'CHB_SMOOTHER':
      opName = 'chebyshev';
      break;
    case 'EXP_WMA':
      opName = 'ewma';
      break;
    case 'LINEAR_WMA':
      opName = 'lwma';
      break;
    case 'SG_SMOOTHER':
      opName = 'sg';
      break;
    case 'SIMPLE_MA':
      opName = 'sma';
      break;
    case 'OUTLIERS_REMOVE':
      opName = 'remove_outliers';
      break;
    case 'EXP':
      opName = 'exp';
      break;
    case 'LOG':
      opName = 'log';
      break;
    case 'LOG2':
      opName = 'log2';
      break;
    case 'LOG10':
      opName = 'log10';
      break;
    case 'LOGN':
      opName = 'logn';
      break;
    case 'INTEGRATE':
      opName = 'trapezoidal_integration';
      break;
    case 'DDX':
      opName = 'differentiate';
      break;
    case 'ADD':
      opName = 'add';
      break;
    case 'SUB':
      opName = 'sub';
      break;
    case 'MUL':
      opName = 'mul';
      break;
    case 'DIV':
      opName = 'div';
      break;
    case 'POW':
      opName = 'power';
      break;
    case 'INV':
      opName = 'inv';
      break;
    case 'SQRT':
      opName = 'sqrt';
      break;
    case 'NEG':
      opName = 'neg';
      break;
    case 'ABS':
      opName = 'absolute';
      break;
    case 'MOD':
      opName = 'mod';
      break;
    case 'SIN':
      opName = 'sin';
      break;
    case 'COS':
      opName = 'cos';
      break;
    case 'TAN':
      opName = 'tan';
      break;
    case 'ARCSIN':
      opName = 'arcsin';
      break;
    case 'ARCCOS':
      opName = 'arccos';
      break;
    case 'ARCTAN':
      opName = 'arctan';
      break;
    case 'ARCTAN2':
      opName = 'arctan2';
      break;
    case 'DEG2RAD':
      opName = 'deg2rad';
      break;
    case 'RAD2DEG':
      opName = 'rad2deg';
      break;
    case 'SINH':
      opName = 'sinh';
      break;
    case 'COSH':
      opName = 'cosh';
      break;
    case 'TANH':
      opName = 'tanh';
      break;
    case 'ARCSINH':
      opName = 'arcsinh';
      break;
    case 'ARCCOSH':
      opName = 'arccosh';
      break;
    case 'ARCTANH':
      opName = 'arctanh';
      break;
    case 'ROUND':
      opName = 'round';
      break;
    case 'FLOOR':
      opName = 'floor';
      break;
    case 'CEIL':
      opName = 'ceil';
      break;
    case 'SIGN':
      opName = 'sign';
      break;
    case 'CLIP':
      opName = 'clip';
      break;
    case 'MAX':
      opName = 'maximum';
      break;
    case 'MIN':
      opName = 'minimum';
      break;
    case 'BIN_MAP':
      opName = 'bin_map';
      break;
  }

  return opName;
};

/**
 * Migration to introduce versions for operations in calculations
 */
export const updateWorkflowsFromV1toV2 = (
  chart: Chart,
  operations: Operation[]
): Chart => {
  return {
    ...chart,
    workflowCollection: (chart.workflowCollection || []).map((workflow) => {
      if (workflow.version !== 'v2') {
        const existingNodes = workflow.nodes || [];
        const existingConnections = Object.values(workflow.connections || {});

        const convertedNodes: (
          | FlowElement<NodeDataDehydratedVariants>
          | undefined
        )[] = existingNodes
          .map((node) => {
            switch (node.functionEffectReference) {
              case 'CONSTANT': {
                return {
                  id: node.id,
                  type: NodeTypes.CONSTANT,
                  position: { x: node.x, y: node.y },
                  data: {
                    value: node.functionData.value,
                  } as ConstantNodeDataDehydrated,
                } as Node<ConstantNodeDataDehydrated>;
              }
              case 'TOOLBOX_FUNCTION': {
                const inputOpName = node.functionData?.toolFunction?.op;
                const opName = getUpgradedOperationName(inputOpName);
                const operation = operations.find(({ op }) => op === opName);

                if (!operation) {
                  return undefined;
                }

                const oldestVersion = (operation?.versions || [])
                  .slice()
                  .sort((a, b) => compareVersions(b.version, a.version))[0];

                if (!oldestVersion) {
                  return undefined;
                }

                const defaultParamValues = oldestVersion
                  ? initializeParameterValues(oldestVersion)
                  : {};

                return {
                  id: node.id,
                  type: NodeTypes.FUNCTION,
                  position: { x: node.x, y: node.y },
                  data: {
                    parameterValues: {
                      ...defaultParamValues,
                      ...(omit(node.functionData, 'toolFunction') || {}),
                    },
                    selectedOperation: {
                      op: node.functionData.toolFunction.op,
                      version: node.functionData.toolFunction.version,
                    },
                  } as FunctionNodeDataDehydrated,
                } as Node<FunctionNodeDataDehydrated>;
              }
              case 'SOURCE_REFERENCE': {
                let sourceId = node.functionData?.sourceId;

                if (node.functionData.type === 'timeseries') {
                  sourceId =
                    (chart.timeSeriesCollection || []).find(
                      (ts) => ts.tsExternalId === node.functionData.sourceId
                    )?.id || '';
                }

                return {
                  id: node.id,
                  type: NodeTypes.SOURCE,
                  position: { x: node.x, y: node.y },
                  data: {
                    selectedSourceId: sourceId,
                    type: node.functionData.type,
                  } as SourceNodeDataDehydrated,
                } as Node<SourceNodeDataDehydrated>;
              }
              case 'TIME_SERIES_REFERENCE': {
                const sourceId =
                  (chart.timeSeriesCollection || []).find(
                    (ts) =>
                      ts.tsExternalId ===
                        node.functionData?.timeseriesExternalId ||
                      ts.tsExternalId ===
                        node.functionData?.timeSeriesExternalId
                  )?.id || '';

                return {
                  id: node.id,
                  type: NodeTypes.SOURCE,
                  position: { x: node.x, y: node.y },
                  data: {
                    selectedSourceId: sourceId,
                    type: 'timeseries',
                  } as SourceNodeDataDehydrated,
                } as Node<SourceNodeDataDehydrated>;
              }
              case 'OUTPUT': {
                return {
                  id: node.id,
                  type: NodeTypes.OUTPUT,
                  position: { x: node.x, y: node.y },
                };
              }
              default:
                return undefined;
            }
          })
          .filter((x) => x);

        const convertedEdges: Elements<Edge> = existingConnections.map(
          (connection) => {
            return {
              id: connection.id,
              source: connection.outputPin.nodeId,
              sourceHandle: connection.outputPin.pinId,
              target: connection.inputPin.nodeId,
              targetHandle: connection.inputPin.pinId,
            };
          }
        );

        return {
          ...workflow,
          version: 'v2',
          flow: {
            position: [0, 0],
            zoom: 1,
            elements: [...convertedEdges, ...convertedNodes],
          } as FlowExportObject<NodeDataDehydratedVariants>,
          settings: {
            autoAlign: true,
          },
        };
      }

      return workflow;
    }),
  };
};
