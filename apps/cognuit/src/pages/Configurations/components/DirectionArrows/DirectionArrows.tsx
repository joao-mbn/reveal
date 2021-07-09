import { Colors, Icon } from '@cognite/cogs.js';

import { ArrowsContainer, Arrow } from './elements';

type Props = {
  psToOw: boolean;
};

const DirectionArrows = ({ psToOw = true }: Props) => (
  <ArrowsContainer>
    <Arrow
      isTop
      arrowColor={
        psToOw ? Colors.danger.hex() : Colors['greyscale-grey4'].hex()
      }
    >
      <Icon type="ArrowForward" />
    </Arrow>
    <Arrow
      isTop={false}
      arrowColor={
        !psToOw ? Colors.midblue.hex() : Colors['greyscale-grey4'].hex()
      }
    >
      <Icon type="ArrowBack" />
    </Arrow>
  </ArrowsContainer>
);

export default DirectionArrows;
