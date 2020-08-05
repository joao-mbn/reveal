import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Icon from "@/UserInterface/Components/Icon/Icon";
import { changeSelectedTab } from "@/UserInterface/Redux/actions/explorer";
import { State } from "@/UserInterface/Redux/State/State";

// Renders Explorer Tabs
export default function NodeTabs() {
  const explorer = useSelector((state: State) => state.explorer); //TODO: Remove the reference to state here
  const dispatch = useDispatch();

  const { tabs } = explorer;
  if (!tabs) {
    return null;
  }
  const handleChange = (event: React.ChangeEvent<{}>, tabIndex: number) => {
    dispatch(changeSelectedTab({ tabIndex }));
  };

  return (
    <div className="node-tabs">
      <Tabs
        value={explorer.selectedTabIndex}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
      >
        {tabs.map((tab, idx) => (
          <Tab
            key={`node-type-${idx}`}
            label={
              <div className="node-tab">
                <Icon src={tab.icon} />
                <span>{tab.name}</span>
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  );
}
