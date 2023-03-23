import { Flex } from '@cognite/cogs.js';

import { useTranslation } from 'common';
import { QUICK_MATCH_CONFIGURE_MODEL_PAGE_WIDTH } from 'common/constants';
import FieldMapping from 'components/field-mapping';
import Radio from 'components/radio';
import RadioBox from 'components/radio-box';
import Step from 'components/step';
import { EMFeatureType, useQuickMatchContext } from 'context/QuickMatchContext';
import styled from 'styled-components';

export default function ModelConfiguration() {
  const { t } = useTranslation();
  const {
    sourceType,
    matchFields: modelFieldMapping,
    setModelFieldMapping,
    supervisedMode,
    setSupervisedMode,
    featureType,
    setFeatureType,
    scope,
    setScope,
  } = useQuickMatchContext();
  return (
    <Container>
      <Step.Section>
        <Step.SectionHeader
          subtitle={t('model-configuration-fields-body')}
          title={t('model-configuration-fields-header')}
        />
        <FieldMapping
          sourceType={sourceType}
          targetType="assets"
          modelFieldMapping={modelFieldMapping}
          setModelFieldMapping={setModelFieldMapping}
        />
      </Step.Section>
      <Step.Section>
        <Step.SectionHeader
          subtitle={t('model-configuration-model-score-body')}
          title={t('model-configuration-model-score-header')}
        />
        <Radio.Group
          value={featureType}
          onChange={(e) => setFeatureType(e.target.value as EMFeatureType)}
        >
          <Flex direction="column" gap={4}>
            <Radio
              value="simple"
              name="simple"
              title={t('model-simple-title')}
              subtitle={t('model-simple-subtitle')}
              description={t('model-simple-description')}
            />
            <Radio
              value="bigram"
              name="bigram"
              title={t('model-bigram-title')}
              description={t('model-bigram-description')}
            />
            <Radio
              value="fwb"
              name="fwb"
              title={t('model-frequency-weighted-bigram-title')}
              description={t('model-frequency-weighted-bigram-description')}
            />
            <Radio
              value="bigramextratokenizers"
              name="bigramextratokenizers"
              title={t('model-bigram-with-extra-tokenizers-title')}
              description={t('model-bigram-with-extra-tokenizers-description')}
            />
            <Radio
              value="bigramcombo"
              name="bigramcombo"
              title={t('model-combined-title')}
              description={t('model-combined-description')}
            />
          </Flex>
        </Radio.Group>
      </Step.Section>
      <Step.Section>
        <Step.SectionHeader
          subtitle={t('model-configuration-model-type-body')}
          title={t('model-configuration-model-type-header')}
        />
        <Radio.Group
          onChange={(e) => setSupervisedMode(e.target.value === 'supervised')}
          value={supervisedMode ? 'supervised' : 'unsupervised'}
        >
          <Flex gap={8}>
            <RadioBox checked={!supervisedMode} value="unsupervised">
              {t('unsupervised-model')}
            </RadioBox>
            <RadioBox checked={supervisedMode} value="supervised">
              {t('supervised-model')}
            </RadioBox>
          </Flex>
        </Radio.Group>
      </Step.Section>
      <Step.Section>
        <Step.SectionHeader
          subtitle={t('model-configuration-scope-desc')}
          title={t('model-configuration-scope-header')}
        />
        <Radio.Group onChange={(e) => setScope(e.target.value)} value={scope}>
          <Flex gap={8}>
            <RadioBox checked={scope === 'all'} value="all">
              {t('model-configuration-scope-all')}
            </RadioBox>
            <RadioBox checked={scope === 'unmatched'} value="unmatched">
              {t('model-configuration-scope-unmatched-only')}
            </RadioBox>
          </Flex>
        </Radio.Group>
      </Step.Section>
    </Container>
  );
}

const Container = styled(Flex).attrs({ direction: 'column' })`
  width: ${QUICK_MATCH_CONFIGURE_MODEL_PAGE_WIDTH}px;
`;
