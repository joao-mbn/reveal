import React from 'react';
import { Button } from '@cognite/cogs.js';
import { Col, Form, Input, Row } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import {
  checkMetadataKey,
  checkSecretValue,
  getAllSecretKeys,
} from 'utils/formValidations';

/**
 * Function Metadata
 * =============================================================================
 *
 * [Open docs »](https://docs.cognite.com/api/playground/#operation/post-api-playground-projects-project-functions)
 */

type MetadataId = string;
export interface MetaType {
  id: MetadataId;
  key: string;
  value: string;
  keyTouched: boolean;
  valueTouched: boolean;
}

type Props = {
  metadata: MetaType[];
  setMetadata: (diff: any) => void;
};

export default function Metadata({ metadata, setMetadata }: Props) {
  const addMetadata = () => {
    setMetadata((prevMetadata: MetaType[]) => [
      ...prevMetadata,
      {
        id: uuidv4(),
        key: '',
        value: '',
        keyTouched: false,
        valueTouched: false,
      } as MetaType,
    ]);
  };

  const removeMetadata = (id: MetadataId) => {
    const filtered = metadata.filter(meta => meta.id !== id);
    setMetadata(filtered);
  };

  const handleMetadataChange = (evt: {
    target: { name: string; value: string; dataset: any };
  }) => {
    const { idx } = evt.target?.dataset;
    const changeField = evt.target?.name;
    const updatedSecrets = [...metadata];
    if (changeField === 'key') {
      updatedSecrets[idx].key = evt.target.value;
      updatedSecrets[idx].keyTouched = true;
    } else if (changeField === 'value') {
      updatedSecrets[idx].value = evt.target.value;
      updatedSecrets[idx].valueTouched = true;
    }
    setMetadata(updatedSecrets);
  };

  return (
    <Form.Item label="Metadata">
      {metadata.length > 0 &&
        metadata.map((meta: MetaType, index: number) => (
          <Row type="flex" key={meta.id}>
            <Col span={10}>
              <Form.Item
                label="Property"
                required
                validateStatus={
                  meta.keyTouched &&
                  checkMetadataKey(meta.key, getAllSecretKeys(metadata)).error
                    ? 'error'
                    : 'success'
                }
                help={
                  meta.keyTouched
                    ? checkMetadataKey(meta.key, getAllSecretKeys(metadata))
                        .message
                    : undefined
                }
              >
                <Input
                  value={meta.key}
                  name="key"
                  data-idx={index}
                  allowClear
                  onChange={evt => handleMetadataChange(evt)}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label="Value"
                required
                validateStatus={
                  meta.valueTouched && checkSecretValue(meta.value).error
                    ? 'error'
                    : 'success'
                }
                help={
                  meta.valueTouched
                    ? checkSecretValue(meta.value).message
                    : undefined
                }
              >
                <Input
                  value={meta.value}
                  name="value"
                  data-idx={index}
                  allowClear
                  onChange={evt => handleMetadataChange(evt)}
                />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item label="-">
                <Button icon="Delete" onClick={() => removeMetadata(meta.id)} />
              </Form.Item>
            </Col>
          </Row>
        ))}
      {metadata.length >= 16 ? (
        <p>You may only have 16 secrets</p>
      ) : (
        <Button icon="Plus" onClick={addMetadata}>
          Add a metadata
        </Button>
      )}
    </Form.Item>
  );
}
