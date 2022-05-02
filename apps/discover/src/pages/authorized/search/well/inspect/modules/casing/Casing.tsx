import React, { useMemo, useRef, useState } from 'react';

import { SearchBox } from 'components/Filters';
import { MultiStateToggle } from 'components/MultiStateToggle';
import { FlexGrow } from 'styles/layout';

import { Separator } from '../../elements';
import { ScrollButtons } from '../common/ScrollButtons';
import { DEFAULT_ACTIVE_VIEW_MODE, VIEW_MODES } from '../events/Npt/constants';
import { ViewModes } from '../events/Npt/types';

import CasingGraphView from './CasingGraphView';
import CasingTableView from './CasingTableView';
import { SideModes } from './CasingView/types';
import { DEFAULT_ACTIVE_SIDE_MODE, SIDE_MODES } from './constants';
import { SearchBoxWrapper, TopBarWrapper } from './elements';

const FILTER_PLACEHOLDER = 'Filter by Well/Wellbore';

export const Casing: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewModes>(DEFAULT_ACTIVE_VIEW_MODE);
  const [activeSideMode, setActiveSideMode] = useState<SideModes>(
    DEFAULT_ACTIVE_SIDE_MODE
  );

  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const searchBox = useMemo(
    () => (
      <SearchBox
        placeholder={FILTER_PLACEHOLDER}
        value={searchPhrase}
        onSearch={setSearchPhrase}
      />
    ),
    [searchPhrase]
  );
  return (
    <>
      <TopBarWrapper>
        <MultiStateToggle<ViewModes>
          activeOption={viewMode}
          options={VIEW_MODES}
          onChange={setViewMode}
        />
        <MultiStateToggle<SideModes>
          activeOption={activeSideMode}
          options={SIDE_MODES}
          onChange={setActiveSideMode}
        />

        {viewMode === VIEW_MODES.Table && (
          <>
            <Separator />
            <SearchBoxWrapper>{searchBox}</SearchBoxWrapper>
          </>
        )}

        <FlexGrow />

        {viewMode === VIEW_MODES.Graph && (
          <ScrollButtons scrollRef={scrollRef} />
        )}
      </TopBarWrapper>

      {viewMode === VIEW_MODES.Graph && (
        <CasingGraphView scrollRef={scrollRef} sideMode={activeSideMode} />
      )}
      {viewMode === VIEW_MODES.Table && (
        <CasingTableView
          searchPhrase={searchPhrase}
          sideMode={activeSideMode}
        />
      )}
    </>
  );
};

export default Casing;
