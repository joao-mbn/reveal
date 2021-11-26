export interface SvgPath {
  svgCommands: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SvgRepresentation {
  svgPaths: SvgPath[];
  boundingBox: BoundingBox;
}

export interface DiagramSymbol {
  symbolName: string;
  svgRepresentations: SvgRepresentation[];
}

export interface DiagramSymbolInstance {
  symbolName: string;
  pathIds: string[];
}

export interface DiagramLineInstance extends DiagramSymbolInstance {
  symbolName: 'Line';
}

export type DiagramInstanceId = string;
export interface DiagramConnection {
  start: DiagramInstanceId;
  end: DiagramInstanceId;
  direction: 'directed' | 'unknown';
}
