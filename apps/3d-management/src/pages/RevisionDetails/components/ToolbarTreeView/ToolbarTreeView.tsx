import React, { useEffect, useRef, useState } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';

import ErrorBoundary from '@3d-management/components/ErrorBoundary';
import Spinner from '@3d-management/components/Spinner';
import { useFilteredNodesHighlights } from '@3d-management/pages/RevisionDetails/components/ToolbarTreeView/hooks/useFilteredNodesHighlights';
import { useViewerNodeClickListener } from '@3d-management/pages/RevisionDetails/components/ToolbarTreeView/hooks/useViewerNodeClickListener';
import { treeViewFocusContainerId } from '@3d-management/pages/RevisionDetails/components/ToolbarTreeView/treeViewFocusContainerId';
import TreeView, {
  NodesTreeViewRefType,
} from '@3d-management/pages/RevisionDetails/components/TreeView/NodesTreeView';
import {
  TreeDataNode,
  TreeLoadMoreNode,
} from '@3d-management/pages/RevisionDetails/components/TreeView/types';
import { RootState } from '@3d-management/store';
import {
  checkNodes,
  expandNodes,
  fetchInitialNodes,
  loadNodeChildren,
  loadSiblings,
  resetTreeViewState,
  SelectedNode,
  selectNodes,
  TreeIndex,
  TreeViewState,
} from '@3d-management/store/modules/TreeView';

import { Button, Title } from '@cognite/cogs.js';
import { CogniteCadModel, Cognite3DViewer } from '@cognite/reveal';

import { useCheckedNodesVisibility } from './hooks/useCheckedNodesVisibility';
import { useResizeHandler } from './hooks/useResizeHander';
import { useSelectedNodesHighlights } from './hooks/useSelectedNodesHighlights';
import { NodeInfoModal } from './NodeInfoModal';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: hidden;
`;

type TreeViewWrapperProps = {
  model: CogniteCadModel;
  height: number;

  onNodeInfoRequested: (treeIndex: number) => void;

  viewer: Cognite3DViewer;
  nodesClickable: boolean;
};

function ToolbarTreeViewComponent(props: TreeViewWrapperProps) {
  const treeViewRef = useRef<NodesTreeViewRefType>(null);

  const { modelId, revisionId } = props.model;
  const state: TreeViewState = useSelector(
    ({ treeView }: RootState) => treeView
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInitialNodes(modelId, revisionId));
    return () => {
      dispatch(resetTreeViewState());
    };
  }, [modelId, revisionId, dispatch]);

  useViewerNodeClickListener({
    viewer: props.viewer,
    model: props.model,
    treeViewRef,
    nodesClickable: props.nodesClickable,
  });

  useCheckedNodesVisibility({
    model: props.model,
    treeData: state.treeData,
    checkedKeys: state.checkedNodes,
  });

  useFilteredNodesHighlights({
    model: props.model,
  });

  useSelectedNodesHighlights({
    model: props.model,
  });

  const loadChildren = async (treeNode: TreeDataNode): Promise<void> => {
    if (treeNode.children && treeNode.children.length) {
      return;
    }

    await dispatch(
      loadNodeChildren({
        parent: {
          nodeId: treeNode.meta.id,
          treeIndex: treeNode.key,
        },
      })
    );
  };

  const loadMoreClicked = ({ key, cursor, parent }: TreeLoadMoreNode) => {
    dispatch(
      loadSiblings({
        cursor,
        cursorKey: key,
        parent,
      })
    );
  };

  const nodeChecked = (checkedKeys: Array<TreeIndex>) => {
    dispatch(checkNodes(checkedKeys));
  };

  const nodeExpanded = (expandedKeys: Array<number>) => {
    dispatch(expandNodes(expandedKeys));
  };

  const nodeSelected = (selectedKeys: Array<SelectedNode>) => {
    dispatch(selectNodes(selectedKeys));
  };

  const nodeInfoRequested = (treeIndex: number) => {
    props.onNodeInfoRequested(treeIndex);
  };
  if (state.loading) {
    return <Spinner />;
  }
  if (state.error) {
    throw state.error;
  }
  return (
    <TreeView
      ref={treeViewRef}
      treeData={state.treeData}
      checkedKeys={state.checkedNodes}
      expandedKeys={state.expandedNodes}
      selectedNodes={state.selectedNodes}
      loadChildren={loadChildren}
      loadSiblings={loadMoreClicked}
      onCheck={nodeChecked}
      onExpand={nodeExpanded}
      onSelect={nodeSelected}
      onNodeInfoRequest={nodeInfoRequested}
      height={props.height}
    />
  );
}

export type ToolbarTreeViewProps = { style?: React.CSSProperties } & Omit<
  TreeViewWrapperProps,
  'height' | 'onNodeInfoRequested'
>;

const FallbackComponent = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div role="alert" style={{ maxHeight: '100%', textAlign: 'left' }}>
      <Title level={4}>Something went wrong.</Title>

      <div style={{ margin: '16px 0' }}>
        <p>We have been notified and will fix it.</p>
        <Button onClick={resetErrorBoundary} type="primary">
          Reload component
        </Button>
      </div>

      <pre
        style={{
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          maxWidth: '100%',
          maxHeight: '100%',
          overflow: 'auto',
        }}
      >
        {error.message}
      </pre>
    </div>
  );
};

export function ToolbarTreeView({ style, ...restProps }: ToolbarTreeViewProps) {
  const treeViewContainer = useRef<HTMLDivElement>(null);
  const { height: treeViewHeight } = useResizeHandler(treeViewContainer);

  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [nodeInfoTreeIndex, setNodeInfoTreeIndex] = useState<
    number | undefined
  >(undefined);

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <Container
        style={style}
        ref={treeViewContainer}
        id={treeViewFocusContainerId}
        tabIndex={
          -1 /* antd Tree doesn't support keyboard handling, focus, tabindex, that's why it's done here */
        }
      >
        <ToolbarTreeViewComponent
          {...restProps}
          height={treeViewHeight}
          onNodeInfoRequested={(treeIndex) => {
            setNodeInfoTreeIndex(treeIndex);
            setInfoModalOpen(true);
          }}
        />
      </Container>
      <NodeInfoModal
        treeIndex={nodeInfoTreeIndex}
        onClose={() => setInfoModalOpen(false)}
        open={infoModalOpen}
      />
    </ErrorBoundary>
  );
}
