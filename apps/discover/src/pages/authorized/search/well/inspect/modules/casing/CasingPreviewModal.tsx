import React from 'react';

import { BaseButton } from 'components/buttons';
import { useUserPreferencesMeasurement } from 'hooks/useUserPreferences';
import { useNptEventsForCasings } from 'modules/wellSearch/selectors';

import CasingView from './CasingView/CasingView';
import { CasingPreviewFooter, CasingPreviewModalWrapper } from './elements';
import { FormattedCasings } from './interfaces';

type Props = {
  onClose: () => void;
  casing: FormattedCasings;
};

export const CasingPreviewModal: React.FC<Props> = ({ onClose, casing }) => {
  const { isLoading: isEventsLoading, events } = useNptEventsForCasings();
  const prefferedUnit = useUserPreferencesMeasurement();

  const footer = (
    <CasingPreviewFooter>
      <BaseButton
        type="secondary"
        text="Close"
        aria-label="Close"
        onClick={onClose}
      />
    </CasingPreviewFooter>
  );

  return (
    <CasingPreviewModalWrapper
      appElement={document.getElementById('root') || undefined}
      visible
      onCancel={onClose}
      footer={footer}
    >
      <CasingView
        key={`${casing.key}KEY`}
        wellName={casing.wellName}
        wellboreName={casing.wellboreName}
        casings={casing.casings}
        unit={prefferedUnit}
        events={events[casing.key]}
        isEventsLoading={isEventsLoading}
      />
    </CasingPreviewModalWrapper>
  );
};

export default CasingPreviewModal;
