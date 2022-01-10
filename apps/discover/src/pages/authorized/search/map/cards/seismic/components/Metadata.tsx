import { useTranslation } from 'react-i18next';

import get from 'lodash/get';

import { Typography } from 'components/typography';
import { SeismicFile } from 'modules/api/types';
import { mapMetadata, getSafeMetadataName } from 'modules/seismicSearch/utils';
import { SeismicConfig } from 'tenants/types';

export const Metadata = ({
  item,
  config,
}: {
  item: SeismicFile;
  config: SeismicConfig;
}) => {
  const { t } = useTranslation('SeismicData');

  const metadata = mapMetadata(item.metadata);
  const MetaData = Object.keys(config.metadata || {}).map((key) => {
    if (config?.metadata && config.metadata[key].display) {
      const data =
        config.metadata[key].source !== undefined
          ? get(item, `${config.metadata[key].source}${key}`)
          : get(metadata, getSafeMetadataName(key));

      return (
        <div key={key}>
          <strong>{config.metadata[key].displayName}</strong>: {data}
        </div>
      );
    }
    return {};
  });

  return (
    <Typography variant="tinytext">
      <strong>{t('Dataset')}:</strong> {item.name} <br />
      {MetaData}
      <strong>Id:</strong> {item.id} <br />
    </Typography>
  );
};

export default Metadata;
