import React, { useState, useEffect } from 'react';
import { Select, SpacedRow } from 'components';
import { Button, Colors, Icon, Tooltip } from '@cognite/cogs.js';
import styled, { css } from 'styled-components';
import { useAssetMetadataValues } from 'hooks/MetadataAggregateHooks';
import { reactSelectCogsStylingProps } from 'components/SearchNew/Filters/elements';
import { DISABLE_VALUE_TOOLTIP } from './constants';

const LOCKSVG = (
  <svg
    style={{ marginRight: 8 }}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.75 4.5H8.125V3.35714C8.125 1.78 6.725 0.5 5 0.5C3.275 0.5 1.875 1.78 1.875 3.35714V4.5H1.25C0.5625 4.5 0 5.01429 0 5.64286V11.3571C0 11.9857 0.5625 12.5 1.25 12.5H8.75C9.4375 12.5 10 11.9857 10 11.3571V5.64286C10 5.01429 9.4375 4.5 8.75 4.5ZM5 9.64286C4.3125 9.64286 3.75 9.12857 3.75 8.5C3.75 7.87143 4.3125 7.35714 5 7.35714C5.6875 7.35714 6.25 7.87143 6.25 8.5C6.25 9.12857 5.6875 9.64286 5 9.64286ZM6.9375 4.5H3.0625V3.35714C3.0625 2.38 3.93125 1.58571 5 1.58571C6.06875 1.58571 6.9375 2.38 6.9375 3.35714V4.5Z"
      fill="#404040"
    />
  </svg>
);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px;
`;

type TagProps = { isLocked: boolean };
const Tag = styled.div<TagProps>(
  props => css`
    display: inline-flex;
    align-items: center;
    background: ${Colors['midblue-6'].hex()};
    padding: 8px 16px;
    color: ${Colors['midblue-2'].hex()};
    font-weight: 600;
    border-radius: 30px;
    cursor: ${props.isLocked ? 'unset' : 'pointer'};
    margin-right: 8px;
    margin-bottom: 12px;
    transition: 0.3s all;
    word-break: break-all;
    white-space: nowrap;
    max-width: 100%;

    .cogs-icon {
      opacity: 0.1;
      flex-shrink: 0;
    }

    .delete {
      margin-right: 6px;
      margin-left: 12px;
      display: flex;
      opacity: 0.5;
      transition: 0.3s all;
      color: ${Colors.danger.hex()};
      height: 16px;
      width: 16px;
    }

    span {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    ${!props.isLocked &&
    css`
      .delete:hover {
        opacity: 1;
      }
    `}
  `
);

const FilterItemWrapper = styled.div`
  .key {
    margin-bottom: 16px;
  }
  .key,
  .value {
    display: flex;
    flex: 1;
    > div {
      flex: 1;
    }
  }
  .buttons {
    display: flex;
    align-items: stretch;
    > * {
      margin-left: 4px;
    }
  }
`;

const ButtonGroupWrapper = styled(SpacedRow)`
  margin: 0 0 8px auto;
  padding-top: 8px;
  gap: 8px !important;
`;

const FilterItem = ({
  metadata,
  categories,
  lockedFilters,
  setFilter,
  onCancel,
  initialKey,
  initialValue,
  useAggregates = false,
}: {
  metadata: {
    [key: string]: string[];
  };
  lockedFilters: string[];
  categories: {
    [key: string]: {
      value: string;
      count?: number;
    }[];
  };
  setFilter: (selectedKey: string, selectedValue: string) => void;
  onCancel?: (shouldDelete: boolean) => void;
  initialKey?: string;
  initialValue?: string;
  useAggregates?: boolean;
}) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  useEffect(() => {
    if (initialKey) {
      setSelectedKey(initialKey);
    }
  }, [initialKey]);
  useEffect(() => {
    if (initialValue) {
      setSelectedValue(initialValue);
    }
  }, [initialValue]);

  const {
    data: metadataValues = [],
    isFetching,
    isFetched,
  } = useAssetMetadataValues(selectedKey, {
    enabled: useAggregates && !!selectedKey,
  });

  const allowEdit =
    selectedKey &&
    selectedValue &&
    (selectedKey !== initialKey || selectedValue !== initialValue);

  const options = Object.keys(categories)
    .sort((a, b) => {
      if (a === 'undefined') {
        return -1;
      }
      if (b === 'undefined') {
        return 1;
      }
      return a.localeCompare(b);
    })
    .map(category => ({
      label: category,
      options: categories[category].map(el => ({
        label: `${el.value} ${el.count ? `(${el.count})` : ''}`,
        value: el.value,
        disabled: lockedFilters.includes(el.value),
      })),
    }));

  const getMetadataValues = (key: string) =>
    useAggregates && isFetched
      ? metadataValues.map((el: any) => ({
          label: `${el.value} (${el.count})`,
          value: el.value,
        }))
      : metadata[key]?.map(el => ({ label: el, value: el }));

  return (
    <>
      <FilterItemWrapper>
        <div className="key">
          <Select
            creatable
            {...reactSelectCogsStylingProps}
            styles={{
              menu: style => ({
                ...style,
                width: '100%',
                maxWidth: '320px',
              }),
              ...reactSelectCogsStylingProps.styles,
            }}
            placeholder="Key"
            disabled={!!initialKey}
            value={
              selectedKey
                ? { label: selectedKey, value: selectedKey }
                : undefined
            }
            onChange={item => {
              setSelectedKey(item ? (item as { value: string }).value : null);
              setSelectedValue(null);
            }}
            options={options}
            className="key-select"
          />
        </div>
        <div>
          <Tooltip content={DISABLE_VALUE_TOOLTIP} disabled={!!selectedKey}>
            <Select
              creatable
              {...reactSelectCogsStylingProps}
              styles={{
                menu: style => ({
                  ...style,
                  width: '100%',
                  maxWidth: '320px',
                }),
                ...reactSelectCogsStylingProps.styles,
              }}
              placeholder="Value"
              isDisabled={!selectedKey && selectedValue === null}
              value={
                selectedValue
                  ? { label: selectedValue, value: selectedValue }
                  : undefined
              }
              onChange={item => {
                setSelectedValue(item?.value || null);
              }}
              options={selectedKey ? getMetadataValues(selectedKey) : []}
              isLoading={isFetching}
              className="value-select"
            />
          </Tooltip>
        </div>
      </FilterItemWrapper>
      {allowEdit && (
        <ButtonGroupWrapper>
          <Button
            onClick={() => {
              if (onCancel) {
                onCancel(false);
              }
              setSelectedKey(null);
              setSelectedValue(null);
            }}
          >
            Clear
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setFilter(selectedKey!, selectedValue!);
              setSelectedKey(null);
              setSelectedValue(null);
            }}
          >
            Apply
          </Button>
        </ButtonGroupWrapper>
      )}
    </>
  );
};

export const FilterTag = ({
  isLocked = false,
  onClick = () => {},
  onDeleteClicked = () => {},
  filter,
  value,
}: {
  isLocked?: boolean;
  onClick?: () => void;
  onDeleteClicked?: () => void;
  filter: string;
  value: string;
}) => (
  <Tag isLocked={isLocked} onClick={onClick}>
    {isLocked && LOCKSVG}
    <Tooltip interactive content={`${filter}: ${value}`}>
      <span>
        {filter}: {value}
      </span>
    </Tooltip>
    {!isLocked && onDeleteClicked && (
      <Icon
        type="Close"
        className="delete"
        onClick={ev => {
          ev.stopPropagation();
          onDeleteClicked();
        }}
      />
    )}
  </Tag>
);

export type FilterFormProps = {
  metadata: {
    [key: string]: string[];
  };
  keys?: {
    value: string;
    count: number;
  }[];
  filters?: {
    key: string;
    value: string;
  }[];
  metadataCategory?: {
    [key: string]: string;
  };
  lockedFilters?: string[];
  setFilters: (filter: { key: string; value: string }[]) => void;
  useAggregates?: boolean;
};

// NOTE: This component is super confusing and complicated. Subject to refactoring.
export const FilterFormV2 = ({
  metadata,
  keys,
  metadataCategory = {},
  filters = [],
  lockedFilters = [],
  setFilters = () => {},
  useAggregates = false,
}: FilterFormProps) => {
  const [editingKeys, setEditingKeys] = useState<string[]>([]);

  const allKeys = new Set<{
    value: string;
    count?: number;
  }>();

  if (keys && keys.length > 0) {
    keys.forEach(el => allKeys.add(el));
  } else {
    Object.keys(metadataCategory).forEach(el => allKeys.add({ value: el }));
    Object.keys(metadata).forEach(el => allKeys.add({ value: el }));
  }

  const categories = [...allKeys].reduce(
    (prev, el) => {
      if (!prev[metadataCategory[el.value]]) {
        prev[metadataCategory[el.value] || 'undefined'] = [];
      }
      prev[metadataCategory[el.value] || 'undefined'].push(el);
      return prev;
    },
    {} as {
      [key: string]: {
        value: string;
        count?: number;
      }[];
    }
  );

  const handleSetMetadataFilter = (newKey: string, newValue: string) => {
    const hasFilterApplied = filters.some(
      ({ key, value }) => key === newKey && value === newValue
    );

    if (hasFilterApplied) {
      return;
    }

    setFilters([...filters, { key: newKey, value: newValue }]);
  };

  const handleRemoveMetadataFilter = (key: string) => {
    const newFilter = filters?.filter(filter => filter.key !== key);
    setFilters(newFilter);
  };

  return (
    <Wrapper>
      {filters
        .filter(({ key }) => editingKeys.includes(key))
        .map(({ key, value }) => (
          <FilterItem
            key={key}
            categories={categories}
            lockedFilters={lockedFilters}
            metadata={metadata}
            initialKey={key}
            initialValue={value}
            setFilter={(newKey, newValue) => {
              handleSetMetadataFilter(newKey, newValue);
              setEditingKeys(editingKeys.filter(el => el !== key));
            }}
            onCancel={shouldDelete => {
              if (shouldDelete) {
                handleRemoveMetadataFilter(key);
              }
              setEditingKeys(editingKeys.filter(el => el !== key));
            }}
          />
        ))}
      <FilterItem
        key="add"
        metadata={metadata}
        categories={categories}
        lockedFilters={lockedFilters}
        setFilter={(newKey, newValue) => {
          handleSetMetadataFilter(newKey, newValue);
        }}
        useAggregates={useAggregates}
      />
      <Tags>
        {filters.map(({ key, value }) => {
          const isLocked = lockedFilters.some(filter => filter === key);
          return (
            <FilterTag
              key={key}
              isLocked={isLocked}
              filter={key}
              value={value}
              onDeleteClicked={() => {
                handleRemoveMetadataFilter(key);
              }}
            />
          );
        })}
      </Tags>
    </Wrapper>
  );
};
