import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Draggable from "react-draggable";

import { Appearance } from "@/Core/States/Appearance";
import InIcon from "@images/Actions/In.png";
import OutIcon from "@images/Actions/Out.png";
import Icon from "@/UserInterface/Components/Icon/Icon";
import { executeToolBarCommand, selectOnChange } from "@/UserInterface/Redux/actions/visualizers";
import { ToolbarCommand } from "@/UserInterface/NodeVisualizer/ToolBar/ToolbarCommand";

/**
 * Get width and height of toolbar
 */
const toolBarDimensions = (dimension1: number, dimension2: number, isHorizontal: boolean) => {
  if (isHorizontal) {
    return { width: dimension2, height: dimension1 };
  } else {
    return { width: dimension1, height: dimension2 };
  }
};

/**
 * Get bottom and right margins of toolbar
 */
const toolBarWrapperMargins = (dimension1: number, dimension2: number, isHorizontal: boolean) => {
  if (isHorizontal) {
    return { marginBottom: dimension1, marginRight: dimension2 };
  } else {
    return { marginRight: dimension1, marginBottom: dimension2 };
  }
};

// Visualizer ToolBar Component
export default function VisualizerToolbar(props: {
  toolbar: ToolbarCommand[];
  visualizerId: string;
}) {
  const { visualizerId, toolbar } = props;
  if (!toolbar) return null;
  const dispatch = useDispatch();

  // Toolbar orientation
  const [horizontal, setHorizontal] = useState(true);
  // Whether dragging is happening
  const [dragging, setDragging] = useState(false);

  // Calls when handle is clicked
  const onHandleClick = () => {
    setHorizontal(!horizontal);
  };
  // Called when dragging stops
  const onStop = () => {
    if (dragging) {
      setDragging(false);
    } else {
      onHandleClick();
    }
  };

  // Called when dragging
  const onDrag = () => {
    if (!dragging) {
      setDragging(true);
    }
  };

  const visibleNondropdownCommands = toolbar.filter(command => command.isVisible && !command.isDropdown);
  const visibleDropdownCommands = toolbar.filter(command => command.isVisible && command.isDropdown);

  // dropdown Items takes twice the size
  const noOfSlots = visibleNondropdownCommands.length + visibleDropdownCommands.length * 2;
  // No Of commands per line in Toolbar UI
  const toolbarCommandsPerLine = Appearance.toolbarCommandsPerLine;
  // Number of rows in toolbar
  const numberOfToolbarRows = Math.ceil(noOfSlots / toolbarCommandsPerLine);
  // Consider borders,margins and padding of img tag
  const iconSize = Appearance.toolbarIconSize + 7.2;
  const [dimension1, dimension2] = [
    numberOfToolbarRows * iconSize,
    numberOfToolbarRows > 1 ? toolbarCommandsPerLine * iconSize : noOfSlots * iconSize
  ];

  const addButton = (index, command) => {
    return (
      <div
        onClick={() =>
          dispatch(
            executeToolBarCommand({
              visualizerId,
              index
            })
          )
        }
        key={`visualizer-toolbar-icon-${index}`}
        className={`visualizer-tool-bar-icon ${
          command.isChecked ? "visualizer-tool-bar-icon-selected" : ""
        }`}
      >
        {command.icon && (
          <Icon
            src={command.icon}
            tooltip={{
              text: command.command.getTooltip(),
              placement: horizontal ? "bottom" : "right-start"
            }}
            iconSize={{
              width: Appearance.toolbarIconSize,
              height: Appearance.toolbarIconSize
            }}
          />
        )}
      </div>
    );
  };

  const addDropdown = (index, command) => {
    return (
      <div key={`visualizer-toolbar-icon-${index}`} className="visualizer-tool-bar-icon">
        <input
          type="number"
          list="data"
          className="visualizer-tool-bar-input"
          onChange={event =>
            dispatch(
              selectOnChange({
                visualizerId,
                index,
                event
              })
            )
          }
        />
        <datalist id="data">
          {command.command.dropdownOptions.map(option => (
            <option key={option}>{option}</option>
          ))}
        </datalist>
      </div>
    );
  };

  // Render toolbar
  return (
    <Draggable bounds="parent" handle=".handle" onDrag={onDrag} onStop={onStop}>
      <div
        className="visualizer-toolbar-wrapper"
        style={{
          ...toolBarWrapperMargins(dimension1 + iconSize, dimension2 + iconSize, horizontal)
        }}
      >
        <div className="visualizer-toolbar-container">
          <div
            className="handle"
            style={{
              cursor: dragging ? "move" : "pointer"
            }}
          >
            {horizontal ? <img src={InIcon} /> : <img src={OutIcon} />}
          </div>
          <div
            className="visuaizer-toolbar"
            style={{
              ...toolBarDimensions(dimension1, dimension2, horizontal),
              flexDirection: horizontal ? "row" : "column",
              left: horizontal ? "0.3rem" : "-1rem",
              top: horizontal ? "0rem" : "1.2rem"
            }}
          >
            {toolbar.map((command, index) => {
              if (command.isVisible)
              {
                if (command.isDropdown)
                {
                  return addDropdown(index, command);
                }
                else
                {
                  return addButton(index, command);
                }
              }
              else
              {
                return null;
              }
            })}
          </div>
        </div>
      </div>
    </Draggable>
  );
}
