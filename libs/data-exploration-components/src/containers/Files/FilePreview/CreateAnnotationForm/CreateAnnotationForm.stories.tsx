import {
  ExtendedAnnotation,
  getExtendedAnnotationFixture,
} from '@data-exploration-lib/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import { CreateAnnotationForm } from './CreateAnnotationForm';

export default {
  title: 'Files/Annotations/CreateAnnotationForm',
  component: CreateAnnotationForm,
  decorators: [(storyFn: any) => <Container>{storyFn()}</Container>],
};

export const Default = () => {
  const [pendingAnnotation, setPendingAnnotation] =
    useState<ExtendedAnnotation>(getExtendedAnnotationFixture());
  return (
    <CreateAnnotationForm
      annotation={pendingAnnotation}
      updateAnnotation={setPendingAnnotation}
      onSave={() => {}}
      onDelete={() => {}}
      onLinkResource={() => {}}
    />
  );
};

const Container = styled.div`
  padding: 20px;
  width: 400px;
  background: grey;
  display: flex;
  justify-content: center;
  align-items: center;

  && > * {
    background: #fff;
  }
`;
