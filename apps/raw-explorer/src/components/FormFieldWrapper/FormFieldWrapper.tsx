import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Body, Colors } from '@cognite/cogs.js';

type FormFieldWrapperProps = {
  children: ReactNode;
  isRequired?: boolean;
  title?: string;
};

const FormFieldWrapper = ({
  children,
  isRequired,
  title,
}: FormFieldWrapperProps): JSX.Element => {
  return (
    <StyledFormFieldWrapper>
      <StyledFormFieldTitle level={2} strong>
        {title}
        {isRequired && (
          <StyledFormFieldRequired>&nbsp;*</StyledFormFieldRequired>
        )}
      </StyledFormFieldTitle>
      {children}
    </StyledFormFieldWrapper>
  );
};

const StyledFormFieldWrapper = styled.div`
  :not(:last-child) {
    margin-bottom: 16px;
  }
`;

const StyledFormFieldTitle = styled(Body)`
  color: ${Colors['text-icon--strong']};
  display: flex;
  margin-bottom: 6px;
`;

const StyledFormFieldRequired = styled.div`
  color: ${Colors['text-icon--status-critical']};
`;

export default FormFieldWrapper;
