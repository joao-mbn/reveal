import { Suspense } from 'react';

import { Page } from '../containers/page/Page';
import { FileResults } from '../containers/search/results/FileResults';
import { GenericResults } from '../containers/search/results/GenericResults';
import { ResultsSelection } from '../containers/search/results/ResultsSelection';
import { TimeseriesResults } from '../containers/search/results/TimeseriesResults';

export const SearchPage = () => {
  return (
    <Page>
      <Page.Header alignActions="left">
        <ResultsSelection />
      </Page.Header>
      <Page.Body>
        <Suspense fallback="Loading">
          <FileResults />
          <TimeseriesResults />
          <GenericResults />
        </Suspense>
      </Page.Body>
    </Page>
  );
};
