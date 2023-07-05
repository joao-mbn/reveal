import { MultiPromptChain } from 'langchain/chains';
import { BaseChatModel } from 'langchain/chat_models/base';

import { CogniteClient } from '@cognite/sdk';

import { CogniteBaseChain, CopilotMessage } from '../types';

import { createDefaultChain } from './conversation/base';
import { FusionQAChain } from './fusionQA/fusionQA';
import { GraphQlChain } from './graphql/graphql';
import { AppBuilderChain } from './python/appBuilder';
import { getRouterChain } from './router/router';

export type CogniteChainName =
  | 'GraphQlChain'
  | 'AppBuilderChain'
  | 'FusionQAChain';

const destinationChains = (
  sdk: CogniteClient,
  model: BaseChatModel,
  messages: React.RefObject<CopilotMessage[]>
): {
  [key in CogniteChainName]: CogniteBaseChain;
} => ({
  // TODO: pass in messages and sdk at _call level, not at constructore
  GraphQlChain: new GraphQlChain({
    llm: model,
    sdk,
    messages,
    returnAll: true,
    verbose: true,
    humanApproval: false,
  }),
  AppBuilderChain: new AppBuilderChain({
    llm: model,
    sdk,
    messages,
    returnAll: true,
    verbose: true,
  }),
  FusionQAChain: new FusionQAChain({
    llm: model,
    sdk,
    messages,
    returnAll: true,
    verbose: false,
  }),
});

export const newChain = (
  sdk: CogniteClient, // TODO: remove this
  model: BaseChatModel,
  ref: React.RefObject<CopilotMessage[]>,
  excludeChains: CogniteChainName[] = []
) => {
  const chains = destinationChains(sdk, model, ref);
  const templates = Object.entries(chains)
    // make sure the key is not excluded in the `chains` that the user wants
    .filter(([key]) => !excludeChains.includes(key as CogniteChainName))
    // map to the correct format that the router expects
    .map(([key, chain]) => {
      return { name: key, description: chain.description };
    });

  const routerChain = getRouterChain(model, templates);

  const defaultChain = createDefaultChain(model);

  return new MultiPromptChain({
    routerChain,
    destinationChains: chains,
    defaultChain,
    verbose: true,
  });
};
