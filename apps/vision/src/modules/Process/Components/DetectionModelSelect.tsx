/* eslint-disable array-callback-return */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Props as SelectProps } from 'react-select';

import styled from 'styled-components';

import { Select, Button } from '@cognite/cogs.js';

import { VisionDetectionModelType } from '../../../api/vision/detectionModels/types';
import {
  ColorsOCR,
  ColorsObjectDetection,
  ColorsTagDetection,
  ColorsPersonDetection,
} from '../../../constants/Colors';
import { RootState } from '../../../store/rootReducer';
import * as gaugeReaderDetails from '../Containers/ModelDetails/gaugeReaderDetails';
import * as objectDetectionModelDetails from '../Containers/ModelDetails/ObjectDetectionModelDetails';
import * as ocrModelDetails from '../Containers/ModelDetails/OcrModelDetails';
import * as peopleDetectionModelDetails from '../Containers/ModelDetails/PeopleDetectionModelDetails';
import * as tagDetectionModelDetails from '../Containers/ModelDetails/TagDetectionModelDetails';
import { BUILT_IN_MODEL_COUNT } from '../store/slice';

type SelectOption = {
  label: any;
  isSelectable: boolean;
  value: VisionDetectionModelType;
  backgroundColor: string;
};

// fixme cogs select must accept OptionType generic
type Props = Omit<
  SelectProps<{ label: string; value: VisionDetectionModelType }>,
  'theme'
> & {
  onChange: (value: Array<SelectOption['value']>) => unknown;
  value: Array<SelectOption['value']>;
};

export function DetectionModelSelect({
  value,
  onChange,
  handleOpenSettingsWindow,
  ...props
}: Props) {
  // Remove the selected model(s) that are disabled.
  // For example; it could be that a custom model is selected but after page
  // refresh, custom models are disabled. This filter will make sure that the
  // disabled model type is unselected.
  const enabledSelectedModels = value;
  const [selectedOptionsCount, setSelectedOptionsCount] = useState<number>(
    enabledSelectedModels.length
  );
  const maxFill = 90;
  const colorStyles = {
    base: (styles: any) => ({ ...styles }),
    control: (styles: any) => ({ ...styles, backgroundColor: 'white' }),
    multiValue: (styles: any, { data }: any) => {
      return {
        ...styles,
        backgroundColor: data.backgroundColor,
        maxWidth: `${(maxFill / selectedOptionsCount).toFixed(2)}%`,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      };
    },
  };

  const availableDetectionModels = useSelector(
    (state: RootState) => state.processSlice.availableDetectionModels
  );
  // Same as before, but here we make sure that the disabled model type(s) are
  // not shown as option(s) to the user.
  const enabledDetectionModels = availableDetectionModels;
  const detectionModelOptions: SelectOption[] = enabledDetectionModels.map(
    // eslint-disable-next-line consistent-return
    (item) => {
      switch (item.type) {
        case VisionDetectionModelType.OCR:
          return {
            label: ocrModelDetails.badge(item.modelName),
            value: VisionDetectionModelType.OCR,
            backgroundColor: ColorsOCR.backgroundColor,
            isSelectable: true,
          };

        case VisionDetectionModelType.TagDetection:
          return {
            label: tagDetectionModelDetails.badge(item.modelName),
            value: VisionDetectionModelType.TagDetection,
            backgroundColor: ColorsTagDetection.backgroundColor,
            isSelectable: true,
          };

        case VisionDetectionModelType.ObjectDetection:
          return {
            label: objectDetectionModelDetails.badge(item.modelName),
            value: VisionDetectionModelType.ObjectDetection,
            backgroundColor: ColorsObjectDetection.backgroundColor,
            isSelectable: true,
          };
        case VisionDetectionModelType.PeopleDetection:
          return {
            label: peopleDetectionModelDetails.badge(item.modelName),
            value: VisionDetectionModelType.PeopleDetection,
            backgroundColor: ColorsPersonDetection.backgroundColor,
            isSelectable: true,
          };
        case VisionDetectionModelType.GaugeReader:
          return {
            label: gaugeReaderDetails.badge(item.modelName),
            value: VisionDetectionModelType.GaugeReader,
            backgroundColor: ColorsObjectDetection.backgroundColor,
            isSelectable: true,
            divider: availableDetectionModels.length < BUILT_IN_MODEL_COUNT,
          };
      }
    }
  );

  const openSettingsOption = {
    label: (
      <StyledButton
        icon="Settings"
        onClick={handleOpenSettingsWindow}
        type="ghost"
      >
        Edit model settings
      </StyledButton>
    ),
    value: -1, // since isSelected is false, value is not used anyways
    backgroundColor: '',
    isSelectable: false,
  };

  const options = detectionModelOptions;
  options.push(openSettingsOption);

  const toOption = (modelType: VisionDetectionModelType): SelectOption => {
    const option = detectionModelOptions.find(
      (item) => item.value === modelType
    );
    if (!option) {
      throw new Error(`${modelType} is an unknown ML detection model`);
    }
    return option;
  };

  const fromOption = (item: SelectOption): VisionDetectionModelType => {
    return item.value;
  };

  return (
    <SelectContainer>
      <Select
        isMulti
        value={enabledSelectedModels
          .filter(
            (modelType) =>
              !!detectionModelOptions.find(
                (item) => item.isSelectable && item.value === modelType
              )
          )
          .map(toOption)}
        onChange={(selectedOptions?: Array<SelectOption>) => {
          // Only consider the selectable options
          const filteredOptions = selectedOptions?.filter(
            (option) => option.isSelectable
          );
          setSelectedOptionsCount(filteredOptions?.length || 1);
          onChange(filteredOptions?.map(fromOption) || []);
        }}
        options={options}
        {...props}
        styles={colorStyles}
      />
    </SelectContainer>
  );
}

const StyledButton = styled(Button)`
  width: 100%;
  justify-content: start;
  &:hover {
    background: none !important;
  }
`;

const SelectContainer = styled.div`
  height: 36px;
`;
