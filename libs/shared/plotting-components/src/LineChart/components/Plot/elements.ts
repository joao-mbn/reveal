import styled from 'styled-components';

import { LABEL_COLOR, TICK_COLOR } from '../../constants';

interface PlotWrapperProps {
  showticks: boolean;
  cursor: string;
}

export const PlotWrapper = styled.div`
  > * .main-svg {
    background: transparent !important;
  }

  & > div {
    height: 100%;
    width: 100%;
    display: inline-block;
  }

  > * .modebar-container {
    display: none;
  }

  > * .xtick,
  .ytick {
    text {
      fill: ${LABEL_COLOR} !important;
      font-family: Inter !important;
      font-weight: 400 !important;
      font-size: 11px !important;
      line-height: 16px !important;
      font-feature-settings: 'ss04' on !important;
    }
  }

  > * .xtick:first-child {
    display: none;
  }

  > * .crisp {
    stroke: ${TICK_COLOR} !important;
    ${(props: PlotWrapperProps) =>
      !props.showticks &&
      `
      display: none;
    `}
  }

  > * .draglayer {
    cursor: auto !important;
  }

  > * .nsewdrag {
    cursor: ${(props: PlotWrapperProps) => props.cursor} !important;
  }

  > * .xtitle,
  .ytitle {
    fill: ${LABEL_COLOR} !important;
    font-family: Inter !important;
    font-weight: 500 !important;
    font-size: 12px !important;
    line-height: 16px !important;
    font-feature-settings: 'ss04' on !important;
  }
`;
