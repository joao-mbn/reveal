import { Flex } from '@cognite/cogs.js';
import { SearchConfigModal } from '@data-exploration/components';
import {
  FilterIdType,
  searchConfigData,
  SearchConfigDataType,
  SearchConfigResourceType,
  SEARCH_CONFIG_LOCAL_STORAGE_KEY,
} from '@data-exploration-lib/core';
import useLocalStorageState from 'use-local-storage-state';
import React from 'react';
import { CommonColumn } from './CommonColumn';

import { ResourceColumns } from './ResourceColumns';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
};

export const SearchConfig: React.FC<Props> = ({
  visible,
  onCancel,
  onSave,
}: Props) => {
  const [searchConfig, setSearchConfig] =
    useLocalStorageState<SearchConfigDataType>(
      SEARCH_CONFIG_LOCAL_STORAGE_KEY,
      {
        defaultValue: searchConfigData,
      }
    );
  const [configData, setConfigData] =
    React.useState<SearchConfigDataType>(searchConfig);

  const numOfResources = 5;

  const onChangeHandler = (
    enabled: boolean,
    currentResource: SearchConfigResourceType,
    filterId: FilterIdType
  ) => {
    setConfigData((prevState) => {
      return {
        ...prevState,
        [currentResource]: {
          ...prevState[currentResource],
          [filterId]: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore Property does not exist on type
            ...prevState[currentResource][filterId],
            enabled: enabled,
          },
        },
      };
    });
  };

  const onChangeCommonHandler = (enabled: boolean, index: number) => {
    return setConfigData((prevState) => {
      return (Object.keys(prevState) as Array<SearchConfigResourceType>).reduce(
        (array: SearchConfigDataType, currentResource) => {
          const filterId = Object.keys(prevState[currentResource])[
            index
          ] as FilterIdType;

          return {
            ...array,
            [currentResource]: {
              ...prevState[currentResource],
              [filterId]: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore Property does not exist on type
                ...prevState[currentResource][filterId],
                enabled: enabled,
              },
            },
          };
        },
        {} as SearchConfigDataType
      );
    });
  };
  return (
    <SearchConfigModal
      visible={visible}
      onCancel={() => {
        setConfigData(searchConfigData);
        onCancel();
      }}
      onOk={() => {
        setSearchConfig(configData);
        onSave();
      }}
    >
      <Flex style={{ overflowY: 'hidden' }}>
        <CommonColumn
          searchConfigData={configData}
          resourcesLength={numOfResources}
          onChange={onChangeCommonHandler}
        />
        <ResourceColumns
          searchConfigData={configData}
          onChange={onChangeHandler}
        />
      </Flex>
    </SearchConfigModal>
  );
};