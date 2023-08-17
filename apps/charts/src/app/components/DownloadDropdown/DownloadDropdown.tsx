/**
 * Download Charts
 */
import { ComponentProps, useState } from 'react';

import Dropdown from '@charts-app/components/Dropdown/Dropdown';
import { makeDefaultTranslations } from '@charts-app/utils/translations';
import styled from 'styled-components/macro';

import { Button } from '@cognite/cogs.js';

const defaultTranslations = makeDefaultTranslations(
  'PNG',
  'CSV',
  'Download',
  'Calculations'
);

interface SharingDropdownProps {
  translations?: typeof defaultTranslations;
  onDownloadCalculations?: () => void;
  onDownloadImage: () => void;
  onCsvDownload: () => void;
  label?: string | undefined;
}

const DownloadDropdown = ({
  translations,
  onDownloadCalculations,
  onDownloadImage,
  onCsvDownload,
  label,
}: SharingDropdownProps) => {
  const t = { ...defaultTranslations, ...translations };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const options: ComponentProps<typeof Dropdown>['options'] = [
    {
      label: t.PNG,
      icon: 'Image',
      onClick: onDownloadImage,
    },
    {
      label: t.CSV,
      icon: 'DataTable',
      onClick: onCsvDownload,
    },
  ];
  if (onDownloadCalculations) {
    options.push({
      label: t.Calculations,
      icon: 'Function',
      onClick: onDownloadCalculations,
    });
  }
  return (
    <StyledDropdown
      style={{ width: '14rem' }}
      title={t.Download}
      open={isMenuOpen}
      onClose={() => setIsMenuOpen(false)}
      options={options}
    >
      <Button
        icon="Download"
        type="ghost"
        aria-label="Open dropdown"
        onClick={() => setIsMenuOpen((prevState) => !prevState)}
      >
        {label}
      </Button>
    </StyledDropdown>
  );
};

const StyledDropdown = styled(Dropdown)`
  width: 100%;
`;

DownloadDropdown.translationKeys = Object.keys(defaultTranslations);

export default DownloadDropdown;