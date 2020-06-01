import { SettingsStateInterface } from "./settings";
import { ExplorerStateInterface } from "./explorer";
import { VisualizerStateInterface } from "./visualizers";

// TitleBar interface
export interface TitleBarInterface {
  name: string;
  icon: { type: string; name: string };
  toolBar: ToolBarType;
}

// ToolBar interface
export type ToolBarType = {
  icon: { type: string; name: string };
  selected?: boolean;
  action?: {
    type: string;
    subSectionId?: string;
  };
}[];

// Redux Store
export interface ReduxStore {
  settings: SettingsStateInterface;
  explorer: ExplorerStateInterface;
  visualizers: VisualizerStateInterface
}
