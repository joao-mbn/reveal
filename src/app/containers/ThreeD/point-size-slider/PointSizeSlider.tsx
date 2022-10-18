import {
  Button,
  Colors,
  Detail,
  Dropdown,
  Flex,
  Menu,
  Slider as CogsSlider,
} from '@cognite/cogs.js';
import { CognitePointCloudModel } from '@cognite/reveal';
import { ids } from 'cogs-variables';
import { useState } from 'react';

import styled from 'styled-components';

type SliderProps = {
  model: CognitePointCloudModel;
};

export default function PointSizeSlider({ model }: SliderProps) {
  const [sliderValue, setSliderValue] = useState(model.pointSize);

  if (!model) {
    return null;
  }

  return (
    <Dropdown
      appendTo={() => document.getElementsByClassName(ids.styleScope).item(0)!}
      content={
        <StyledMenu>
          <Flex direction="column" gap={12}>
            <Flex direction="column" gap={2}>
              <StyledHeader strong>Point size</StyledHeader>
              <StyledSlider
                min={0.01}
                max={5}
                step={0.1}
                onChange={v => {
                  model.pointSize = v;
                  setSliderValue(v);
                }}
                value={sliderValue}
              />
            </Flex>
          </Flex>
        </StyledMenu>
      }
    >
      <Button icon="DotLarge" />
    </Dropdown>
  );
}

const StyledMenu = styled(Menu)`
  min-width: 166px;
  padding: 12px;
`;

const StyledHeader = styled(Detail)`
  color: ${Colors['text-icon--muted']};
`;

const StyledSlider = styled(CogsSlider)`
  offset-anchor: right top;
  float: right;
  display: inline;
`;
