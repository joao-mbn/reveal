import { Skeleton } from 'antd';

import { Icon } from '@cognite/cogs.js';

import { AssetItem } from './elements/AssetItem';
import { Description } from './elements/Description';
import { InfoContainer } from './elements/InfoContainer';
import { ResourceNameWrapper } from './elements/ResourceNameWrapper';
import { Right } from './elements/Right';
import { Row } from './elements/Row';
import { TSList } from './elements/TSList';
import LoadingTimeSeriesResultItem from './LoadingTimeSeriesResultItem';

export default function LoadingLinkedAsset() {
  return (
    <AssetItem>
      <Row>
        <InfoContainer>
          <ResourceNameWrapper>
            <Icon type="Assets" size={14} css={{ marginRight: 5 }} />
            <Skeleton.Button active block />
          </ResourceNameWrapper>
          <Description />
        </InfoContainer>
        <Right />
      </Row>
      <Row>
        <TSList>
          {Array(3)
            .fill(1)
            .map((a) => (
              <LoadingTimeSeriesResultItem key={a + 1} />
            ))}
        </TSList>
      </Row>
    </AssetItem>
  );
}