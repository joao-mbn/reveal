import React, { useState } from 'react';
import { Body, Select } from '@cognite/cogs.js';
import { EditPanelProps } from 'src/modules/Common/Components/BulkEdit/bulkEditOptions';
import styled from 'styled-components';
import { AssetSelect } from '@cognite/data-exploration';
import { BulkEditUnsavedState } from 'src/modules/Common/store/common/types';
import { Alert } from 'antd';
import { unsavedAssetsHasOverlaps } from 'src/modules/Common/Components/BulkEdit/Asset/unsavedAssetsHasOverlaps';

enum TaskOptions {
  add = 'add',
  remove = 'remove',
}
type TaskOptionsType = { value: TaskOptions; label: string };
const taskSelectorOptions: TaskOptionsType[] = [
  {
    value: TaskOptions.add,
    label: 'Add asset(s)',
  },
  {
    value: TaskOptions.remove,
    label: 'Remove asset(s)',
  },
];

const AssetEditPanel = ({
  task,
  bulkEditUnsaved,
  setBulkEditUnsaved,
}: {
  task: TaskOptionsType;
  bulkEditUnsaved: BulkEditUnsavedState;
  setBulkEditUnsaved: (value: BulkEditUnsavedState) => void;
}): JSX.Element => {
  switch (task.value) {
    case TaskOptions.add:
      return (
        <InputContainer>
          <Body level={2}>Add asset</Body>
          <AssetSelectContainer>
            <AssetSelect
              isMulti
              selectedAssetIds={bulkEditUnsaved.assetIds?.addedAssetIds}
              onAssetSelected={(selectedItems) => {
                setBulkEditUnsaved({
                  ...bulkEditUnsaved,
                  assetIds: {
                    ...bulkEditUnsaved.assetIds,
                    addedAssetIds: selectedItems,
                  },
                });
              }}
            />
          </AssetSelectContainer>
          {unsavedAssetsHasOverlaps({ bulkEditUnsaved }) && (
            <Alert
              message="Same asset(s) selected for both add and remove."
              banner
              style={{ height: '20px', fontSize: '10px' }}
            />
          )}
        </InputContainer>
      );
    case TaskOptions.remove:
    default:
      return (
        <InputContainer>
          <Body level={2}>Find asset</Body>
          <AssetSelectContainer>
            <AssetSelect
              isMulti
              selectedAssetIds={bulkEditUnsaved.assetIds?.removedAssetIds}
              onAssetSelected={(selectedItems) => {
                setBulkEditUnsaved({
                  ...bulkEditUnsaved,
                  assetIds: {
                    ...bulkEditUnsaved.assetIds,
                    removedAssetIds: selectedItems,
                  },
                });
              }}
            />
          </AssetSelectContainer>
        </InputContainer>
      );
  }
};

export const AssetPanel = ({
  bulkEditUnsaved,
  setBulkEditUnsaved,
}: EditPanelProps) => {
  const [task, setTask] = useState<TaskOptionsType>(taskSelectorOptions[0]);

  return (
    <PanelContainer>
      <TastContainer>
        <Body level={2}>Task</Body>
        <SelectContainer>
          <Select
            value={task}
            onChange={setTask}
            options={taskSelectorOptions}
            closeMenuOnSelect
          />
        </SelectContainer>
      </TastContainer>
      <AssetEditPanel
        task={task}
        bulkEditUnsaved={bulkEditUnsaved}
        setBulkEditUnsaved={setBulkEditUnsaved}
      />
    </PanelContainer>
  );
};

const PanelContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: left;
  align-items: end;
  grid-gap: 8px;
`;
const TastContainer = styled.div`
  display: grid;
  grid-gap: 6px;
  height: 62px;
`;
const SelectContainer = styled.div`
  width: 218px;
`;
const InputContainer = styled.div`
  display: grid;
  grid-gap: 6px;
  height: 62px;
`;
const AssetSelectContainer = styled.div`
  width: 400px;
`;
