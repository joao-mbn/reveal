import styled from 'styled-components';
import {
  Button,
  Checkbox as DefaultCheckbox,
  Body,
  Icon,
  Title as DefaultTitle,
} from '@cognite/cogs.js';

export const CloseIcon = styled(Icon)`
  cursor: pointer;
`;

export const Title = styled(DefaultTitle).attrs({ level: 2 })``;

export const ConnectionLinesWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;

  #connectorLinesSvg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    pointer-events: none;

    .connectorLine {
      stroke-width: 2px;
      stroke: var(--cogs-midblue);
      stroke-linecap: round;
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: dash 2s 0.5s linear forwards;
    }
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
`;

export const ContentContainer = styled.div`
  background-color: var(--cogs-white);
  box-shadow: 0 8px 48px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
`;

export const ContentCard = styled(ContentContainer)`
  border-radius: 16px;
  padding: 24px 32px;
`;

export const ConfigurationContainer = styled(ContentCard)`
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-weight: 500;

  & > header {
    border-bottom: 1px solid var(--cogs-greyscale-grey5);
    padding: 24px 48px;
  }
  & > main {
    padding: 16px 48px;
    flex-grow: 1;

    &.initial-main {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 0;
    }
  }
  & > footer {
    padding: 16px 48px 48px 48px;
    display: flex;
    justify-content: center;
  }

  .ant-select {
    font-weight: 400;
  }
`;

export const Label = styled(Body).attrs({ level: 2 })`
  margin-top: 1rem;
`;
export const ContainerHeading = styled.div`
  font-weight: 600;
  font-size: 1rem;
`;

export const EditButton = styled(Button)`
  float: right;
  margin-top: -2.6rem;
`;

export const InitialState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  & > p {
    font-weight: bold;
    color: var(--cogs-greyscale-grey5);
  }
`;

export const BadgesContainer = styled.div`
  margin-top: 0.75rem;
`;

export const BorderedBottomContainer = styled.div<{ leftPad?: boolean }>`
  border-bottom: 1px solid var(--cogs-greyscale-grey4);
  padding-bottom: 1rem;
  padding-left: ${(props) => (props.leftPad ? '1rem' : '0')};
  margin-bottom: 1rem;
`;

BorderedBottomContainer.defaultProps = {
  leftPad: true,
};

export const CenteredLoader = styled.div`
  text-align: center;
`;

export const ErrorModal = styled.div`
  > div {
    text-align: center;
    margin-top: 2rem;
  }

  p {
    margin-top: 1em;
  }

  a {
    text-decoration: underline;
  }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

export const SaveButton = styled(Button)`
  height: 36px;

  &.enabled {
    animation: pulsate 5s 0s ease 1 forwards;
  }

  @keyframes pulsate {
    0% {
      transform: scale(1, 1);
    }
    10% {
      transform: scale(1.07, 1.07);
    }
    20% {
      transform: scale(1, 1);
    }
    30% {
      transform: scale(1.07, 1.07);
    }
    40% {
      transform: scale(1, 1);
    }
    50% {
      transform: scale(1.07, 1.07);
    }
    60% {
      transform: scale(1, 1);
    }
    70% {
      transform: scale(1.07, 1.07);
    }
    80% {
      transform: scale(1, 1);
    }
    90% {
      transform: scale(1.07, 1.07);
    }
    100% {
      transform: scale(1, 1);
    }
  }
`;

export const ThreeColsLayout = styled.div`
  display: flex;
  align-items: flex-start;
  & > div {
    width: calc(100% / 3);
    min-height: 50vh;
  }
`;

export const ConfigurationsMainContainer = styled.div`
  display: block;
`;

export const Checkbox = styled(DefaultCheckbox)`
  margin: 8px !important;
`;

export const ConnectorList = styled.ul<{
  connectorPosition?: string;
  connected?: boolean;
}>`
  list-style: none;
  margin: 0;
  padding: 0;
  & > li {
    background-color: var(--cogs-greyscale-grey2);
    border-radius: 16px;
    margin-bottom: 16px;
    padding: 4px 16px;
    position: relative;

    .connectorPoint,
    .connectorTarget {
      position: absolute;
      right: ${(props) =>
        props.connectorPosition === 'right' ? '-32px' : 'calc(100% + 16px)'};
      top: calc(50% - 10px);
      background-color: ${(props) =>
        props.connected
          ? 'var(--cogs-midblue)'
          : 'var(--cogs-greyscale-grey2)'};
      border-radius: 50%;
      width: 10px;
      height: 10px;
      border: 4px solid var(--cogs-greyscale-grey2);
      box-sizing: content-box;
      transition: background-color 0.3s ease;
    }
  }
`;
