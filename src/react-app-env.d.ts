// / <reference types="react-scripts" />
declare module '*.svg' {
  const content: any;
  export default content;
}
declare module '*.png' {
  const content: any;
  export default content;
}
declare module '*.css';
declare module '@cognite/gcs-browser-upload';
declare module 'react-split' {
  const SplitPane: FunctionComponent<{
    minSize: number | number[];
    sizes: number | number[];
    expandToMin: boolean;
    gutterSize: number;
    gutterAlign: string;
    dragInterval: number;
    cursor: string;
    onDragEnd: () => void;
  }>;
  export default SplitPane;
}
