import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Modal, Input, Form, Alert } from 'antd';
import { Button } from '@cognite/cogs.js';
import { useMutation, useQuery, useQueryCache } from 'react-query';

import { CogFunction, CallResponse } from 'types';
import { callFunction, getCall } from 'utils/api';
import FunctionCallStatus from 'components/FunctionCallStatus';
import FunctionCallResponse from 'components/FunctionCallResponse';
import ErrorFeedback from 'components/Common/atoms/ErrorFeedback';
import { callKey, callsKey, sortFunctionKey } from 'utils/queryKeys';

const canParseInputData = (inputData: string) => {
  if (inputData === '') {
    return true;
  }
  try {
    JSON.parse(inputData);
    return (
      typeof JSON.parse(inputData) === 'object' &&
      !Array.isArray(JSON.parse(inputData))
    );
  } catch {
    return false;
  }
};

type Props = {
  id: number;
  closeModal: () => void;
};

export default function CallFunctionModal({ id, closeModal }: Props) {
  const queryCache = useQueryCache();

  const [updateInterval, setUpdateInteval] = useState<number | false>(1000);
  const [inputData, setInputData] = useState('');
  // The statefull `callId` could be replaced with wrapping the
  // relevant components in a <LastFunctionCall>, but then it would
  // not be possible to start a new call when one is already running.
  const [callId, setCallId] = useState<number | undefined>();

  const [
    createFunctionCall,
    { data, isSuccess: callCreated, isLoading, error }, // TODO: error handling
  ] = useMutation(callFunction, {
    onSuccess() {
      const queryKey = callsKey({ id });
      queryCache.invalidateQueries(queryKey, { exact: true });
      queryCache.invalidateQueries(sortFunctionKey);
    },
  });

  useEffect(() => {
    if (callCreated && data?.id) {
      setCallId(data?.id);
    }
  }, [callCreated, data]);

  const { data: fn } = useQuery<CogFunction>(`/functions/${id}`);
  const { data: callResponse } = useQuery<CallResponse>(
    callKey({ id, callId: callId! }),
    getCall,
    {
      enabled: !!callId,
      refetchInterval: updateInterval,
    }
  );

  const running = isLoading || (!!callId && callResponse?.status === 'Running');

  useEffect(() => {
    if (!!callId && !running) {
      setUpdateInteval(false);
    } else {
      setUpdateInteval(1000);
    }
  }, [callId, running]);

  const validJSONMessage = <div style={{ color: 'green' }}>JSON is valid</div>;

  const handleInputDataChange = (evt: { target: { value: string } }) => {
    setInputData(evt.target.value);
  };

  const handleCancel = (e: SyntheticEvent) => {
    // Avoid toggling the above <Panel />
    e.stopPropagation();
    closeModal();
  };

  const onCallClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    const formattedInputData =
      inputData === '' ? undefined : JSON.parse(inputData);
    createFunctionCall({ id, data: formattedInputData });
  };

  return (
    <Modal
      title="Call function"
      visible
      width={900}
      onCancel={handleCancel}
      footer={[
        <Button key="close" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="call"
          type="primary"
          disabled={
            isLoading || (callId && running) || !canParseInputData(inputData)
          }
          onClick={onCallClick}
        >
          Call
        </Button>,
      ]}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label="Function name">
          <Input disabled value={fn?.name} />
        </Form.Item>
        <Form.Item
          label="Input data"
          validateStatus={canParseInputData(inputData) ? 'success' : 'error'}
          help={
            !canParseInputData(inputData)
              ? 'Input data must be a valid JSON object'
              : validJSONMessage
          }
          hasFeedback
        >
          <Input.TextArea
            rows={4}
            disabled={running}
            value={inputData}
            onChange={handleInputDataChange}
            allowClear
          />
        </Form.Item>
        <Form.Item label="Call status">
          <FunctionCallStatus id={id} callId={callId} />
        </Form.Item>
        <Form.Item label="Call response">
          {error && (
            <Alert
              type="error"
              message="Error"
              description={
                <>
                  <p>An error occured when calling the function.</p>
                  <ErrorFeedback error={error} />
                </>
              }
            />
          )}
          <FunctionCallResponse id={id} callId={data?.id} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export const stuffForUnitTests = {
  canParseInputData,
};
