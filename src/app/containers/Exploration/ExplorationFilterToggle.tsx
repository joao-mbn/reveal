import { Button, Tooltip } from '@cognite/cogs.js';
import React from 'react';

interface Props {
  filterState: boolean;
  onClick: () => void;
}
export const ExplorationFilterToggle: React.FC<Props> = ({
  filterState,
  onClick,
}) => {
  const icon = filterState ? 'PanelLeft' : 'PanelRight';
  const tooltipContent = filterState ? 'Hide filters' : 'Show filters';

  return (
    <Tooltip content={tooltipContent}>
      <Button
        icon={icon}
        aria-label="Toggle search filters"
        onClick={onClick}
      />
    </Tooltip>
  );
};
