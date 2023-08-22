import { useState } from 'react';
import { Menu, Modal, Divider } from '@cognite/cogs.js';
import { getContainer } from '@entity-matching-app/utils';
import { useTranslation } from '@entity-matching-app/common/i18n';
import {
  PipelineWithLatestRun,
  useRunEMPipeline,
} from '@entity-matching-app/hooks/entity-matching-pipelines';

type PipelineActionsMenuProps = {
  pipeline: PipelineWithLatestRun;
  latestRun?: PipelineWithLatestRun['latestRun'];
  onDuplicatePipeline?: () => void;
  onDeletePipeline: () => void;
};
const PipelineActionsMenu = (props: PipelineActionsMenuProps) => {
  const { onDuplicatePipeline, onDeletePipeline } = props;
  const { mutateAsync: runEMPipeline } = useRunEMPipeline();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { t } = useTranslation();

  const onCancelDeletePipeline = () => setDeleteModalVisible(false);

  const rerun = props.pipeline?.latestRun?.status;
  const running = rerun === 'Queued' || rerun === 'Running';

  const handleReRunPipeline = (id: number) => {
    runEMPipeline({ id });
  };

  let itemText;

  switch (rerun) {
    case 'Queued': {
      itemText = t('queued');
      break;
    }
    case 'Running': {
      itemText = t('running');
      break;
    }
    default: {
      itemText = t('rerun-pipeline');
      break;
    }
  }

  return (
    <>
      <Menu>
        {props.latestRun && (
          <>
            <Menu.Item
              icon="Play"
              iconPlacement="left"
              onClick={() => handleReRunPipeline(props.pipeline.id)}
              disabled={running}
            >
              {itemText}
            </Menu.Item>
            <Divider />
          </>
        )}
        <Menu.Item
          icon="Duplicate"
          iconPlacement="left"
          onClick={onDuplicatePipeline}
        >
          {t('pipeline-actions-menu-duplicate')}
        </Menu.Item>
        <Divider />
        <Menu.Item
          icon="Delete"
          iconPlacement="left"
          onClick={() => {
            setDeleteModalVisible(true);
          }}
          destructive
        >
          {t('pipeline-actions-menu-delete')}
        </Menu.Item>
      </Menu>
      <PipelineDeleteModal
        visible={deleteModalVisible}
        onOk={onDeletePipeline}
        onCancel={onCancelDeletePipeline}
      />
    </>
  );
};

type PipelineDeleteModalProps = {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
};
function PipelineDeleteModal(props: PipelineDeleteModalProps) {
  const { visible, onOk, onCancel } = props;
  const { t } = useTranslation();
  return (
    <Modal
      getContainer={getContainer()}
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      title={t('pipeline-delete-modal-title')}
      okText={t('pipeline-actions-menu-delete')}
    >
      {t('pipeline-delete-modal-warning-message')}
    </Modal>
  );
}

export default PipelineActionsMenu;