/* eslint-disable no-param-reassign */
import {
  DiagramInstanceId,
  DiagramLineInstance,
  getDiagramInstanceId,
  isPathIdInInstance,
  PidDocument,
  DiagramConnection,
  getInstanceByDiagramInstanceId,
  Point,
  getPointsCloserToEachOther,
  getPointTowardOtherPoint,
  connectionExists,
  getDiagramInstanceByPathId,
  DiagramInstanceWithPaths,
  DiagramSymbolInstance,
  DiagramEquipmentTagInstance,
  DiagramInstance,
  getClosestPointsOnSegments,
  getClosestPointOnSegments,
  T_JUNCTION,
} from '@cognite/pid-tools';

import { ToolType } from '../../types';
import { COLORS } from '../../constants';

export const isDiagramLine = (
  node: SVGElement,
  lines: DiagramLineInstance[]
) => {
  return lines.some((line) => line.pathIds.includes(node.id));
};

export const isSymbolInstance = (
  node: SVGElement,
  symbolInstances: DiagramInstanceWithPaths[]
) => {
  return symbolInstances.some((symbolInst) =>
    symbolInst.pathIds.includes(node.id)
  );
};

export const isInConnectionSelection = (
  node: SVGElement,
  connectionSelection: DiagramInstanceId | null
) => {
  return isPathIdInInstance(node.id, connectionSelection);
};

export const isInAddSymbolSelection = (
  node: SVGElement,
  selection: SVGElement[]
) => {
  return selection.some((svgPath) => svgPath.id === node.id);
};

export const isInLabelSelection = (
  node: SVGElement,
  labelSelection: DiagramInstanceId | null
) => {
  return isPathIdInInstance(node.id, labelSelection);
};

export const isLabelInInstance = (
  instance: DiagramInstanceWithPaths,
  id: DiagramInstanceId
): boolean => {
  return instance.labelIds.includes(id);
};

export const isLabelInInstances = (
  node: SVGElement,
  instances: DiagramInstanceWithPaths[]
) => {
  return instances.some((instance) => isLabelInInstance(instance, node.id));
};

export const isNodeInLineNumber = (
  node: SVGElement,
  lineNumber: string | null,
  diagramInstances: DiagramInstanceWithPaths[]
) => {
  if (lineNumber === null) return false;

  if (node instanceof SVGTSpanElement) {
    let isInLine = false;
    diagramInstances
      .filter((instance) => {
        return instance.labelIds.includes(node.id);
      })
      .forEach((instance) => {
        if (instance.lineNumbers.includes(lineNumber)) {
          isInLine = true;
        }
      });
    return isInLine;
  }
  const diagramInstnace = getDiagramInstanceByPathId(diagramInstances, node.id);

  if (diagramInstnace === null) return false;

  return diagramInstnace.lineNumbers.includes(lineNumber);
};

export const isInGraphSelection = (
  node: SVGElement,
  graphSelection: DiagramInstanceId | null
) => {
  return isPathIdInInstance(node.id, graphSelection);
};

const colorNode = (
  node: SVGElement,
  color: string | undefined,
  opacity: number | undefined = undefined
) => {
  if (color !== undefined) {
    node.style.stroke = color;
    if (node.style.fill !== 'none') {
      node.style.fill = color;
    }
  }
  if (opacity !== undefined) {
    if (node.style.fill !== 'none') {
      node.style.opacity = opacity.toString();
    } else {
      node.style.strokeOpacity = opacity.toString();
    }
  }
};

export const isInActiveEquipmentTag = (
  node: SVGElement,
  activeTagName: string | undefined,
  equipmentTags: DiagramEquipmentTagInstance[]
) => {
  if (activeTagName === undefined) return false;

  const activeTag = equipmentTags.find((tag) => tag.name === activeTagName);

  if (activeTag === undefined) return false;

  return activeTag.labelIds.includes(node.id);
};

export const isInEquipmentTags = (
  node: SVGElement,
  equipmentTags: DiagramEquipmentTagInstance[]
): boolean => {
  const allNodeIds = equipmentTags.flatMap((tag) => tag.labelIds);
  return allNodeIds.includes(node.id);
};

export interface ApplyStyleArgs {
  node: SVGElement;
  selection: SVGElement[];
  connectionSelection: DiagramInstanceId | null;
  labelSelection: DiagramInstanceId | null;
  symbolInstances: DiagramSymbolInstance[];
  lines: DiagramLineInstance[];
  connections: DiagramConnection[];
  graphPaths: DiagramInstanceId[][];
  graphSelection: DiagramInstanceId | null;
  active: ToolType;
  activeLineNumber: string | null;
  equipmentTags: DiagramEquipmentTagInstance[];
  activeTagName: string | undefined;
  splitSelection: string | null;
}

export const applyStyleToNode = ({
  node,
  selection,
  connectionSelection,
  labelSelection,
  symbolInstances,
  lines,
  connections,
  graphSelection,
  active,
  activeLineNumber,
  equipmentTags,
  activeTagName,
  splitSelection,
}: ApplyStyleArgs) => {
  let color: string | undefined;
  let opacity = 1;

  if (isDiagramLine(node, lines) || isLabelInInstances(node, lines)) {
    ({ color, opacity } = COLORS.diagramLine);
  }
  if (
    isSymbolInstance(node, symbolInstances) ||
    isLabelInInstances(node, symbolInstances)
  ) {
    ({ color, opacity } = COLORS.symbol);
  }
  if (isInConnectionSelection(node, connectionSelection)) {
    colorNode(node, COLORS.connectionSelection);
    color = COLORS.connectionSelection;
  }
  if (isInLabelSelection(node, labelSelection)) {
    color = COLORS.labelSelection;
  }
  if (node.id === splitSelection) {
    color = COLORS.splitLine;
  }
  if (isInAddSymbolSelection(node, selection)) {
    ({ color, opacity } = COLORS.symbolSelection);
  }
  if (isInGraphSelection(node, graphSelection)) {
    color = COLORS.connectionSelection;
  }
  if (isInActiveEquipmentTag(node, activeTagName, equipmentTags)) {
    color = COLORS.activeLabel;
  } else if (isInEquipmentTags(node, equipmentTags)) {
    color = COLORS.labelSelection;
  }

  if (node.id.includes(T_JUNCTION)) {
    node.style.strokeWidth = '2';
  }

  if (active === 'setLineNumber') {
    if (
      !isNodeInLineNumber(node, activeLineNumber, [
        ...symbolInstances,
        ...lines,
      ])
    ) {
      opacity = 0.23;
    } else {
      opacity = 1;
    }
  }
  colorNode(node, color, opacity);

  applyPointerCursorStyleToNode({
    node,
    active,
    connectionSelection,
    labelSelection,
    symbolInstances,
    lines,
    connections,
    splitSelection,
  });
};

interface CursorStyleOptions {
  node: SVGElement;
  active: ToolType;
  connectionSelection: DiagramInstanceId | null;
  labelSelection: DiagramInstanceId | null;
  symbolInstances: DiagramSymbolInstance[];
  lines: DiagramLineInstance[];
  connections: DiagramConnection[];
  splitSelection: string | null;
}

const applyPointerCursorStyleToNode = ({
  node,
  active,
  connectionSelection,
  labelSelection,
  symbolInstances,
  lines,
  connections,
}: CursorStyleOptions) => {
  if (active === 'addSymbol') {
    if (node instanceof SVGPathElement) {
      node.style.cursor = 'pointer';
    }
  } else if (active === 'addLine') {
    if (
      node instanceof SVGPathElement &&
      !isSymbolInstance(node, symbolInstances)
    ) {
      node.style.cursor = 'pointer';
    }
  } else if (active === 'splitLine') {
    if (node instanceof SVGPathElement) {
      if (
        !isSymbolInstance(node, symbolInstances) &&
        !isDiagramLine(node, lines)
      ) {
        node.style.cursor = 'pointer';
      }
    }
  } else if (active === 'connectInstances') {
    if (isSymbolInstance(node, symbolInstances) || isDiagramLine(node, lines)) {
      // Make sure the connection does not already exist
      if (connectionSelection !== null) {
        const symbolInstance = getDiagramInstanceByPathId(
          [...symbolInstances, ...lines],
          node.id
        )!;
        const instanceId = getDiagramInstanceId(symbolInstance);
        const newConnection = {
          start: connectionSelection,
          end: instanceId,
          direction: 'unknown',
        } as DiagramConnection;
        if (!connectionExists(connections, newConnection)) {
          node.style.cursor = 'pointer';
        }
      } else {
        node.style.cursor = 'pointer';
      }
    }
  } else if (active === 'connectLabels') {
    if (isSymbolInstance(node, symbolInstances) || isDiagramLine(node, lines)) {
      node.style.cursor = 'pointer';
    }
    if (labelSelection !== null && node instanceof SVGTSpanElement) {
      node.style.cursor = 'pointer';
    }
  } else if (active === 'setLineNumber') {
    if (isSymbolInstance(node, symbolInstances) || isDiagramLine(node, lines)) {
      node.style.cursor = 'pointer';
    }
  } else if (active === 'addEquipmentTag') {
    if (node instanceof SVGTSpanElement) {
      node.style.cursor = 'pointer';
    }
  }
};

export function addOrRemoveLabelToInstance<
  Type extends DiagramInstanceWithPaths
>(
  labelId: string,
  instance: Type,
  instances: Type[],
  setter: (arg: Type[]) => void
): void {
  if (instance.labelIds.includes(labelId)) {
    instance.labelIds = instance.labelIds.filter((li) => li !== labelId);
  } else {
    instance.labelIds = [...instance.labelIds, labelId];
  }
  setter([...instances]);
}

export function addOrRemoveLineNumberToInstance<Type extends DiagramInstance>(
  lineNumber: string,
  instance: Type,
  instances: Type[],
  setter: (arg: Type[]) => void
) {
  if (instance.lineNumbers.includes(lineNumber)) {
    instance.lineNumbers = instance.lineNumbers.filter(
      (ln) => ln !== lineNumber
    );
  } else {
    instance.lineNumbers = [...instance.lineNumbers, lineNumber];
  }
  setter([...instances]);
}

export function addOrRemoveLabelToEquipmentTag(
  label: SVGTSpanElement,
  tag: DiagramEquipmentTagInstance
): void {
  if (tag.labelIds.includes(label.id)) {
    tag.labelIds = tag.labelIds.filter((li) => li !== label.id);
    if (label.innerHTML === tag.name) {
      const { 0: firstDesc, ...rest } = tag.description;
      tag.name = firstDesc;
      tag.description = Object.values(rest);
    } else {
      tag.description = tag.description.filter((li) => li !== label.innerHTML);
    }
  } else {
    tag.labelIds = [...tag.labelIds, label.id];
    if (tag.name) {
      tag.description = [...tag.description, label.innerHTML];
    } else {
      tag.name = label.innerHTML;
    }
  }
}

export const colorSymbol = (
  diagramInstanceId: DiagramInstanceId,
  strokeColor: string,
  diagramInstances: DiagramInstanceWithPaths[],
  mainSvg: SVGSVGElement,
  additionalStyles?: { [key: string]: string }
) => {
  const symbolInstance = diagramInstances.filter(
    (instance) => getDiagramInstanceId(instance) === diagramInstanceId
  )[0] as DiagramInstanceWithPaths;

  if (symbolInstance) {
    symbolInstance.pathIds.forEach((pathId) => {
      Object.assign((mainSvg.getElementById(pathId) as SVGElement).style, {
        ...additionalStyles,
        stroke: strokeColor,
      });
    });
  }
};

export const setStrokeWidth = (
  diagramInstance: DiagramInstanceWithPaths,
  strokeWidth: string,
  svg: SVGSVGElement
) => {
  diagramInstance.pathIds.forEach((pathId) => {
    (svg.getElementById(pathId) as SVGElement).style.strokeWidth = strokeWidth;
  });
};

export const visualizeConnections = (
  svg: SVGSVGElement,
  pidDocument: PidDocument,
  connections: DiagramConnection[],
  symbolInstances: DiagramInstanceWithPaths[],
  lines: DiagramLineInstance[]
) => {
  const offset = 2;
  const instances = [...symbolInstances, ...lines];
  connections.forEach((connection) => {
    const startInstance = getInstanceByDiagramInstanceId(
      instances,
      connection.start
    );
    const endInstance = getInstanceByDiagramInstanceId(
      instances,
      connection.end
    );
    if (startInstance === undefined || endInstance === undefined) return;

    let startPoint: Point | undefined;
    let endPoint: Point | undefined;
    if (startInstance.type !== 'Line' && endInstance.type !== 'Line') {
      // Both is symbol
      startPoint = pidDocument.getMidPointToPaths(startInstance.pathIds);
      endPoint = pidDocument.getMidPointToPaths(endInstance.pathIds);

      [startPoint, endPoint] = getPointsCloserToEachOther(
        startPoint,
        endPoint,
        offset
      );
    } else if (startInstance.type === 'Line' && endInstance.type === 'Line') {
      // Both is line

      const startPathSegments = pidDocument.getPathSegmentsToPaths(
        startInstance.pathIds
      );
      const endPathSegments = pidDocument.getPathSegmentsToPaths(
        endInstance.pathIds
      );

      const closestPoints = getClosestPointsOnSegments(
        startPathSegments,
        endPathSegments
      );

      if (closestPoints === undefined) return;

      startPoint = closestPoints.point1;
      endPoint = closestPoints.point2;
    } else {
      // One symbol and one line
      const [symbol, line] =
        startInstance.type !== 'Line'
          ? [startInstance, endInstance]
          : [endInstance, startInstance];

      const symbolPoint = pidDocument.getMidPointToPaths(symbol.pathIds);
      const lineSegments = pidDocument.getPathSegmentsToPaths(line.pathIds);

      const closestPoint = getClosestPointOnSegments(symbolPoint, lineSegments);
      if (closestPoint === undefined) return;

      if (closestPoint.percentAlongPath < 0.05) {
        endPoint = getPointTowardOtherPoint(
          closestPoint.point,
          lineSegments[closestPoint.index].stop,
          offset
        );
      } else if (closestPoint.percentAlongPath > 0.95) {
        endPoint = getPointTowardOtherPoint(
          closestPoint.point,
          lineSegments[closestPoint.index].start,
          offset
        );
      } else {
        endPoint = closestPoint.point;
      }
      startPoint = getPointTowardOtherPoint(symbolPoint, endPoint, offset);
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    path.setAttribute(
      'd',
      `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`
    );

    path.setAttribute(
      'style',
      `stroke:${COLORS.connection.color};stroke-width:${COLORS.connection.strokeWidth};opacity:${COLORS.connection.opacity};stroke-linecap:round`
    );
    svg.insertBefore(path, svg.children[0]);
  });
};

export const visualizeLabels = (
  svg: SVGSVGElement,
  pidDocument: PidDocument,
  symbolInstances: DiagramInstanceWithPaths[]
) => {
  symbolInstances.forEach((symbolInstance) => {
    const symbolMidPoint = pidDocument.getMidPointToPaths(
      symbolInstance.pathIds
    );
    symbolInstance.labelIds.forEach((labelId) => {
      const pidTspan = pidDocument.getPidTspanById(labelId);
      if (pidTspan === null) return;

      const labelPoint = pidTspan.getMidPoint();

      const path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      );

      path.setAttribute(
        'd',
        `M ${symbolMidPoint.x} ${symbolMidPoint.y} L ${labelPoint.x} ${labelPoint.y}`
      );

      path.setAttribute(
        'style',
        `stroke:${COLORS.connection.color};stroke-width:${COLORS.connection.strokeWidth};opacity:${COLORS.connection.opacity};stroke-linecap:round`
      );
      svg.insertBefore(path, svg.children[0]);
    });
  });
};
