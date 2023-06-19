import { Suspense } from 'react';
import { useParams } from 'react-router-dom';

import styled from 'styled-components';

import { Page } from '../containers/page/Page';
import { FileResults } from '../containers/search/results/FileResults';
import { GenericResults } from '../containers/search/results/GenericResults';
import { TimeseriesResults } from '../containers/search/results/TimeseriesResults';
import { SearchCategories } from '../containers/search/SearchCategories';

export const SearchPage = () => {
  const { dataType } = useParams();

  const renderResults = () => {
    if (dataType === 'Files') {
      return <FileResults />;
    }

    if (dataType === 'Timeseries') {
      return <TimeseriesResults />;
    }

    if (dataType !== undefined) {
      return <GenericResults selectedDataType={dataType} />;
    }

    return (
      <>
        <GenericResults />
        <TimeseriesResults />
        <FileResults />
      </>
    );
  };

  return (
    <Page>
      <Page.Body>
        <Container>
          <Suspense fallback="Loading">
            <Content>{renderResults()}</Content>

            <SearchCategories />
          </Suspense>
        </Container>
      </Page.Body>
    </Page>
  );
};

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Container = styled.div`
  display: flex;
  max-width: 100%;
  width: 100%;
  gap: 32px;

  padding-top: 36px;
`;
