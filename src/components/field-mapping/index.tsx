import { Dispatch, SetStateAction } from 'react';

import { Button, Colors, Flex, Icon, Overline } from '@cognite/cogs.js';
import { Select } from 'antd';
import styled from 'styled-components';

import { useTranslation } from 'common';
import { QUICK_MATCH_CONFIGURE_MODEL_PAGE_WIDTH } from 'common/constants';
import ResourceTypei18n from 'components/resource-type-i18n';
import {
  ModelMapping,
  SourceType,
  TargetType,
} from 'context/QuickMatchContext';
import { useAggregateProperties } from 'hooks/aggregates';

const { Option } = Select;

type Props = {
  sourceType: SourceType;
  targetType: TargetType;
  modelFieldMapping: ModelMapping;
  setModelFieldMapping: Dispatch<SetStateAction<ModelMapping>>;
};
export default function FieldMapping({
  sourceType,
  targetType,
  modelFieldMapping,
  setModelFieldMapping,
}: Props) {
  const { t } = useTranslation();

  const { data: sourceProps, isInitialLoading: sourcesLoading } =
    useAggregateProperties(sourceType);
  const { data: targetProps, isInitialLoading: targetsLoading } =
    useAggregateProperties(targetType);

  return (
    <Container>
      <Flex gap={8}>
        <ResourceTypeTitle style={{ flex: 1 }}>
          <ResourceTypei18n t={sourceType} />
        </ResourceTypeTitle>
        <ResourceTypeTitle style={{ flex: 1 }}>
          <ResourceTypei18n t={targetType} />
        </ResourceTypeTitle>
      </Flex>
      <Flex gap={8} direction="column">
        {modelFieldMapping.map(({ source: from, target: to }, i) => (
          <Flex key={`${i}`} gap={8} alignItems="center">
            <Select
              loading={sourcesLoading}
              style={{ flex: 1 }}
              value={from}
              onChange={(e) => {
                setModelFieldMapping((prevState) => {
                  const nextState = [...prevState];
                  nextState[i].source = e;
                  return nextState;
                });
              }}
            >
              {sourceProps?.map((s) => (
                <Option
                  key={JSON.stringify(s)}
                  value={s.values[0]?.property.join('.')}
                >
                  {s.values[0]?.property.join('.')}
                </Option>
              ))}
            </Select>
            <IconContainer>
              <Icon type="ArrowRight" />
            </IconContainer>
            <Select
              style={{ flex: 1 }}
              loading={targetsLoading}
              value={to}
              onChange={(e) => {
                setModelFieldMapping((prevState) => {
                  const nextState = [...prevState];
                  nextState[i].target = e;
                  return nextState;
                });
              }}
            >
              {targetProps?.map((s) => (
                <Option
                  key={JSON.stringify(s)}
                  value={s.values[0]?.property.join('.')}
                >
                  {s.values[0]?.property.join('.')}
                </Option>
              ))}
            </Select>
            <Button
              disabled={modelFieldMapping.length === 1}
              icon="Delete"
              onClick={() => {
                setModelFieldMapping([
                  ...modelFieldMapping.splice(0, i),
                  ...modelFieldMapping.splice(i + 1),
                ]);
              }}
            />
          </Flex>
        ))}
        <div>
          <Button
            icon="Add"
            onClick={() => {
              setModelFieldMapping([
                ...modelFieldMapping,
                { source: undefined, target: undefined },
              ]);
            }}
          >
            {t('add-connection')}
          </Button>
        </div>
      </Flex>
    </Container>
  );
}

const Container = styled(Flex).attrs({ direction: 'column', gap: 4 })`
  width: ${QUICK_MATCH_CONFIGURE_MODEL_PAGE_WIDTH}px;
`;

const IconContainer = styled(Flex).attrs({ justifyContent: 'center' })`
  width: 36px;
`;

const ResourceTypeTitle = styled(Overline).attrs({ level: 2 })`
  color: ${Colors['text-icon--status-undefined']};
`;
