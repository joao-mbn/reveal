/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { v4 as uuid } from 'uuid';

import {
  getLineNumberFromText,
  ConnectionVisualization,
  LabelVisualization,
  loadSymbolsFromJson,
} from './utils';
import { T_JUNCTION } from './constants';
import { applyPathReplacementInSvg } from './utils/pathReplacementUtils';
import { PidDocumentWithDom } from './pid';
import {
  applyStyleToNode,
  isSymbolInstance,
  scaleStrokeWidthInstance,
  applyToLeafSVGElements,
  visualizeConnections,
  visualizeLabelsToInstances,
  scaleStrokeWidthPath,
  visualizeBoundingBoxBehind,
  visualizeSymbolInstanceBoundingBoxes,
  scaleStrokeWidth,
} from './utils/domUtils';
import {
  connectionHasInstanceId,
  getConnectionsWithoutInstances,
} from './utils/symbolUtils';
import {
  DiagramConnection,
  DiagramEquipmentTagInstance,
  DiagramInstanceId,
  DiagramInstanceWithPaths,
  DiagramLineInstance,
  DiagramSymbol,
  DiagramSymbolInstance,
  DocumentMetadata,
  GraphDocument,
  PathReplacement,
  SymbolType,
  ToolType,
} from './types';
import {
  addOrRemoveLabelToEquipmentTag,
  addOrRemoveLabelToInstance,
  addOrRemoveLineNumberToInstance,
  connectionExists,
  createEquipmentTagInstance,
  getDiagramEquipmentTagInstanceByLabelId,
  getDiagramEquipmentTagInstanceByTagId,
  getDiagramInstanceByPathId,
  getDiagramInstanceId,
  getDiagramInstanceIdFromPathIds,
  getInstanceByDiagramInstanceId,
  getNoneOverlappingSymbolInstances,
  isConnectionUnidirectionalMatch,
  pruneSymbolOverlappingPathsFromLines,
} from './utils/diagramInstanceUtils';
import { isLine } from './utils/type';

const hoverBoldStrokeScale = 1.5;

export type CognitePidOptions = {
  container: string;
};

const PRIMARY_MOUSE_BUTTON = 1;

type ActiveToolCallback = (tool: ToolType) => void;
type PathIdsCallback = (pathIds: string[]) => void;
type HideSelectionCallback = (hideSelection: boolean) => void;
type SymbolsCallback = (symbol: DiagramSymbol[]) => void;
type SymbolInstancesCallback = (
  symbolInstances: DiagramSymbolInstance[]
) => void;
type LinesCallback = (lines: DiagramLineInstance[]) => void;
type ConnectionsCallback = (lines: DiagramConnection[]) => void;
type EquipmentTagsCallback = (
  equipmentTags: DiagramEquipmentTagInstance[]
) => void;
type ActiveLineNumberCallback = (activeLineNumber: string | null) => void;
type ActiveTagIdCallback = (activeTagId: string | null) => void;
type LineNumbersCallback = (lineNumbers: string[]) => void;

export interface SaveSymbolData {
  symbolType: SymbolType;
  description: string;
  direction?: number;
}

export enum EventType {
  LOAD = 'onLoad',
}

type EventListener = (ref: CognitePid) => void;

export class CognitePid {
  host: SVGElement;
  document: string | undefined;
  pidDocument: PidDocumentWithDom | undefined;
  svg: SVGSVGElement | undefined;
  isDrawing = false;

  private eventListenersByEventType = new Map<EventType, EventListener[]>();

  private activeTool: ToolType = 'addSymbol';
  private activeToolSubscriber: ActiveToolCallback | undefined;

  private symbols: DiagramSymbol[] = [];
  private symbolsSubscriber: SymbolsCallback | undefined;

  private symbolInstances: DiagramSymbolInstance[] = [];
  private symbolInstancesSubscriber: SymbolInstancesCallback | undefined;

  private lines: DiagramLineInstance[] = [];
  private linesSubscriber: LinesCallback | undefined;

  private connections: DiagramConnection[] = [];
  private connectionsSubscriber: ConnectionsCallback | undefined;

  private equipmentTags: DiagramEquipmentTagInstance[] = [];
  private equipmentTagsSubscriber: EquipmentTagsCallback | undefined;

  private activeLineNumber: string | null = null;
  private activeLineNumberSubscriber: ActiveLineNumberCallback | undefined;

  private activeTagId: string | null = null;
  private activeTagIdSubscriber: ActiveTagIdCallback | undefined;

  private lineNumbers: string[] = [];
  private lineNumbersSubscriber: LineNumbersCallback | undefined;

  private symbolSelection: string[] = [];
  private symbolSelectionSubscriber: PathIdsCallback | undefined;

  private hideSelection = false;
  private hideSelectionSubscriber: HideSelectionCallback | undefined;

  private connectionSelection: DiagramInstanceId | null = null;
  private labelSelection: DiagramInstanceId | null = null;
  private splitSelection: string | null = null;

  pathReplacements: PathReplacement[] = [];

  private nodeMap = new Map<
    string,
    { node: SVGElement; originalStyle: string }
  >();
  private connectionVisualizations: ConnectionVisualization[] = [];
  private manuallyRemovedConnections: DiagramConnection[] = [];
  private manuallyRemovedLabelConnections: [
    DiagramInstanceWithPaths,
    string
  ][] = [];

  private labelVisualizations: LabelVisualization[] = [];
  private lineNumberVisualizationIds: string[] = [];
  private symbolInstanceBoundingBoxesIds: string[] = [];

  constructor(options: CognitePidOptions) {
    const host = document.querySelector(options.container) as SVGElement;
    if (!host) {
      console.error('PID: Failed to get HTML element to attach to');
    }
    this.host = host;
  }

  addEventListener = (eventType: EventType, listenerFn: EventListener) => {
    const eventListeners = this.eventListenersByEventType.get(eventType) ?? [];
    this.eventListenersByEventType.set(eventType, [
      ...eventListeners,
      listenerFn,
    ]);
  };

  removeEventListener = (eventType: EventType, listenerFn: EventListener) => {
    const eventListeners = this.eventListenersByEventType.get(eventType);
    if (eventListeners === undefined) {
      return;
    }

    this.eventListenersByEventType.set(
      eventType,
      eventListeners.filter(
        (existingListenerFn) => existingListenerFn !== listenerFn
      )
    );
  };

  emit = (eventType: EventType) => {
    const eventListeners = this.eventListenersByEventType.get(eventType);
    if (eventListeners === undefined) {
      return;
    }

    eventListeners.forEach((listener) => listener(this));
  };

  addSvgDocument(svgDocument: File) {
    svgDocument
      .text()
      .then((text) => {
        this.document = text;
        this.render();
      })
      .catch((err) => {
        throw new Error(
          `Unable to read file ${svgDocument.name} with error: ${err}`
        );
      });
  }

  setActiveTool(tool: ToolType) {
    this.activeTool = tool;
    if (this.activeToolSubscriber) {
      this.activeToolSubscriber(tool);
    } else {
      console.warn(
        'PID: Called this.setActiveTool() without this.activeToolSubscriber'
      );
    }

    if (this.isDrawing) {
      this.setSymbolSelection([]);
      this.setConnectionSelection(null, false);
      this.setLabelSelection(null, false);
      this.setSplitSelection(null, false);
      this.refresh();
    }
  }

  onChangeActiveTool(callback: ActiveToolCallback) {
    this.activeToolSubscriber = callback;
  }

  setSymbols(symbols: DiagramSymbol[]) {
    this.symbols = symbols;
    if (this.symbolsSubscriber) {
      this.symbolsSubscriber(symbols);
    } else {
      console.warn(
        'PID: Called this.setSymbols() without this.symbolsSubscriber'
      );
    }
    this.refresh();
  }

  onChangeSymbols(callback: SymbolsCallback) {
    this.symbolsSubscriber = callback;
  }

  deleteSymbol(diagramSymbol: DiagramSymbol) {
    const instancesToRemove = this.symbolInstances
      .filter((instance) => instance.symbolId === diagramSymbol.id)
      .map((instance) => getDiagramInstanceId(instance));

    const connectionsToKeep = this.connections.filter((connection) => {
      return !(
        instancesToRemove.includes(connection.end) ||
        instancesToRemove.includes(connection.start)
      );
    });
    this.setConnections(connectionsToKeep);

    const symbolInstancesToKeep = this.symbolInstances.filter(
      (instance) => instance.symbolId !== diagramSymbol.id
    );
    this.setSymbolInstances(symbolInstancesToKeep);

    const symbolsToKeep = this.symbols.filter(
      (symbol) => symbol.id !== diagramSymbol.id
    );
    this.setSymbols(symbolsToKeep);
  }

  setSymbolInstances(symbolInstances: DiagramSymbolInstance[], refresh = true) {
    this.symbolInstances = symbolInstances;
    if (this.symbolInstancesSubscriber) {
      this.symbolInstancesSubscriber(symbolInstances);
    } else {
      console.warn(
        'PID: Called this.setSymbolInstances() without this.symbolInstancesSubscriber'
      );
    }

    if (refresh) {
      this.refresh();
    }
  }

  onChangeSymbolInstances(callback: SymbolInstancesCallback) {
    this.symbolInstancesSubscriber = callback;
  }

  setLines(lines: DiagramLineInstance[], refresh = true) {
    this.lines = lines;
    if (this.linesSubscriber) {
      this.linesSubscriber(lines);
    } else {
      console.warn('PID: Called this.setLines() without this.linesSubscriber');
    }

    if (refresh) {
      this.refresh();
    }
  }

  onChangeLines(callback: LinesCallback) {
    this.linesSubscriber = callback;
  }

  deleteLine = (line: DiagramLineInstance) => {
    const lineId = getDiagramInstanceId(line);

    this.setConnections(
      this.connections.filter(
        (connection) => !connectionHasInstanceId(lineId, connection)
      )
    );

    this.setLines(
      this.lines.filter((line) => getDiagramInstanceId(line) !== lineId)
    );
  };

  private setConnections(connections: DiagramConnection[]) {
    this.connections = connections;
    if (this.connectionsSubscriber) {
      this.connectionsSubscriber(connections);
    } else {
      console.warn(
        'PID: Called this.setConnections() without this.connectionsSubscriber'
      );
    }

    this.refresh();
  }

  onChangeConnections(callback: ConnectionsCallback) {
    this.connectionsSubscriber = callback;
  }

  deleteConnection(connection: DiagramConnection) {
    this.setConnections(
      this.connections.filter(
        (conn) => !isConnectionUnidirectionalMatch(connection, conn)
      )
    );
  }

  private setSymbolSelection(pathIds: string[]) {
    const possiblyChangedPathIds = [...this.symbolSelection, ...pathIds]; // FIX: Find elements that's only is in one of the two lists
    this.symbolSelection = pathIds;
    if (this.symbolSelectionSubscriber) {
      this.symbolSelectionSubscriber(pathIds);
    } else {
      console.warn(
        'PID: Called this.setSymbolSelection() without this.symbolSelectionSubscriber'
      );
    }
    possiblyChangedPathIds.forEach((id) => this.applyStyleToNodeId(id));
  }

  onChangeSymbolSelection(callback: PathIdsCallback) {
    this.symbolSelectionSubscriber = callback;
  }

  clearSymbolSelection() {
    this.setSymbolSelection([]);
    this.refresh();
  }

  setHideSelection(hideSelection: boolean, refresh = true) {
    this.hideSelection = hideSelection;
    if (this.hideSelectionSubscriber) {
      this.hideSelectionSubscriber(hideSelection);
    } else {
      console.warn(
        'PID: Called this.setHideSelection() without this.hideSelectionSubscriber'
      );
    }
    if (refresh) {
      this.refresh();
    }
  }

  onChangeHideSelection(callback: HideSelectionCallback) {
    this.hideSelectionSubscriber = callback;
  }

  setEquipmentTags(equipmentTags: DiagramEquipmentTagInstance[]) {
    this.equipmentTags = equipmentTags;
    if (this.equipmentTagsSubscriber) {
      this.equipmentTagsSubscriber(equipmentTags);
    } else {
      console.warn(
        'PID: Called this.setEquipmentTags() without this.equipmentTagsSubscriber'
      );
    }
    this.refresh();
  }

  onChangeEquipmentTags(callback: EquipmentTagsCallback) {
    this.equipmentTagsSubscriber = callback;
  }

  setActiveLineNumber(lineNumber: string | null, refresh = true) {
    this.activeLineNumber = lineNumber;
    if (this.activeLineNumberSubscriber) {
      this.activeLineNumberSubscriber(lineNumber);
    } else {
      console.warn(
        'PID: Called this.setActiveLineNumber() without this.activeLineNumberSubscriber'
      );
    }
    if (refresh) {
      this.refresh();
    }
  }

  onChangeActiveLineNumber(callback: ActiveLineNumberCallback) {
    this.activeLineNumberSubscriber = callback;
  }

  setActiveTagId(activeTagId: string | null) {
    this.activeTagId = activeTagId;
    if (this.activeTagIdSubscriber) {
      this.activeTagIdSubscriber(activeTagId);
    } else {
      console.warn(
        'PID: Called this.setActiveTagId() without this.activeTagIdSubscriber'
      );
    }
  }

  onChangeActiveTagId(callback: ActiveTagIdCallback) {
    this.activeTagIdSubscriber = callback;
  }

  setLineNumbers(lineNumbers: string[]) {
    this.lineNumbers = lineNumbers;
    if (this.activeLineNumber === null) {
      this.setActiveLineNumber(lineNumbers[0]);
    }
    if (this.lineNumbersSubscriber) {
      this.lineNumbersSubscriber(lineNumbers);
    } else {
      console.warn(
        'PID: Called this.setLineNumbers() without this.lineNumbersSubscriber'
      );
    }
  }

  onChangeLineNumbers(callback: LineNumbersCallback) {
    this.lineNumbersSubscriber = callback;
  }

  private setConnectionSelection(
    connectionSelection: DiagramInstanceId | null,
    refresh = true
  ) {
    this.connectionSelection = connectionSelection;
    if (refresh) {
      this.refresh();
    }
  }

  private setLabelSelection(
    labelSelection: DiagramInstanceId | null,
    refresh = true
  ) {
    this.labelSelection = labelSelection;
    if (refresh) {
      this.refresh();
    }
  }

  private setSplitSelection(
    splitSelection: DiagramInstanceId | null,
    refresh = true
  ) {
    this.splitSelection = splitSelection;
    if (refresh) {
      this.refresh();
    }
  }

  addGraphDocument(graphDocument: GraphDocument) {
    if (!this.pidDocument) return;

    const setSymbols = (symbols: DiagramSymbol[]) => {
      this.setSymbols(symbols);
    };
    const setSymbolInstances = (symbolInstances: DiagramSymbolInstance[]) =>
      this.setSymbolInstances(symbolInstances);
    const setLines = (lines: DiagramLineInstance[]) => this.setLines(lines);
    const setConnections = (connections: DiagramConnection[]) => {
      this.setConnections(connections);
    };
    const setPathReplacement = (pathReplacements: PathReplacement[]) => {
      this.addPathReplacements(pathReplacements);
    };
    const setLineNumbers = (lineNumbers: string[]) => {
      this.setLineNumbers(lineNumbers);
    };
    const setEquipmentTags = (equipmentTags: DiagramEquipmentTagInstance[]) => {
      this.setEquipmentTags(equipmentTags);
    };
    loadSymbolsFromJson(
      graphDocument,
      setSymbols,
      this.pidDocument,
      setSymbolInstances,
      this.symbolInstances,
      setLines,
      this.lines,
      setConnections,
      this.connections,
      this.pathReplacements,
      setPathReplacement,
      this.lineNumbers,
      setLineNumbers,
      this.equipmentTags,
      setEquipmentTags
    );
  }

  render() {
    if (!this.document) return;

    if (this.isDrawing) return;
    this.isDrawing = true;

    const parser = new DOMParser();
    this.svg = parser.parseFromString(this.document, 'image/svg+xml')
      .documentElement as unknown as SVGSVGElement;
    const { svg } = this;

    svg.style.width = '100%';
    svg.style.height = '100%';

    const allSvgElements: SVGElement[] = [];

    applyToLeafSVGElements(svg, (node) => {
      allSvgElements.push(node);

      this.nodeMap.set(node.id, {
        node,
        originalStyle: node.getAttribute('style') || '',
      });

      node.addEventListener('mouseenter', (mouseEvent) => {
        this.onMouseEnter(mouseEvent, node);
      });

      node.addEventListener('mouseleave', () => {
        this.onMouseLeave(node);
      });

      node.addEventListener('mousedown', (event) =>
        this.onMouseClick(event, node)
      );
    });

    this.host.appendChild(svg);

    this.pidDocument = PidDocumentWithDom.fromSVG(svg, allSvgElements);
    this.emit(EventType.LOAD);

    this.refresh();
  }

  getDocumentWidth = () => this.pidDocument?.viewBox.width ?? 0;

  getDocumentHeight = () => this.pidDocument?.viewBox.height ?? 0;

  private applyStyleToNodeId(nodeId: string) {
    const nodeData = this.nodeMap.get(nodeId);
    if (!nodeData) {
      throw new Error(
        `Trying to apply style to node with id ${nodeId} that does not exsist`
      );
    }
    const { node, originalStyle } = nodeData;
    node.setAttribute('style', originalStyle);
    applyStyleToNode({
      node,
      symbolSelection: this.symbolSelection,
      connectionSelection: this.connectionSelection,
      labelSelection: this.labelSelection,
      symbolInstances: this.symbolInstances,
      lines: this.lines,
      connections: this.connections,
      active: this.activeTool,
      activeLineNumber: this.activeLineNumber,
      equipmentTags: this.equipmentTags,
      activeTagId: this.activeTagId,
      splitSelection: this.splitSelection,
      hideSelection: this.hideSelection,
    });
  }

  refresh() {
    if (!this.svg) {
      throw Error('Calling refresh without SVG');
    }
    if (!this.pidDocument) {
      throw Error('Calling refresh pidDocument');
    }

    this.nodeMap.forEach(({ node }) => {
      this.applyStyleToNodeId(node.id);
    });

    // Clean up all the visualizations
    this.removeConnectionVisualizations();
    this.removeSymbolInstanceBoundingBoxes();
    this.removeLabelVisualizations();
    this.removeLineVisualizations();

    // Add appropriate visualization based on the active tool
    if (this.activeTool === 'connectInstances') {
      this.drawConnectionVisualizations();
    }
    if (this.activeTool === 'addSymbol') {
      this.drawSymbolInstanceBoundingBoxes();
    }
    if (this.activeTool === 'connectLabels') {
      this.drawLabelVisualizations();
    } else {
      this.drawLineVisualizations();
    }
  }

  private onMouseEnter = (mouseEvent: MouseEvent, node: SVGElement) => {
    if (this.activeTool === 'addSymbol' && !(node instanceof SVGTSpanElement)) {
      if (mouseEvent.altKey) {
        this.setSymbolSelection(
          this.symbolSelection.filter((select) => select !== node.id)
        );
      }
      if (
        mouseEvent.shiftKey &&
        !this.symbolSelection.some((select) => select === node.id)
      ) {
        this.setSymbolSelection([...this.symbolSelection, node.id]);
      }
    }

    if (
      this.activeTool === 'connectInstances' ||
      this.activeTool === 'connectLabels' ||
      this.activeTool === 'setLineNumber'
    ) {
      const symbolInstance = getDiagramInstanceByPathId(
        [...this.symbolInstances, ...this.lines],
        node.id
      );

      if (symbolInstance === null) return;
      scaleStrokeWidthInstance(
        hoverBoldStrokeScale,
        symbolInstance,
        this.nodeMap
      );
    } else if (this.activeTool === 'addEquipmentTag') {
      if (node instanceof SVGTSpanElement) {
        node.style.fontWeight = '600';
      }
    } else {
      scaleStrokeWidthPath(hoverBoldStrokeScale, node);
    }
  };

  private onMouseLeave = (node: SVGElement) => {
    if (
      this.activeTool === 'connectInstances' ||
      this.activeTool === 'connectLabels' ||
      this.activeTool === 'setLineNumber'
    ) {
      const symbolInstance = getDiagramInstanceByPathId(
        [...this.symbolInstances, ...this.lines],
        node.id
      );

      if (symbolInstance === null) return;
      symbolInstance.pathIds.forEach((pathId) => {
        this.applyStyleToNodeId(pathId);
      });
    } else {
      this.applyStyleToNodeId(node.id);
    }
  };

  private onMouseClick = (event: MouseEvent, node: SVGElement) => {
    if (event.buttons !== PRIMARY_MOUSE_BUTTON) {
      return;
    }

    if (this.activeTool !== 'connectLabels') {
      if (node instanceof SVGTSpanElement) {
        const lineNumber = getLineNumberFromText(node.innerHTML);
        if (lineNumber) {
          if (!this.lineNumbers.includes(lineNumber)) {
            this.setLineNumbers([...this.lineNumbers, lineNumber]);
          }
          this.setActiveLineNumber(lineNumber, false);
          this.setActiveTool('setLineNumber');
          return;
        }
      }
    }

    if (this.activeTool === 'addSymbol') {
      if (!(node instanceof SVGTSpanElement)) {
        if (!this.symbolSelection.includes(node.id)) {
          this.setSymbolSelection([...this.symbolSelection, node.id]);
        } else {
          this.setSymbolSelection(
            this.symbolSelection.filter((id) => id !== node.id)
          );
        }
      }
    } else if (this.activeTool === 'addLine') {
      if (!(node instanceof SVGTSpanElement)) {
        const line = getDiagramInstanceByPathId(this.lines, node.id);
        if (line) {
          this.deleteLine(line);
        } else {
          this.setLines([
            ...this.lines,
            {
              id: getDiagramInstanceIdFromPathIds([node.id]),
              type: 'Line',
              pathIds: [node.id],
              labelIds: [],
              lineNumbers: [],
              inferedLineNumbers: [],
            } as DiagramLineInstance,
          ]);
        }
      }
    } else if (this.activeTool === 'splitLine') {
      if (node instanceof SVGTSpanElement) return;
      if (isSymbolInstance(node, this.symbolInstances)) return;
      if (this.pidDocument === undefined) return;

      // Remove line if it was already selected
      if (this.splitSelection === node.id) {
        this.setSplitSelection(null);
        return;
      }
      if (this.splitSelection !== null) {
        const tJunctionPathReplacements = this.pidDocument
          .getPidPathById(this.splitSelection)
          ?.getTJunctionByIntersectionWith(
            this.pidDocument.getPidPathById(node.id)!
          );

        if (!tJunctionPathReplacements) {
          return;
        }

        this.addPathReplacements(tJunctionPathReplacements);
        this.setSplitSelection(null);
        return;
      }
      this.setSplitSelection(node.id);
    } else if (this.activeTool === 'connectInstances') {
      const symbolInstance = getDiagramInstanceByPathId(
        [...this.symbolInstances, ...this.lines],
        node.id
      );
      if (symbolInstance) {
        const instanceId = getDiagramInstanceId(symbolInstance);

        if (this.connectionSelection === null) {
          this.setConnectionSelection(instanceId);
        } else if (instanceId === this.connectionSelection) {
          this.setConnectionSelection(null);
        } else {
          const newConnection = {
            start: this.connectionSelection,
            end: instanceId,
            direction: 'unknown',
          } as DiagramConnection;
          if (connectionExists(this.connections, newConnection)) {
            return;
          }
          this.setConnections([...this.connections, newConnection]);
          this.setConnectionSelection(instanceId);
        }
      }
    } else if (this.activeTool === 'connectLabels') {
      // selection or deselect symbol/line instance that will be used for adding labels
      if (!(node instanceof SVGTSpanElement)) {
        const diagramInstance = getDiagramInstanceByPathId(
          [...this.symbolInstances, ...this.lines],
          node.id
        );
        const diagramInstanceId = diagramInstance
          ? getDiagramInstanceId(diagramInstance)
          : node.id;

        if (diagramInstanceId === this.labelSelection) {
          this.setLabelSelection(null);
          return;
        }
        if (diagramInstance) {
          this.setLabelSelection(diagramInstanceId);
        }
      } else {
        // add or remove labels to symbol/line instance given `labelSelection`
        if (!this.labelSelection) {
          return;
        }
        const diagramInstance = getInstanceByDiagramInstanceId(
          [...this.symbolInstances, ...this.lines],
          this.labelSelection
        );
        if (!diagramInstance) {
          return;
        }
        if (isLine(diagramInstance)) {
          addOrRemoveLabelToInstance(node.id, node.innerHTML, diagramInstance);
          this.setLines([...this.lines]);
        } else {
          addOrRemoveLabelToInstance(node.id, node.innerHTML, diagramInstance);
          this.setSymbolInstances([...this.symbolInstances]);
        }
      }
    } else if (this.activeTool === 'setLineNumber') {
      if (this.activeLineNumber === null) return;

      const diagramInstance = getDiagramInstanceByPathId(
        [...this.symbolInstances, ...this.lines],
        node.id
      );
      if (diagramInstance === null) return;

      if (isLine(diagramInstance)) {
        addOrRemoveLineNumberToInstance(this.activeLineNumber, diagramInstance);
        this.setLines([...this.lines], false);
      } else {
        addOrRemoveLineNumberToInstance(this.activeLineNumber, diagramInstance);
        this.setSymbolInstances([...this.symbolInstances], false);
      }

      this.inferLineNumbers();
    } else if (this.activeTool === 'addEquipmentTag') {
      if (!(node instanceof SVGTSpanElement)) return;

      if (this.activeTagId) {
        const tag = getDiagramEquipmentTagInstanceByTagId(
          this.activeTagId,
          this.equipmentTags
        );
        if (tag === undefined) return;
        addOrRemoveLabelToEquipmentTag(node, tag);
        if (tag.labelIds.length < 1) {
          this.setActiveTagId(tag.id);
          this.setEquipmentTags(
            this.equipmentTags.filter((tag) => tag.labelIds.length > 0)
          );
        } else {
          this.setActiveTagId(tag.id);
          this.setEquipmentTags([...this.equipmentTags]);
        }
      } else {
        const tag = getDiagramEquipmentTagInstanceByLabelId(
          node.id,
          this.equipmentTags
        );
        if (tag === undefined) {
          const newTag = createEquipmentTagInstance(node);
          this.setEquipmentTags([...this.equipmentTags, newTag]);
          this.setActiveTagId(newTag.id);
        } else {
          this.setActiveTagId(tag.id);
        }
      }
    }
  };

  saveSymbol(symbolData: SaveSymbolData) {
    if (this.pidDocument === undefined) return;

    // Create new diagram symbol
    const pidGroup = this.pidDocument!.getPidGroup(this.symbolSelection);
    const { symbolType, description, direction } = symbolData;
    const newSymbol = {
      id: uuid(),
      symbolType,
      description,
      svgRepresentation: pidGroup.createSvgRepresentation(false, 3),
      direction,
    } as DiagramSymbol;

    // Find all symbol instances of new symbol
    const newSymbolInstances =
      this.pidDocument.findAllInstancesOfSymbol(newSymbol);
    const prunedInstances = getNoneOverlappingSymbolInstances(
      this.pidDocument,
      this.symbolInstances,
      newSymbolInstances
    );

    const { prunedLines, linesToDelete } = pruneSymbolOverlappingPathsFromLines(
      this.lines,
      newSymbolInstances
    );
    const prunedConnections = getConnectionsWithoutInstances(
      linesToDelete,
      this.connections
    );

    this.clearSymbolSelection();
    this.setSymbols([...this.symbols, newSymbol]);
    this.setConnections(prunedConnections);
    this.setLines(prunedLines);
    this.setSymbolInstances(prunedInstances);
  }

  autoAnalysis(documentMetadata: DocumentMetadata) {
    if (this.pidDocument === undefined) return;

    // find lines and connections
    const { newLines, newConnections } =
      this.pidDocument.findLinesAndConnection(
        documentMetadata.type,
        this.symbolInstances,
        this.lines,
        this.connections
      );
    this.setLines([...this.lines, ...newLines]);
    this.setConnections(
      newConnections.filter(
        (connection) =>
          !this.manuallyRemovedConnections.some((c) =>
            isConnectionUnidirectionalMatch(c, connection)
          )
      )
    );

    // connect labels to symbol instances
    const pidLabelInstanceConnection =
      this.pidDocument.connectLabelsToInstances(
        documentMetadata.type,
        [...this.symbolInstances, ...this.lines],
        this.manuallyRemovedLabelConnections
      );
    if (pidLabelInstanceConnection.length > 0) {
      this.setSymbolInstances(
        this.symbolInstances.map((symbolInstance) => {
          pidLabelInstanceConnection.forEach((labelInstanceConnection) => {
            if (symbolInstance.id === labelInstanceConnection.instanceId) {
              addOrRemoveLabelToInstance(
                labelInstanceConnection.labelId,
                labelInstanceConnection.labelText,
                symbolInstance
              );
            }
          });
          return symbolInstance;
        })
      );

      this.setLines(
        this.lines.map((line) => {
          pidLabelInstanceConnection.forEach((labelInstanceConnection) => {
            if (line.id === labelInstanceConnection.instanceId) {
              addOrRemoveLabelToInstance(
                labelInstanceConnection.labelId,
                labelInstanceConnection.labelText,
                line
              );
            }
          });
          return line;
        })
      );
    }

    this.inferLineNumbers();
  }

  inferLineNumbers() {
    const { newSymbolInstances, newLines } =
      PidDocumentWithDom.inferLineNumbers(
        this.symbolInstances,
        this.lines,
        this.connections
      );

    this.setSymbolInstances([...newSymbolInstances], false);
    this.setLines([...newLines], true);
  }

  splitPathsWithManySegments = () => {
    if (this.pidDocument === undefined) return;

    const newPathReplacements: PathReplacement[] = [];
    const diagramInstances = [...this.lines, ...this.symbolInstances];
    this.pidDocument.pidPaths.forEach((pidPath) => {
      if (
        getDiagramInstanceByPathId(diagramInstances, pidPath.pathId) === null &&
        !pidPath.pathId.includes(T_JUNCTION)
      ) {
        const possiblePathReplacement =
          pidPath?.getPathReplacementIfManySegments();

        if (possiblePathReplacement) {
          newPathReplacements.push(possiblePathReplacement);
        }
      }
    });

    this.addPathReplacements(newPathReplacements);
  };

  addPathReplacements(pathReplacements: PathReplacement[]) {
    if (!this.svg) return;
    if (!this.pidDocument) return;

    for (let i = 0; i < pathReplacements.length; i++) {
      const pathReplacement = pathReplacements[i];
      const pathToReplace = this.nodeMap.get(pathReplacement.pathId);
      // eslint-disable-next-line no-continue
      if (pathToReplace === undefined) continue;

      this.pathReplacements.push(pathReplacement);
      this.pidDocument.applyPathReplacement(pathReplacement);
      const newPaths = applyPathReplacementInSvg(
        this.svg,
        pathReplacement,
        pathToReplace.originalStyle
      );
      newPaths.forEach((newPath) => {
        newPath.addEventListener('mouseenter', (mouseEvent) => {
          this.onMouseEnter(mouseEvent, newPath);
        });

        newPath.addEventListener('mouseleave', () => {
          this.onMouseLeave(newPath);
        });

        newPath.addEventListener('mousedown', (event) =>
          this.onMouseClick(event, newPath)
        );

        this.nodeMap.set(newPath.id, {
          node: newPath,
          originalStyle: newPath.getAttribute('style')!,
        });
      });

      this.nodeMap.delete(pathReplacement.pathId);
    }

    const pathReplacementIds = pathReplacements.map((pr) => pr.pathId);
    const linesToDelete = this.lines.filter((line) =>
      pathReplacementIds.includes(line.pathIds[0])
    );
    const linesToKeep = this.lines.filter(
      (line) => !pathReplacementIds.includes(line.pathIds[0])
    );
    this.setLines(linesToKeep);

    this.setConnections(
      getConnectionsWithoutInstances(linesToDelete, this.connections)
    );

    this.refresh();
  }

  private drawConnectionVisualizations() {
    if (!this.svg) {
      throw Error('Calling drawConnectionVisualizations without SVG');
    }
    if (!this.pidDocument) {
      throw Error('Calling drawConnectionVisualizations without pidDocument');
    }

    this.connectionVisualizations = visualizeConnections(
      this.svg,
      this.pidDocument,
      this.connections,
      this.symbolInstances,
      this.lines
    );

    this.connectionVisualizations.forEach(({ diagramConnection, node }) => {
      const originalStrokeWidth = node.style.strokeWidth;
      node.addEventListener('mouseenter', () => {
        node.style.strokeWidth = scaleStrokeWidth(
          hoverBoldStrokeScale,
          originalStrokeWidth
        );
      });

      node.addEventListener('mouseleave', () => {
        node.style.strokeWidth = originalStrokeWidth;
      });

      node.addEventListener('mousedown', (event: MouseEvent) => {
        if (!event.altKey) {
          return;
        }
        this.deleteConnection(diagramConnection);
        this.manuallyRemovedConnections.push(diagramConnection);
        node?.remove();
      });
    });
  }

  private removeConnectionVisualizations() {
    if (this.svg === undefined) {
      return;
    }

    this.connectionVisualizations.forEach(({ node }) => {
      node.remove();
    });

    this.connectionVisualizations = [];
  }

  private drawLabelVisualizations() {
    if (!this.svg) {
      throw Error('Calling drawLabelVisualizations without SVG');
    }
    if (!this.pidDocument) {
      throw Error('Calling drawLabelVisualizations without pidDocument');
    }

    this.labelVisualizations = visualizeLabelsToInstances(
      this.svg,
      this.pidDocument,
      [...this.symbolInstances, ...this.lines]
    );

    this.labelVisualizations.forEach((labelVisualization) => {
      labelVisualization.labels.forEach(
        ({ labelId, textNode, boundingBoxNode }) => {
          const originalStrokeWidth = textNode.style.strokeWidth;
          textNode.addEventListener('mouseenter', () => {
            textNode.style.strokeWidth = scaleStrokeWidth(
              hoverBoldStrokeScale,
              originalStrokeWidth
            );
          });

          textNode.addEventListener('mouseleave', () => {
            textNode.style.strokeWidth = originalStrokeWidth;
          });

          textNode.addEventListener('mousedown', (event: MouseEvent) => {
            if (!event.altKey) {
              return;
            }

            if (isLine(labelVisualization.diagramInstance)) {
              addOrRemoveLabelToInstance(
                labelId,
                textNode.innerHTML,
                labelVisualization.diagramInstance
              );
              this.setLines([...this.lines]);
            } else {
              addOrRemoveLabelToInstance(
                labelId,
                textNode.innerHTML,
                labelVisualization.diagramInstance
              );
              this.setSymbolInstances([...this.symbolInstances]);
            }

            this.manuallyRemovedLabelConnections.push([
              labelVisualization.diagramInstance,
              labelId,
            ]);
            textNode?.remove();
            boundingBoxNode?.remove();
          });
        }
      );
    });
  }

  private removeLabelVisualizations() {
    if (this.svg === undefined) {
      return;
    }

    this.labelVisualizations.forEach(({ labels }) => {
      labels.forEach(({ textNode, boundingBoxNode }) =>
        [textNode, boundingBoxNode].forEach((node) => node?.remove())
      );
    });

    this.labelVisualizations = [];
  }

  private drawLineVisualizations() {
    if (!this.svg) {
      throw Error('Calling drawLineVisualizations without SVG');
    }
    if (!this.pidDocument) {
      throw Error('Calling drawLineVisualizations without pidDocument');
    }

    this.lineNumberVisualizationIds = this.pidDocument.pidLabels
      .filter((pidLabel) => {
        return getLineNumberFromText(pidLabel.text);
      })
      .map(
        (pidTspan) =>
          visualizeBoundingBoxBehind({
            svg: this.svg!,
            boundignBox: pidTspan.boundingBox,
            id: `linenumberrect_${pidTspan.id}`,
            color: 'black',
            opacity:
              this.activeLineNumber &&
              pidTspan.text.includes(this.activeLineNumber.toString())
                ? 0.3
                : 0.2,
            strokeColor: 'blue',
          }).id
      );
  }

  private removeLineVisualizations() {
    if (this.svg === undefined) return;
    for (let i = 0; i < this.lineNumberVisualizationIds.length; i++) {
      const id = this.lineNumberVisualizationIds[i];
      const pathToRemove = this.svg.getElementById(id);
      if (!pathToRemove) {
        throw Error(
          `Trying to remove line visualization with id ${id} that does not exist`
        );
      } else {
        pathToRemove.parentElement?.removeChild(pathToRemove);
      }
    }
    this.lineNumberVisualizationIds = [];
  }

  private drawSymbolInstanceBoundingBoxes() {
    if (!this.svg) {
      throw Error('Calling drawSymbolInstanceBoundingBoxes without SVG');
    }
    if (!this.pidDocument) {
      throw Error(
        'Calling drawSymbolInstanceBoundingBoxes without pidDocument'
      );
    }

    this.symbolInstanceBoundingBoxesIds = visualizeSymbolInstanceBoundingBoxes(
      this.svg,
      this.pidDocument,
      this.symbolInstances
    );
  }

  private removeSymbolInstanceBoundingBoxes() {
    if (this.svg === undefined) return;
    for (let i = 0; i < this.symbolInstanceBoundingBoxesIds.length; i++) {
      const id = this.symbolInstanceBoundingBoxesIds[i];
      const pathToRemove = this.svg.getElementById(id);
      if (!pathToRemove) {
        throw Error(
          `Trying to remove symbol instance bounding box with id ${id} that does not exist`
        );
      } else {
        pathToRemove.parentElement?.removeChild(pathToRemove);
      }
    }
    this.symbolInstanceBoundingBoxesIds = [];
  }
}
