import React from 'react';
import Highlighter from 'react-highlight-words';

import styled from 'styled-components';

import { HighlightCell, EllipsisText } from '@data-exploration/components';
import { FileThumbnail } from '@data-exploration/containers';
import {
  fileIconMapper,
  isFilePreviewable,
  mapMimeTypeToDocumentType,
} from '@data-exploration-lib/core';
import { Popover } from 'antd';

import { DocumentIcon, Flex } from '@cognite/cogs.js';
import { FileInfo } from '@cognite/sdk';

const DocumentIconWrapper = styled.div`
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
`;
export const FileNamePreview = ({
  fileName,
  file,
  query,
}: {
  fileName: string;
  file: FileInfo;
  query: string | undefined;
}) => {
  const isPreviewable = isFilePreviewable(file);

  if (isPreviewable) {
    return (
      <Popover
        content={<FileThumbnail file={file} />}
        title={fileName}
        trigger="hover"
        placement="topLeft"
      >
        <Flex gap={4} alignItems="center">
          <DocumentIconWrapper>
            {file?.mimeType && (
              <DocumentIcon
                file={fileIconMapper[file.mimeType] || 'file.txt'}
              />
            )}
          </DocumentIconWrapper>

          <EllipsisText level={2} strong lines={2}>
            <Highlighter
              searchWords={(query || '').split(' ')}
              textToHighlight={fileName || ''}
              autoEscape
            />
          </EllipsisText>
        </Flex>
      </Popover>
    );
  }

  return (
    <Flex gap={4} alignItems="center">
      <DocumentIconWrapper>
        {file?.mimeType && (
          <DocumentIcon file={mapMimeTypeToDocumentType(file.mimeType)} />
        )}
      </DocumentIconWrapper>
      <HighlightCell text={fileName} query={query} />
    </Flex>
  );
};