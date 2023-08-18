import { useState, useMemo } from 'react';

import styled from 'styled-components';

import {
  CopilotActions,
  CopilotDataModelQueryMessage,
  sendToCopilotEvent,
  useToCopilotEventHandler,
} from '@fusion/copilot-core';
import pluralize from 'pluralize';

import { Body, Button, Flex, NotificationDot } from '@cognite/cogs.js';

import { useSearchQueryParams } from '../../../hooks/useParams';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAIDataTypesQuery } from '../../../services/dataTypes/queries/useAIDataTypesQuery';
import { useSelectedDataModels } from '../../../services/useSelectedDataModels';
import { CogPilotIcon } from '../components/CogPilotIcon';
import { useAICachedResults } from '../hooks/useAICachedResults';

import { AIFilterBuilder } from './AIFilterBuilder/AIFilterBuilder';

export const AIResultSummary = ({
  copilotMessage,
  setCopilotMessage,
}: {
  copilotMessage?: CopilotDataModelQueryMessage & { edited?: boolean };
  setCopilotMessage: (
    message: CopilotDataModelQueryMessage & { edited?: boolean }
  ) => void;
}) => {
  const { t } = useTranslation();
  const [query] = useSearchQueryParams();
  const selectedDataModels = useSelectedDataModels();

  const [isFilterBuilderVisible, setFilterBuilderVisible] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<
    | {
        stage?: number;
        status: string;
      }
    | undefined
  >(undefined);

  const { isLoading } = useAIDataTypesQuery(
    query,
    selectedDataModels || [],
    copilotMessage
  );
  const results = useAICachedResults(copilotMessage);

  useToCopilotEventHandler('NEW_MESSAGES', (messages) => {
    for (const message of messages) {
      if (message.type === 'data-model-query') {
        setLoadingProgress(undefined);
      }
    }
  });

  useToCopilotEventHandler('LOADING_STATUS', (status) => {
    setLoadingProgress(status);
  });

  const resultText = useMemo(() => {
    let text = '';
    if ((results?.length || 0) === 0) {
      text += t('AI_SEARCH_RESULTS_EMPTY', {
        type: pluralize(copilotMessage?.dataModel.view.toLowerCase() || ''),
      });
    } else {
      text += copilotMessage?.content;
      if (!copilotMessage?.edited) {
        text += t('AI_SEARCH_RESULTS_GENERATED_DISCLAIMER');
      }
    }
    return text;
  }, [results, t, copilotMessage]);

  if ((results === undefined && isLoading) || loadingProgress) {
    return (
      <Header $loading>
        <Flex gap={8} alignItems="center" style={{ width: '100%' }}>
          <CogPilotIcon />
          <Body strong inverted size="medium">
            {t('AI_LOADING_TEXT', {
              status: loadingProgress?.status || t('AI_LOADING_SEARCH'),
            })}
          </Body>
        </Flex>
        <Loader
          $progress={`${Math.floor((loadingProgress?.stage || 0) * 100)}%`}
        />
      </Header>
    );
  }

  return (
    <>
      <Header>
        <CogPilotIcon />
        <Flex direction="column" gap={8} style={{ width: '100%' }}>
          <Body size="medium" inverted strong>
            {resultText}
          </Body>
          <Flex alignItems="center">
            <Body size="medium" muted inverted style={{ flex: 1 }}>
              {t('AI_FILTER_APPLIED', {
                filter: copilotMessage?.summary || '',
              })}
            </Body>
            <NotificationDot hidden={!copilotMessage?.edited}>
              <Button
                size="small"
                inverted
                icon="Filter"
                onClick={() => {
                  setFilterBuilderVisible(true);
                }}
              >
                {t('AI_INSPECT_FILTER')}
              </Button>
            </NotificationDot>
          </Flex>
        </Flex>
      </Header>
      {copilotMessage && <CopilotActions message={copilotMessage} />}
      {copilotMessage && (
        <AIFilterBuilder
          visible={isFilterBuilderVisible}
          space={copilotMessage.dataModel.space}
          dataModelExternalId={copilotMessage.dataModel.externalId}
          type={copilotMessage.dataModel.view}
          version={copilotMessage.dataModel.version}
          initialFilter={copilotMessage.graphql.variables.filter}
          onOk={(newFilter) => {
            setCopilotMessage({
              ...copilotMessage,
              graphql: {
                ...copilotMessage.graphql,
                variables: {
                  ...copilotMessage.graphql.variables,
                  filter: newFilter,
                },
              },
              edited: true,
            });
            sendToCopilotEvent('SUMMARIZE_QUERY', {
              ...copilotMessage.graphql,
              variables: {
                ...copilotMessage.graphql.variables,
                filter: newFilter,
              },
            });
            setFilterBuilderVisible(false);
          }}
          onCancel={() => {
            setFilterBuilderVisible(false);
          }}
        />
      )}
    </>
  );
};

const Header = styled.div<{ $loading?: boolean }>`
  display: flex;
  padding: 16px;
  gap: 8px;
  border-radius: 8px;
  background: ${(props) =>
    props.$loading
      ? `var(--text-icon-ai-muted, rgba(96, 42, 207, 0.65));`
      : `radial-gradient(
    190.15% 190.15% at -12.5% 12.5%,
    #8b5cf6 0%,
    #5e28d9 100%
  )`};
  box-shadow: 0px 3px 4px 0px rgba(24, 24, 28, 0.03),
    0px 1px 2px 0px rgba(24, 24, 28, 0.04);
  color: #fff;
  font-size: 14px;
  margin-bottom: 16px;
  transition: 0.3s all;
  position: relative;
`;

const Loader = styled.div<{ $progress: string }>`
  display: flex;
  position: absolute;
  transition: 0.3s all;
  height: 100%;
  width: 100%;
  border-radius: 8px;
  left: 0;
  top: 0;
  width: ${(props) => props.$progress};
  background: radial-gradient(
    190.15% 190.15% at -12.5% 12.5%,
    #8b5cf6 0%,
    #5e28d9 100%
  );
  box-shadow: 0px 3px 4px 0px rgba(24, 24, 28, 0.03),
    0px 1px 2px 0px rgba(24, 24, 28, 0.04);
  color: #fff;
  z-index: -1;
`;
