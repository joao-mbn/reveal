import "reset-css";
import "@/UserInterface/styles/scss/index.scss";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import SplitPane from "react-split-pane";

import RightPanel from "@/UserInterface/components/Panels/RightPanel";
import LeftPanel from "@/UserInterface/components/Panels/LeftPanel";

import { generateNodeTree } from "@/UserInterface/redux/actions/explorer";
import { ReduxStore } from "@/UserInterface/interfaces/common";
import { setVisualizerData } from "@/UserInterface/redux/actions/visualizers";

import NotificationsToActionsAdaptor from "@/UserInterface/adaptors/NotificationToAction";
import { VirtualUserInterface } from "@/Core/States/VirtualUserInterface";
import UserInterfaceListener from "@/UserInterface/adaptors/UserInterfaceListener";
import { Modules } from "@/Core/Module/Modules";
import { BaseRootNode } from "@/Core/Nodes/BaseRootNode";
import Viewer from "@/UserInterface/info/Viewer";
import { Range3 } from "@/Core/Geometry/Range3";
import { ThreeRenderTargetNode } from "@/Three/Nodes/ThreeRenderTargetNode";
import Toolbar from "@/UserInterface/impl/Toolbar";
import { Appearance } from "@/Core/States/Appearance";

/**
 * Subsurface Visualizer Component of the application
 * This will render all the components (Settings/Explorer/3D viewers etc.)
 */
export default function NodeVisualizer(props: { root?: BaseRootNode }) {
  const dispatch = useDispatch();
  const common = useSelector((state: ReduxStore) => state.common);
  const { root } = props;
  // Add viewer ref here
  const visualizers = useSelector((state: ReduxStore) => state.visualizers);

  // success callback for registering viewers to DOM
  const viewerElementCallback = useCallback(
    (element: HTMLElement) => {
      if (!element || !root) {
        return;
      }
      // clear Node
      element.innerHTML = "";

      const notificationAdaptor = new NotificationsToActionsAdaptor(dispatch);
      VirtualUserInterface.install(new UserInterfaceListener(notificationAdaptor, dispatch));
      // Add new viewers here Eg - new Viewer("2D", htmlElement2D)
      const viewers = [new Viewer("3D", element)];
      // Add targets and toolbars to root node
      for (const viewer of viewers) {
        const target = new ThreeRenderTargetNode(Range3.createByMinAndMax(0, 0, 1, 1));
        const toolbar = new Toolbar();
        target.addTools(toolbar);
        target.setName(viewer.getName());
        viewer.setTarget(target);
        viewer.setToolbar(toolbar);
        root.targets.addChild(target);
        element.appendChild(target.domElement);
        target.setActiveInteractive();
      }
      // Add target and toolbar data to state
      dispatch(setVisualizerData({ viewers }));
      dispatch(generateNodeTree({ root }));
      Modules.instance.initializeWhenPopulated(root);
      // tslint:disable-next-line: no-console
      console.log("SubsurfaceVisualizer: Added toolbars and viewers");
    },
    [root]
  );

  return (
    <div className="subsurface-container">
      <SplitPane
        split="vertical"
        minSize={common.isFullscreen ? 0 : Appearance.leftPanelDefaultSize}
        maxSize={common.isFullscreen ? 0 : Appearance.leftPanelMaxSize}
        onChange={() => {
          const targetIds = Object.keys(visualizers.targets);
          for (const id of targetIds) {
            visualizers.targets[id].onResize();
          }
        }}
      >
        <LeftPanel />
        {/* Pass viewer callbacks as needed*/}
        <RightPanel viewer3D={viewerElementCallback} />
      </SplitPane>
    </div>
  );
}
