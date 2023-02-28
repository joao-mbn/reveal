import { Datum } from 'plotly.js';

export type LineChartProps = {
  data: Data | Data[];
  xAxis?: Axis;
  yAxis?: Axis;
  title?: string;
  subtitle?: string;
  variant?: Variant;
  layout?: Layout;
  disableTooltip?: boolean;
  renderTooltipContent?: (props: TooltipRendererProps) => JSX.Element;
};

export interface Data {
  x: ValueType[];
  y: ValueType[];
  name?: string;
  color?: string;
}

export interface Layout {
  backgroundColor?: string;
  responsive?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;
  showLegend?: boolean;
  legendPlacement?: HorizontalPlacement;
  showAxisNames?: boolean;
  showTicks?: boolean;
  showTickLabels?: boolean;
}

export interface Axis {
  name?: string;
  tickCount?: number;
  tickDistance?: number;
}

export interface TooltipRendererProps {
  x: ValueType;
  y: ValueType;
  name: string;
  color: string;
}

export type ValueType = Datum;

export type Variant = 'small' | 'medium' | 'large';

export type HorizontalPlacement = 'left' | 'center' | 'right';
