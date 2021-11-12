import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'components/modal';

import { ConfigFormFields } from '../ConfigFormFields';
import { CustomComponent } from '../types';

import { CustomForm } from './elements';

export const MetadataFormModal: CustomComponent = ({
  onClose,
  onOk,
  metadataValue,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});

  const handleChange = useCallback(
    (changeKey: string, changeValue: unknown) =>
      setFormData((state) => ({ ...state, [changeKey]: changeValue })),
    []
  );

  const handleOk = useCallback(() => onOk(formData), [formData]);

  return (
    <Modal
      thirdWidth
      visible
      title={`New ${metadataValue?.label}`}
      onCancel={onClose}
      okText={t('Create')}
      onOk={handleOk}
      className="project-config-modal-form"
    >
      <CustomForm direction="column" gap={16}>
        <ConfigFormFields
          metadataValue={metadataValue}
          value={formData}
          onChange={handleChange}
        />
      </CustomForm>
    </Modal>
  );
};
