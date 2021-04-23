import React from 'react';
import styled from 'styled-components';
import { Detail, Title } from '@cognite/cogs.js';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/rootReducer';
import { PopulateAnnotations } from 'src/store/thunks/PopulateAnnotations';
import { margin } from 'src/cogs-variables';
import {
  addUploadedFile,
  selectAllFiles,
} from 'src/modules/Upload/uploadedFilesSlice';
import { FileUploader } from 'src/modules/Common/Components/FileUploader/FileUploader';

const FileUploaderWrapper = styled.div`
  margin: ${margin.default} 0;
`;

export default function UploadStep() {
  const dispatch = useDispatch();
  const uploadedFiles = useSelector((state: RootState) =>
    selectAllFiles(state.uploadedFiles)
  );

  const onUploadSuccess = React.useCallback(
    (file) => {
      dispatch(addUploadedFile(file));
      dispatch(
        PopulateAnnotations({
          fileId: file.id.toString(),
          assetIds: file.assetIds,
        })
      );
    },
    [dispatch]
  );

  return (
    <>
      <Title level={2}>Upload file</Title>

      <FileUploaderWrapper>
        <FileUploader
          initialUploadedFiles={uploadedFiles}
          accept={['.jpeg', '.jpg', '.png', '.tiff', '.mp4'].join(', ')}
          maxTotalSizeInBytes={1 * 1024 ** 3 /* 1 GB */}
          maxFileCount={100}
          onUploadSuccess={onUploadSuccess}
        >
          <AcceptMessage>
            <b>* Supported files: </b>
            jpeg, png, tiff, mp4. Limit: 100 files with a total size of 1 GB.
          </AcceptMessage>
        </FileUploader>
      </FileUploaderWrapper>
    </>
  );
}

const AcceptMessage = styled(Detail)`
  text-align: right;
  color: #8c8c8c;
  opacity: 0.8;
  align-self: flex-end;
  width: 100%;
`;
