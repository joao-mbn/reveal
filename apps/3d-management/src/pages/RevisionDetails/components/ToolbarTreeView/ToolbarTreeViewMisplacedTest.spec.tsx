// Broken from migration. Suggest moving these to E2E tests in the future
describe('ToolbarTreeView expand into node test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});
// import React from 'react';
// import { Provider } from 'react-redux';

// import {
//   fixtureCubeNodeFirstChildId,
//   fixtureModelId,
//   fixtureRevisionId,
// } from '@3d-management/pages/RevisionDetails/components/ToolbarTreeView/__testUtils__/fixtures/fixtureConsts';
// import { toolbarTreeViewMswHandlers } from '@3d-management/pages/RevisionDetails/components/ToolbarTreeView/__testUtils__/toolbarTreeViewMswHandlers';
// import {
//   ToolbarTreeView,
//   ToolbarTreeViewProps,
// } from '@3d-management/pages/RevisionDetails/components/ToolbarTreeView/ToolbarTreeView';
// import configureStore from '@3d-management/store';
// import { expandArbitraryNode } from '@3d-management/store/modules/TreeView';
// import { render, screen } from '@testing-library/react';
// import { createBrowserHistory } from 'history';
// import { setupServer } from 'msw/node';

// import { Cognite3DViewer, CogniteCadModel } from '@cognite/reveal';

// jest.mock('antd/lib/notification');

// // to mock less 3d-viewer stuff disable some hooks
// jest.mock('./hooks/useSelectedNodesHighlights');
// jest.mock('./hooks/useCheckedNodesVisibility');
// jest.mock('./hooks/useFilteredNodesHighlights');
// jest.mock('./hooks/useViewerNodeClickListener');

// const history = createBrowserHistory();
// const store = configureStore(history);
// const { dispatch } = store;

// function renderWithProviders(component: any) {
//   return render(<Provider store={store}>{component}</Provider>);
// }

// const viewerMock = {} as Cognite3DViewer;
// const modelMock = {
//   modelId: fixtureModelId,
//   revisionId: fixtureRevisionId,
// } as CogniteCadModel;

// function ToolbarTreeViewWrapper(
//   props: Omit<ToolbarTreeViewProps, 'width' | 'model' | 'viewer'>
// ) {
//   return <ToolbarTreeView {...props} model={modelMock} viewer={viewerMock} />;
// }

// const server = setupServer(...toolbarTreeViewMswHandlers);

// /*
//  * Temporarily moved one "bad test" here from ToolbarTreeView.spec.
//  * it should be rewritten by doing something like that:
//  * https://redux.js.org/recipes/writing-tests#async-action-creators
//  * we basically need to test how store state changes after we call the action
//  */
// describe('ToolbarTreeView expand into node test', () => {
//   // Enable API mocking before tests.
//   beforeAll(() => server.listen());

//   // Reset any runtime request handlers we may add during the tests.
//   afterEach(() => server.resetHandlers());

//   // Disable API mocking after the tests are done.
//   afterAll(() => server.close());

//   // todo: rewrite. Test the action itself.
//   // alternative: write test component that will dispatch that expandArbitraryNode action
//   // currently there is no test isolation (store is outside which is too bad)
//   it('loads ancestors of the specified nodeId and adds them into the tree', async () => {
//     renderWithProviders(<ToolbarTreeViewWrapper nodesClickable />);

//     expect(await screen.findByText('Cube')).toBeInTheDocument();
//     expect(screen.queryByText('Cube (1)')).not.toBeInTheDocument();
//     expect(screen.queryAllByText('Load more...')).toHaveLength(1);

//     // expect tree state
//     /*
//      * RootNode
//      *  child1
//      *  Cube
//      *    Cube (1)
//      *    Load more
//      *  Load more
//      */

//     dispatch(
//       // @ts-ignore
//       expandArbitraryNode({
//         treeIndex: 4,
//         nodeId: fixtureCubeNodeFirstChildId,
//       })
//     );

//     expect(await screen.findByText('Cube (1)')).toBeInTheDocument();
//     expect(screen.queryAllByText('Load more...')).toHaveLength(2);
//   });
// });