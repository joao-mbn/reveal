import { Input, Modal, Textarea } from '@cognite/cogs.js';
import { useState } from 'react';
import { useTranslation } from '@platypus-app/hooks/useTranslation';
import { NameWrapper, StyledEditableChip } from './elements';
import { DataSet } from '@cognite/sdk';
import {
  DataModelExternalIdValidator,
  Validator,
} from '@platypus/platypus-core';
import { DataModelNameValidator } from '@platypus-core/domain/data-model/validators/data-model-name-validator';
import {
  DataModelSpaceSelect,
  OptionType,
} from '../DataModelSpaceSelect/DataModelSpaceSelect';
import { DataModelNameValidatorV2 } from '@platypus-core/domain/data-model/validators/data-model-name-validator-v2';
import { isFDMv3 } from '@platypus-app/flags';
import { FormLabel } from '../FormLabel/FormLabel';
import { DataModelExternalIdValidatorV2 } from '@platypus-core/domain/data-model/validators/data-model-external-id-validator-v2';
import { CreateNewSpaceModal } from '../CreateNewSpaceModal/CreateNewSpaceModal';

export { OptionType };

export type DataModelDetailModalProps = {
  description: string;
  externalId: string;
  hasInputError?: boolean;
  dataSets: DataSet[];
  isDataSetsLoading?: boolean;
  isDataSetsFetchError?: boolean;
  isExternalIdLocked?: boolean;
  isLoading?: boolean;
  isSpaceDisabled?: boolean;
  okButtonName?: string;
  name: string;
  onCancel: () => void;
  onSubmit: () => void;
  onDescriptionChange: (value: string) => void;
  onExternalIdChange?: (value: string) => void;
  onNameChange: (value: string) => void;
  onSpaceChange?: (value: OptionType<string>) => void;
  space?: OptionType<string>;
  title: string;
  visible?: boolean;
};

export const DataModelDetailModal = (props: DataModelDetailModalProps) => {
  const { t } = useTranslation('DataModelDetailModal');
  const isFDMV3 = isFDMv3();
  const [externalIdErrorMessage, setExternalIdErrorMessage] = useState();
  const [nameErrorMessage, setNameErrorMessage] = useState();
  const [isCreateSpaceModalVisible, setIsCreateSpaceModalVisible] =
    useState(false);

  const validateName = (value: string) => {
    const validator = new Validator({ name: value });
    const dataModelNameValidator = isFDMV3
      ? new DataModelNameValidator()
      : new DataModelNameValidatorV2();
    validator.addRule('name', dataModelNameValidator);
    const result = validator.validate();
    setNameErrorMessage(result.valid ? null : result.errors.name);

    return result.valid;
  };

  const validateExternalId = (value: string) => {
    const validator = new Validator({ externalId: value });
    const dataModelExternalIdValidator = isFDMV3
      ? new DataModelExternalIdValidator()
      : new DataModelExternalIdValidatorV2();
    validator.addRule('externalId', dataModelExternalIdValidator);
    const result = validator.validate();

    setExternalIdErrorMessage(result.valid ? null : result.errors.externalId);

    return result.valid;
  };

  const isSubmitDisabled =
    !props.name.trim() ||
    props.hasInputError ||
    nameErrorMessage ||
    externalIdErrorMessage ||
    (isFDMV3 && !props.space) ||
    props.isLoading;

  return (
    <>
      <Modal
        closable={!props.isLoading}
        visible={props.visible && !isCreateSpaceModalVisible}
        title={props.title}
        onCancel={props.onCancel}
        onOk={props.onSubmit}
        okDisabled={isSubmitDisabled}
        okText={props.okButtonName}
        icon={props.isLoading ? 'Loader' : undefined}
        data-cy="create-data-model-modal-content"
      >
        <div>
          <label>
            <FormLabel level={2} strong required>
              {t('modal_name_title', 'Name')}
            </FormLabel>
            <NameWrapper>
              <Input
                fullWidth
                autoFocus
                name="dataModelName"
                data-cy="input-data-model-name"
                value={props.name}
                disabled={props.isLoading}
                placeholder={t('modal_name_input_placeholder', 'Enter name')}
                onChange={(e) => {
                  validateName(e.target.value);
                  props.onNameChange(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSubmitDisabled) {
                    props.onSubmit();
                  }
                }}
                error={props.hasInputError || nameErrorMessage}
              />
            </NameWrapper>
          </label>
          <StyledEditableChip
            data-testid="external-id-field"
            errorMessage={externalIdErrorMessage}
            isLocked={props.isExternalIdLocked || props.isLoading}
            label={t('external_id_label', 'External ID')}
            onChange={props.onExternalIdChange}
            placeholder={t(
              'data_model_id_placeholder',
              'Data model external ID'
            )}
            tooltip={
              props.externalId
                ? t('tooltip_external_id_label', 'External ID')
                : t(
                    'tooltip_external_id_explanation',
                    'External ID automatically generated from [Name]'
                  )
            }
            validate={validateExternalId}
            value={props.externalId}
          />
          <label>
            <FormLabel level={2} strong>
              {t('modal_description_title', 'Description')}
            </FormLabel>
            <Textarea
              name="dataModelDescription"
              data-cy="input-data-model-description"
              disabled={props.isLoading}
              value={props.description}
              onChange={(e) => props.onDescriptionChange(e.target.value)}
              placeholder={t(
                'modal_description_textarea_placeholder',
                'Add description'
              )}
              fullWidth
            ></Textarea>
          </label>

          {isFDMV3 && (
            <DataModelSpaceSelect
              isDisabled={props.isSpaceDisabled || props.isLoading}
              onChange={(selectedSpaceOption) =>
                props.onSpaceChange?.(selectedSpaceOption)
              }
              onRequestCreateSpace={() => setIsCreateSpaceModalVisible(true)}
              value={props.space}
            />
          )}
        </div>
      </Modal>
      {isCreateSpaceModalVisible && (
        <CreateNewSpaceModal
          visible
          onCancel={() => setIsCreateSpaceModalVisible(false)}
          onSubmit={(newSpace) => {
            props.onSpaceChange?.({
              label: newSpace,
              value: newSpace,
            });
            setIsCreateSpaceModalVisible(false);
          }}
        />
      )}
    </>
  );
};