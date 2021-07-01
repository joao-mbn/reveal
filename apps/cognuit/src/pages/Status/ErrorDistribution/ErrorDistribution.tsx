import { useState, useContext, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { APIContextValue } from 'contexts/ApiContext';
import { CustomError } from 'services/CustomError';
import { ErrorDistributionObject } from 'typings/interfaces';
import { ThirdPartySystems } from 'types/globalTypes';

import ApiContext from '../../../contexts/ApiContext';
import EmptyTableMessage from '../../../components/Molecules/EmptyTableMessage/EmptyTableMessage';

import { ChartContainer, Container } from './elements';

type Props = {
  afterTimestamp: number;
};

const ErrorDistribution = ({ afterTimestamp }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [psData, setPsData] = useState<ErrorDistributionObject[]>([]);
  const [owData, setOwData] = useState<ErrorDistributionObject[]>([]);
  const { api } = useContext<APIContextValue>(ApiContext);

  const psColors = ['#2B3A88', '#4A67FB', '#DBE1FE', '#A4B2FC'];
  const owColors = ['#FF6918', '#FF8746', '#FFE1D1', '#FFB38B'];

  useEffect(() => {
    setIsLoading(true);
    api!.sources
      .getErrorDistribution('Studio', afterTimestamp)
      .then((response) => {
        if (response.length === 0) {
          setPsData(response as ErrorDistributionObject[]);
        }
        setIsLoading(false);
      })
      .catch((err: CustomError) => {
        // eslint-disable-next-line no-console
        console.trace('Unhandled error response in error', err);
      });
    api!.sources
      .getErrorDistribution('Openworks', afterTimestamp)
      .then((response) => {
        if (response.length === 0) {
          setOwData(response as ErrorDistributionObject[]);
        }
        setIsLoading(false);
      })
      .catch((err: CustomError) => {
        // eslint-disable-next-line no-console
        console.trace('Unhandled error response in error', err);
      });
  }, [afterTimestamp, api]);

  const renderPie = (pieData: ErrorDistributionObject[], source: string) => {
    const data = {
      labels: pieData.map((item) => `${item.name}: ${item.total_errors}`),
      datasets: [
        {
          data: pieData.map((item) => item.total_errors),
          backgroundColor: source === 'Studio' ? psColors : owColors,
          hoverBackgroundColor: source === 'Studio' ? psColors : owColors,
          borderWidth: 0,
        },
      ],
    };

    return (
      <Pie
        data={data}
        options={{
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
            },
          },
        }}
        height={200}
      />
    );
  };

  return (
    <Container>
      {isLoading ? (
        <EmptyTableMessage isLoading text="Loading" />
      ) : (
        <>
          {psData.length > 0 && (
            <ChartContainer>
              <h3>
                {ThirdPartySystems.PS} to {ThirdPartySystems.OW}
              </h3>
              {renderPie(psData, 'Studio')}
            </ChartContainer>
          )}
          {owData.length > 0 && (
            <ChartContainer>
              <h3>
                {ThirdPartySystems.OW} to {ThirdPartySystems.PS}{' '}
              </h3>
              {renderPie(owData, 'Openworks')}
            </ChartContainer>
          )}
        </>
      )}
    </Container>
  );
};

export default ErrorDistribution;
