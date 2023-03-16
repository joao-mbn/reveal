import { Notification } from '@platypus-app/components/Notification/Notification';
import { DEFAULT_VERSION_PATH } from '@platypus-app/utils/config';
import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useDataSets } from '@platypus-app/hooks/useDataSets';
import { useDataModelMutation } from './hooks/useDataModelMutation';
import { DataUtils } from '@platypus/platypus-core';
import {
  DataModelDetailModal,
  OptionType,
} from '../../components/DataModelDetailModal/DataModelDetailModal';
import { useNavigate } from '@platypus-app/flags/useNavigate';
import { useMixpanel } from '@platypus-app/hooks/useMixpanel';

export const CreateDataModel = ({
  onCancel,
  visible,
}: {
  onCancel: VoidFunction;
  visible: boolean;
}) => {
  const [dataModelName, setDataModelName] = useState('');
  const [space, setSpace] = useState<OptionType<string>>();
  const [dataModelDescription, setDataModelDescription] = useState('');
  const [externalId, setExternalId] = useState('');
  const [isExternalIdDirty, setIsExternalIdDirty] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation('CreateDataModelDialog');
  const { create } = useDataModelMutation();
  const { track } = useMixpanel();

  const {
    data: dataSets,
    isLoading: isDataSetsLoading,
    isError: isDataSetsFetchError,
  } = useDataSets();

  const handleNameChange = (value: string) => {
    setDataModelName(value);

    if (!isExternalIdDirty) {
      setExternalId(DataUtils.convertToExternalId(value));
    }
  };

  const handleExternalIdChange = (value: string) => {
    setExternalId(value);
    setIsExternalIdDirty(true);
  };

  const handleSubmit = () => {
    create.mutate(
      {
        space: space?.value,
        externalId,
        name: dataModelName.trim(),
        description: dataModelDescription,
      },
      {
        onSettled: (result) => {
          if (!result) {
            return;
          }

          if (result.isFailure) {
            Notification({
              type: 'error',
              message: result.error.message,
            });

            return;
          }

          track('DataModel.Create');

          Notification({
            type: 'success',
            message: t(
              'success_data_model_created',
              'Data Model successfully created'
            ),
          });
          navigate(
            `/${result.getValue().space}/${
              result.getValue().id
            }/${DEFAULT_VERSION_PATH}`
          );
        },
      }
    );
  };

  return (
    <DataModelDetailModal
      visible={visible}
      dataSets={dataSets || []}
      description={dataModelDescription || ''}
      externalId={externalId}
      isDataSetsFetchError={isDataSetsFetchError}
      isDataSetsLoading={isDataSetsLoading}
      isLoading={create.isLoading}
      name={dataModelName}
      okButtonName={t('data_model_create_modal_ok_button', 'Create')}
      onCancel={onCancel}
      onExternalIdChange={handleExternalIdChange}
      onDescriptionChange={(value) => setDataModelDescription(value)}
      onNameChange={handleNameChange}
      onSubmit={handleSubmit}
      space={space}
      onSpaceChange={setSpace}
      title={t('data_model_create_modal_title', 'Create Data Model')}
    />
  );
};
