import React, { FunctionComponent, PropsWithoutRef } from 'react';
import styled from 'styled-components';
import { parseCron } from 'utils/cronUtils';
import InteractiveCopy from 'components/InteractiveCopy';
import { StyledTooltip } from 'styles/StyledToolTip';

export const InteractiveCopyWrapper = styled.span`
  display: flex;
  align-items: center;
  span {
    margin-left: 0.5rem;
  }
`;

interface OwnProps {
  id: string;
  schedule?: string;
}
export enum SupportedScheduleStrings {
  NOT_DEFINED = 'Not defined',
  ON_TRIGGER = 'On trigger',
  CONTINUOUS = 'Continuous',
  SCHEDULED = 'Scheduled',
}
type Props = OwnProps;

const Schedule: FunctionComponent<Props> = ({
  schedule,
  ...rest
}: PropsWithoutRef<Props>) => {
  if (!schedule) {
    return <span>{SupportedScheduleStrings.NOT_DEFINED}</span>;
  }
  if (
    schedule.toLowerCase() === SupportedScheduleStrings.ON_TRIGGER.toLowerCase()
  ) {
    return <span>{SupportedScheduleStrings.ON_TRIGGER}</span>;
  }
  if (
    schedule.toLowerCase() === SupportedScheduleStrings.CONTINUOUS.toLowerCase()
  ) {
    return <span>{SupportedScheduleStrings.CONTINUOUS}</span>;
  }
  let parsedExpression = schedule;
  try {
    parsedExpression = parseCron(schedule ?? '');
  } catch (e) {
    const errorMessage = `Schedule: "${schedule}" - ${e}`;
    return (
      <StyledTooltip content={errorMessage}>
        <i>Not valid</i>
      </StyledTooltip>
    );
  }
  return (
    <StyledTooltip content={schedule}>
      <InteractiveCopyWrapper {...rest}>
        {parsedExpression}{' '}
        <InteractiveCopy text={schedule} copyType="cronExpression" />
      </InteractiveCopyWrapper>
    </StyledTooltip>
  );
};

export default Schedule;
