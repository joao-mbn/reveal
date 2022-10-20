import { Loader } from '@cognite/cogs.js';
import { Redirect } from 'react-router-dom';
import { useFetchPriceAreas } from 'queries/useFetchPriceAreas';
import { NotFoundPage } from 'pages/NotFound/NotFound';
import { PAGES } from 'types';

export const Portfolio = () => {
  const { data: priceAreas = [], isFetched, isFetching } = useFetchPriceAreas();

  if (isFetching) return <Loader infoTitle="Loading Price Areas" />;

  if (isFetched && priceAreas.length === 0)
    return <NotFoundPage message="No price areas found" />;

  return <Redirect to={`${PAGES.PORTFOLIO}/${priceAreas[0].externalId}`} />;
};
