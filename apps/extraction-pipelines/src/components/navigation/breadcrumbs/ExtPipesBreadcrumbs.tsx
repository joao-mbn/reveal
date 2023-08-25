import React from 'react';

import { createLink } from '@cognite/cdf-utilities';

import { useTranslation } from '../../../common';
import { createExtPipePath } from '../../../utils/baseURL';

import { Breadcrumbs } from './Breadcrumbs';

export const ExtPipesBreadcrumbs = () => {
  const { t } = useTranslation();

  const currentPageBreadCrumbs = [
    {
      href: createLink(''),
      label: t('cognite-data-fusion'),
      dataTestId: 'cognite-data-fusion',
    },
    {
      href: createLink('/data-sets'),
      label: t('data-sets'),
      dataTestId: 'data-sets',
    },
    {
      href: createExtPipePath(),
      label: t('extraction-pipeline_other', { count: 0 }),
      dataTestId: 'extraction-pipeline',
    },
  ];
  return <Breadcrumbs breadcrumbs={currentPageBreadCrumbs} />;
};