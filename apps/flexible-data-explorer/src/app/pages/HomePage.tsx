import { useEffect } from 'react';

import styled from 'styled-components';

import { Flex } from '@cognite/cogs.js';

import { AIDisclaimer } from '../components/links/AIDisclaimer';
import { DataExplorerLink } from '../components/links/DataExplorerLink';
import { Categories } from '../containers/category/Categories';
import { Page } from '../containers/page/Page';
import { AILabels } from '../containers/search/components/AILabels';
import { AISwitch } from '../containers/search/components/AISwitch';
import { SearchBar } from '../containers/search/SearchBar';
import { SearchConfiguration } from '../containers/search/SearchConfiguration';
import { useIsCopilotEnabled } from '../hooks/useFlag';
import { useAISearchParams } from '../hooks/useParams';

const SEARCH_BAR_OPTIONS = {
  filterMenuMaxHeight: '50vh',
};

export const HomePage = () => {
  const [isAIEnabled, setIsAIEnabled] = useAISearchParams();
  const isCopilotEnabled = useIsCopilotEnabled();

  useEffect(() => {
    if (!isCopilotEnabled && isAIEnabled) {
      setIsAIEnabled(false);
    }
  }, [setIsAIEnabled, isAIEnabled, isCopilotEnabled]);
  return (
    <Page disableScrollbarGutter>
      <SearchContainer $isAIEnabled={isAIEnabled}>
        <Flex
          direction="column"
          justifyContent="center"
          className="search-bar-container"
          alignItems="center"
        >
          <AILabelsContainer $isAIEnabled={isAIEnabled}>
            <AILabels />
          </AILabelsContainer>
          <SearchConfiguration header />
          <SearchBarContainer>
            <SearchBar width="774px" options={SEARCH_BAR_OPTIONS} />
          </SearchBarContainer>
          {isAIEnabled ? <AIDisclaimer /> : <DataExplorerLink />}
        </Flex>
        {isCopilotEnabled && (
          <AISwitchContainer>
            <AISwitch />
          </AISwitchContainer>
        )}
      </SearchContainer>

      <Page.Body>{!isAIEnabled && <Categories />}</Page.Body>
    </Page>
  );
};

const SearchContainer = styled.div<{ $isAIEnabled: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: ${(props) => (props.$isAIEnabled ? '100%' : '60vh')};

  box-sizing: border-box;

  &&:before {
    content: '';
    background: var(
      --bg,
      radial-gradient(
        141.23% 94.33% at 19.9% 45.6%,
        rgba(111, 59, 228, 0.36) 0%,
        rgba(86, 37, 186, 0) 100%
      ),
      radial-gradient(
        115.12% 80.81% at 76.81% 40.18%,
        rgba(102, 40, 240, 0.29) 0%,
        rgba(142, 92, 255, 0.15) 100%
      ),
      #fff
    );
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: ${(props) => (props.$isAIEnabled ? 1 : 0)};
    transition: 0.3s all;
    z-index: -1;
  }
  &&:after {
    content: '';
    background: radial-gradient(
        62.29% 135.84% at 0% 0%,
        rgba(10, 119, 247, 0.1024) 0%,
        rgba(10, 119, 246, 0) 100%
      ),
      radial-gradient(
        40.38% 111.35% at 76.81% 40.18%,
        rgba(84, 108, 241, 0.16) 0%,
        rgba(84, 108, 241, 0) 100%
      ),
      #ffffff;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -2;
  }

  transition: 0.3s all;

  border-bottom: 1px solid rgba(83, 88, 127, 0.16);

  .search-bar-container {
    margin-top: auto;
    margin-bottom: 12px;
  }
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AISwitchContainer = styled.div`
  justify-self: flex-end;
  margin-top: auto;
  margin-bottom: 24px;
`;

const AILabelsContainer = styled.div<{ $isAIEnabled: boolean }>`
  margin-bottom: 16px;
  opacity: ${(props) => (props.$isAIEnabled ? 1 : 0)};
  transition: 0.3s all;
`;
