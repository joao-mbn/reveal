import { useState, useEffect, useMemo } from 'react';

import styled from 'styled-components';

import { useAIDataTypesQuery } from '@fdx/services/dataTypes/queries/useAIDataTypesQuery';
import { useSearchQueryParams } from '@fdx/shared/hooks/useParams';
import { useSelectedDataModels } from '@fdx/shared/hooks/useSelectedDataModels';
import { useTranslation } from '@fdx/shared/hooks/useTranslation';
import {
  CopilotActions,
  CopilotDataModelQueryResponse,
  Markdown,
  trackCopilotUsage,
} from '@fusion/copilot-core';
import pluralize from 'pluralize';

import { Body, Button, Flex, NotificationDot } from '@cognite/cogs.js';

import { AIResultAggregateChart } from '../components/AIResultAggregateChart/AIResultAggregateChart';
import { CogPilotIcon } from '../components/CogPilotIcon';
import { useAICachedResults } from '../hooks/useAICachedResults';

import { AIFilterBuilder } from './AIFilterBuilder/AIFilterBuilder';

export const AIResultSummary = ({
  copilotMessage,
  setCopilotMessage,
  error,
  onEditFilter,
  loadingStatus,
}: {
  copilotMessage?: CopilotDataModelQueryResponse & { edited?: boolean };
  setCopilotMessage: (
    message: CopilotDataModelQueryResponse & { edited?: boolean }
  ) => void;
  onEditFilter: (newFilter: any) => void;
  loadingStatus?: { status: string; stage?: number };
  error?: string;
}) => {
  const { t } = useTranslation();
  const [query] = useSearchQueryParams();

  const selectedDataModels = useSelectedDataModels();

  const [isFilterBuilderVisible, setFilterBuilderVisible] = useState(false);
  const [showLongStatusMessage, setShowLongStatusMessage] = useState(false);

  const { isLoading } = useAIDataTypesQuery(
    query,
    selectedDataModels || [],
    copilotMessage
  );

  useEffect(() => {
    // Show the long status message after 10 seconds
    let timer: NodeJS.Timeout;

    if (isLoading) {
      timer = setTimeout(() => {
        setShowLongStatusMessage(true);
      }, 10000);
    } else {
      setShowLongStatusMessage(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  const results = useAICachedResults(copilotMessage);

  const resultText = useMemo(() => {
    let text = '';
    if ((results?.length || 0) === 0) {
      text += t('AI_SEARCH_RESULTS_EMPTY', {
        type: pluralize(copilotMessage?.dataModel.view.toLowerCase() || ''),
      });
    } else {
      text += copilotMessage?.content || '';
      if (!copilotMessage?.edited) {
        text += ' ' + t('AI_SEARCH_RESULTS_GENERATED_DISCLAIMER');
      }
    }
    return text;
  }, [results, t, copilotMessage]);

  const groupedResults = useMemo(
    () => (results || []).filter((item) => !!item.group),
    [results]
  );

  if (error) {
    return (
      <Header>
        <Flex gap={8} alignItems="center" style={{ width: '100%' }}>
          <CogPilotIcon />
          <Body strong inverted size="medium">
            {`${t('AI_FAILED')}: ${error}`}
          </Body>
        </Flex>
      </Header>
    );
  }

  if ((results === undefined && isLoading) || loadingStatus) {
    return (
      <Header $loading>
        <Flex gap={8} alignItems="center" style={{ width: '100%' }}>
          <CogPilotIcon />
          <Body strong inverted size="medium">
            {t(
              showLongStatusMessage
                ? 'AI_LOADING_TEXT_LONG'
                : 'AI_LOADING_TEXT',
              {
                status: loadingStatus?.status || t('AI_LOADING_SEARCH'),
              }
            )}
          </Body>
        </Flex>
        <Loader
          $progress={`${Math.floor((loadingStatus?.stage || 0) * 100)}%`}
        />
      </Header>
    );
  }

  return (
    <>
      <Header data-testid="ai-summary">
        <CogPilotIcon />
        <Flex direction="column" gap={8} style={{ width: '100%' }}>
          {groupedResults.length > 0 && (
            <AIResultAggregateChart items={groupedResults} />
          )}
          <MarkdownWrapper>
            <Markdown content={resultText} inverted />
          </MarkdownWrapper>
          {/* <Body size="medium" inverted strong>
            {resultText}
          </Body> */}
          <Flex alignItems="center" data-testid="ai-summary-filter-section">
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
                  trackCopilotUsage('GQL_VIEW_FILTER', {
                    filter: copilotMessage?.graphql.variables.filter,
                  });
                }}
              >
                {t('AI_INSPECT_FILTER')}
              </Button>
            </NotificationDot>
          </Flex>
        </Flex>
      </Header>
      {copilotMessage && (
        <CopilotActions message={copilotMessage} actions={[]} />
      )}
      {copilotMessage && isFilterBuilderVisible && (
        <AIFilterBuilder
          visible
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
            onEditFilter(newFilter);
            trackCopilotUsage('GQL_EDIT_FILTER', {
              oldFilter: copilotMessage?.graphql.variables.filter,
              filter: newFilter,
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

const MarkdownWrapper = styled.div`
  font-weight: 600;
  color: white;
  flex: 1;
`;
