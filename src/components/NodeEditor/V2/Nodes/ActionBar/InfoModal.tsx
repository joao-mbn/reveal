import { Operation } from '@cognite/calculation-backend';
import { Modal } from '@cognite/cogs.js';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components/macro';

type Props = {
  indslFunction: Operation;
  isOpen?: boolean;
  onClose?: () => void;
};

const InfoModal = ({
  indslFunction,
  isOpen = false,
  onClose = () => {},
}: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(isOpen);

  // Control Uncontrolled/Controlled State
  useEffect(() => {
    setIsModalVisible(isOpen);
  }, [isOpen]);

  return (
    <ModalWrapper
      appElement={document.getElementsByTagName('body')}
      title={indslFunction.name}
      visible={isModalVisible}
      footer={null}
      onCancel={() => {
        setIsModalVisible(false);
        onClose();
      }}
      width={750}
    >
      <ReactMarkdown>{indslFunction.description || ''}</ReactMarkdown>
    </ModalWrapper>
  );
};

export default InfoModal;

const ModalWrapper = styled(Modal)`
  .cogs-modal-header {
    border-bottom: none;
    font-size: var(--cogs-t3-font-size);
  }
`;
