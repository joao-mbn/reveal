import {
  useState,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
  MutableRefObject,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from 'react';

import * as Automerge from '@automerge/automerge';
import { debounce } from 'lodash';

import { useFlow, useUpdateFlow } from 'hooks/files';
import { AFlow, CanvasEdges, CanvasNodes } from 'types';
import { ChangeOptions } from '@automerge/automerge';
import { useUserInfo } from 'utils/user';

type FlowContextT = {
  externalId: string;
  isComponentsPanelVisible: boolean;
  setIsComponentsPanelVisible: Dispatch<SetStateAction<boolean>>;
  changeFlow: (
    fn: Automerge.ChangeFn<AFlow>,
    logger?: () => ChangeOptions<AFlow> | undefined
  ) => void;
  flow: AFlow;
  flowRef: MutableRefObject<AFlow>;
  changeNodes: (
    fn: AutomergeChangeNodesFn,
    logger?: () => ChangeOptions<AFlow> | undefined
  ) => void;
  changeEdges: (
    fn: AutomergeChangeEdgesFn,
    logger?: () => ChangeOptions<AFlow> | undefined
  ) => void;
  restoreWorkflow: (heads: Automerge.Heads) => void;
  nodes: CanvasNodes;
  edges: CanvasEdges;
  isHistoryVisible: boolean;
  setHistoryVisible: Dispatch<SetStateAction<boolean>>;
  previewHash?: string;
  setPreviewHash: Dispatch<SetStateAction<string | undefined>>;
};
export const WorkflowContext = createContext<FlowContextT>(undefined!);

export const useWorkflowBuilderContext = () => useContext(WorkflowContext);

type FlowContextProviderProps = {
  externalId: string;
  children: ReactNode;
  initialFlow: AFlow;
};

type AutomergeChangeNodesFn = Automerge.ChangeFn<CanvasNodes>;
type AutomergeChangeEdgesFn = Automerge.ChangeFn<CanvasEdges>;

export const FlowContextProvider = ({
  externalId,
  children,
  initialFlow,
}: FlowContextProviderProps) => {
  const [isComponentsPanelVisible, setIsComponentsPanelVisible] =
    useState(false);
  const [isHistoryVisible, setHistoryVisible] = useState(false);
  const [previewHash, setPreviewHash] = useState<string | undefined>();
  const [flowState, setFlowState] = useState(initialFlow);
  const flowRef = useRef(initialFlow);
  const { data: userInfo } = useUserInfo();
  const { mutate } = useUpdateFlow();
  const debouncedMutate = useMemo(() => debounce(mutate, 500), [mutate]);

  const changeFlow = useCallback(
    (
      fn: Automerge.ChangeFn<AFlow>,
      logger?: () => ChangeOptions<AFlow> | string | undefined
    ) => {
      const msg = logger ? logger() : undefined;
      const newFlow = msg
        ? Automerge.change(flowRef.current, msg, fn)
        : Automerge.change(flowRef.current, fn);
      flowRef.current = newFlow;
      setFlowState(newFlow);
      debouncedMutate(newFlow);
    },
    [debouncedMutate]
  );

  const restoreWorkflow = useCallback(
    (heads: Automerge.Heads) => {
      const oldRev = Automerge.view(flowRef.current, heads);
      const newFlow = Automerge.change(
        flowRef.current,
        {
          time: Date.now(),
          message: JSON.stringify({
            message: `Restore previus version`,
            user: userInfo?.displayName,
          }),
        },

        (d) => {
          d.canvas = JSON.parse(JSON.stringify(oldRev.canvas));
        }
      );
      flowRef.current = newFlow;
      setFlowState(newFlow);
      debouncedMutate(newFlow);
    },
    [debouncedMutate, userInfo?.displayName]
  );

  const changeNodes = useCallback(
    (
      fn: AutomergeChangeNodesFn,
      logger?: () => ChangeOptions<AFlow> | string | undefined
    ) => {
      changeFlow((f) => {
        fn(f.canvas.nodes);
      }, logger);
    },
    [changeFlow]
  );

  const flow = useMemo(() => {
    if (previewHash) {
      return Automerge.view(flowState, [previewHash]);
    }
    return flowState;
  }, [flowState, previewHash]);

  const changeEdges = useCallback(
    (
      fn: AutomergeChangeEdgesFn,
      logger?: () => ChangeOptions<AFlow> | undefined
    ) => {
      changeFlow((f) => {
        fn(f.canvas.edges);
      }, logger);
    },
    [changeFlow]
  );

  const { data } = useFlow(externalId, {
    staleTime: 0,
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (data) {
      flowRef.current = data;
      setFlowState(data);
    }
  }, [data]);

  useEffect(() => {
    if (!isHistoryVisible) {
      setPreviewHash(undefined);
    }
  }, [isHistoryVisible]);

  return (
    <WorkflowContext.Provider
      value={{
        externalId,
        isComponentsPanelVisible,
        setIsComponentsPanelVisible,
        flow,
        flowRef,
        changeFlow,
        changeNodes,
        changeEdges,
        nodes: flowState.canvas.nodes,
        edges: flowState.canvas.edges,
        isHistoryVisible,
        setHistoryVisible,
        previewHash,
        setPreviewHash,
        restoreWorkflow,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};
