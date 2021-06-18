import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Icon, Title } from '@cognite/cogs.js';

interface InfoBoxProps {
  isTagInfoBox: boolean;
}

const tagName = 'ShowTagHelpBox';
const timeSeries = 'ShowTimeSeriesHelpBox';

interface InfoBoxData {
  title: string;
  body: any;
}

const InfoBox = ({ isTagInfoBox }: InfoBoxProps) => {
  const [displayInfo, setDisplayInfo] = useState(true);
  const infoType = isTagInfoBox ? tagName : timeSeries;

  const timeSeriesInfo = {
    title: 'Timeseries ID',
    body: (
      <>
        You can search for Timeseries name (ID) e.g. VAL_21_ZT_1018_04:Z.X.Value
        or Timeseries description, e.g. Utløpstrykk pigsluse eksportlinje B.
        {'\n\n'} You can scope the search by the asset hierarchy (e.g. IAA or
        ULA){'\n\n'}
        Read more on
        <a href="cog.link/charts-doc"> cog.link/charts-doc.</a>
      </>
    ),
  } as InfoBoxData;

  const tagInfo = {
    title: 'Search Tag numbers',
    body: (
      <>
        Search for Tag number (asset) e.g. 21PT1019 or description (e.g. LAUN TO
        OIL TRANS LN B){'\n\n'} You can filter the search by suffix (e.g. .PV or
        .PRIM) and choose priority of results (e.g. .PV on top){'\n\n'}
        Read more on
        <a href="cog.link/charts-doc"> cog.link/charts-doc.</a>
      </>
    ),
  } as InfoBoxData;

  const data = isTagInfoBox ? tagInfo : timeSeriesInfo;

  const handleOnClick = () => {
    localStorage.setItem(infoType, JSON.stringify({ display: false }));
    setDisplayInfo(false);
  };

  useEffect(() => {
    const toDisplay = localStorage.getItem(infoType);
    if (toDisplay) {
      setDisplayInfo(JSON.parse(toDisplay).display);
    } else {
      localStorage.setItem(infoType, JSON.stringify({ display: true }));
    }
  }, []);

  return (
    <>
      {displayInfo && (
        <InfoBoxWrapper>
          <Icon type="Info" dataset-id="InfoFilled" />
          <InfoWrapper>
            <Title level={5} color="#333333">
              {data.title}
            </Title>
            <TextContainer>{data.body}</TextContainer>
          </InfoWrapper>
          <Button
            icon="Close"
            size="small"
            type="ghost"
            style={{ width: '1.65em', height: '1.65em' }}
            onClick={handleOnClick}
          />
        </InfoBoxWrapper>
      )}
    </>
  );
};

const InfoBoxWrapper = styled.div`
  width: initial;
  display: flex;
  flex-direction: row;
  margin: 10px 10px 10px 0;
  padding: 1em;
  min-height: 200px;
  background-color: #f6f9ff;
  border: 1px solid var(--cogs-midblue-5);
  border-radius: 0.5em;
`;

const TextContainer = styled.div`
  margin-top: 1em;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  width: fit-content;
  white-space: pre-line;
`;

const InfoWrapper = styled.div`
  width: max-content;
  flex: 1;
  padding: 0 1em;
`;

export default InfoBox;
