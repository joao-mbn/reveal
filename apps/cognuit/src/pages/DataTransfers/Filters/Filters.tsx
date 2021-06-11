import { useState } from 'react';

import { Button } from '@cognite/cogs.js';

import { FiltersProps, FilterTypes, FilterListFilters } from './types';
import { FilterList } from './FilterList';
import { RenderSecondaryFilters } from './RenderSecondaryFilters';
import {
  FiltersWrapper,
  StartContainer,
  DropdownWrapper,
  DropdownSeparator,
} from './elements';

export const Filters = ({
  source,
  target,
  date,
  datatype,
  configuration,
  onNameSearchChange,
  onReset,
}: FiltersProps) => {
  const [nameFilter, setNameFilter] = useState('');
  const [openFilter, setOpenFilter] = useState<keyof FilterTypes | ''>('');

  const resetFilters = () => {
    setNameFilter('');
    source.onSelectSource('');
    target.onSelectTarget('');
    configuration.onSelectConfiguration(null);
    datatype.onSelectType('');
    date.onSelectDate({});
    onReset();
  };

  const toggleFilter = (filterName: keyof FilterTypes) => {
    setOpenFilter(openFilter === filterName ? '' : filterName);
  };

  const closeFilters = () => {
    setOpenFilter('');
  };

  const configurationFilterList: FilterListFilters = [
    {
      name: 'config',
      label: 'Configuration',
      source: configuration.configurations,
      visible: true,
      onSelect: configuration.onSelectConfiguration,
      value: configuration?.selected?.name,
    },
  ];

  const sourceFilterList: FilterListFilters = [
    {
      name: 'source',
      label: 'Source',
      source: source.sources,
      onSelect: source.onSelectSource,
      visible: source.sources.length > 0,
      value: source.selected,
    },
    {
      name: 'sourceProject',
      label: 'Source project',
      source: source.projects,
      onSelect: source.onSelectProject,
      visible: !!(source.selected && source.projects.length > 0),
      value: source?.selectedProject?.external_id,
    },
    {
      name: 'target',
      label: 'Target',
      source: target.targets,
      onSelect: target.onSelectTarget,
      visible: !!(
        source.selected &&
        source.selectedProject &&
        target.targets.length > 0
      ),
      value: target.selected,
    },
    {
      name: 'targetProject',
      label: 'Target project',
      source: target.projects,
      onSelect: target.onSelectProject,
      visible: !!(target.selected && target.projects.length > 0),
      value: target?.selectedProject?.external_id,
    },
  ];

  return (
    <FiltersWrapper>
      <>
        {configuration.configurations.length > 0 && (
          <StartContainer>
            <DropdownWrapper disabled={!!source.selected}>
              <FilterList
                closeHandler={closeFilters}
                toggleFilter={toggleFilter}
                openFilter={openFilter}
                filters={configurationFilterList}
              />
            </DropdownWrapper>
            <DropdownSeparator>or</DropdownSeparator>
            <DropdownWrapper disabled={!!configuration.selected}>
              <FilterList
                closeHandler={closeFilters}
                toggleFilter={toggleFilter}
                openFilter={openFilter}
                filters={sourceFilterList}
              />
            </DropdownWrapper>

            <Button
              variant="ghost"
              type="danger"
              size="large"
              style={{ marginRight: 16 }}
              disabled={!source.selected && !configuration.selected}
              onClick={resetFilters}
            >
              Reset
            </Button>
          </StartContainer>
        )}

        {(configuration.selected ||
          (source.selected &&
            source.selectedProject &&
            target.selected &&
            target.selectedProject)) && (
          <RenderSecondaryFilters
            nameFilter={nameFilter}
            setNameFilter={setNameFilter}
            onNameSearchChange={onNameSearchChange}
            openFilter={openFilter}
            datatype={datatype}
            closeFilters={closeFilters}
            toggleFilter={toggleFilter}
            date={date}
          />
        )}
      </>
    </FiltersWrapper>
  );
};
