import { type ReactElement } from 'react';

import styled from 'styled-components';

import { FLOATING_ELEMENT_MARGIN } from '@3d-management/pages/ContextualizeEditor/constants';
import noop from 'lodash-es/noop';

import { ToolBar, Tooltip, Button } from '@cognite/cogs.js';
import { withSuppressRevealEvents } from '@cognite/reveal-react-components';
import { useSDK } from '@cognite/sdk-provider';

import {
  ToolType,
  setTool,
  useContextualizeThreeDViewerStore,
} from '../../../useContextualizeThreeDViewerStore';
import { deleteCdfThreeDCadContextualization } from '../../../utils/deleteCdfThreeDCadContextualization';

type CadContextualizedFloatingToolBar = {
  modelId: number;
  revisionId: number;
  onContextualizationDeleted: typeof noop;
};

export function CadContextualizedFloatingToolBar({
  modelId,
  revisionId,
  onContextualizationDeleted,
}: CadContextualizedFloatingToolBar): ReactElement {
  const sdk = useSDK();

  const { tool, threeDViewer, model } =
    useContextualizeThreeDViewerStore.getState();

  const handleAddClick = () => {
    if (tool === ToolType.ADD_THREEDNODE_MAPPING) {
      setTool(ToolType.NONE);
      return;
    }

    setTool(ToolType.ADD_THREEDNODE_MAPPING);
  };

  const handleDeleteClick = async () => {
    if (!threeDViewer || !modelId || !model) return;

    const { selectedAndContextualizedNodesList } =
      useContextualizeThreeDViewerStore.getState();

    const nodeIds = selectedAndContextualizedNodesList.map(
      (item) => item.nodeId
    );
    const mappedNodesDeleted = await deleteCdfThreeDCadContextualization({
      sdk,
      modelId,
      revisionId,
      nodeIds: nodeIds,
    });

    onContextualizationDeleted(mappedNodesDeleted);

    if (tool === ToolType.DELETE_THREEDNODE_MAPPING) {
      setTool(ToolType.NONE);
      return;
    }

    setTool(ToolType.DELETE_THREEDNODE_MAPPING);
  };

  return (
    <StyledToolPanel>
      <ToolBar direction="horizontal">
        <>
          <Tooltip content="Add contextualization" position="right">
            <Button
              icon="AddLarge"
              type="ghost"
              aria-label="Add contextualization tool"
              toggled={tool === ToolType.ADD_ANNOTATION}
              onClick={handleAddClick}
            />
          </Tooltip>
          <Tooltip content="Delete contextualization" position="right">
            <Button
              icon="Delete"
              type="ghost"
              aria-label="Delete contextualization tool"
              toggled={tool === ToolType.DELETE_ANNOTATION}
              onClick={handleDeleteClick}
            />
          </Tooltip>
        </>
      </ToolBar>
    </StyledToolPanel>
  );
}

const StyledToolPanel = styled(withSuppressRevealEvents(ToolBar))`
  position: absolute;
  left: ${FLOATING_ELEMENT_MARGIN + 80}px;
  top: ${FLOATING_ELEMENT_MARGIN}px;
`;
