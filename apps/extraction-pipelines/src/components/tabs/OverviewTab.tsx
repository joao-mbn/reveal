import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import OverviewSidePanel from './OverviewSidePanel';

const IntegrationsWrapper = styled.div`
  border-left: 0.0625rem solid #e8e8e8; ;
`;
const TableWrapper = styled.div`
  margin: 1rem;
`;

interface OwnProps {}

type Props = OwnProps;

const OverviewTab: FunctionComponent<Props> = () => {
  return (
    <>
      <TableWrapper>Table placeholder</TableWrapper>
      <IntegrationsWrapper>
        <OverviewSidePanel />
      </IntegrationsWrapper>
    </>
  );
};

export default OverviewTab;
