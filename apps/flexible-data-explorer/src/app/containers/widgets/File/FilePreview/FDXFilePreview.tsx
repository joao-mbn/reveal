import { FilePreview } from './FilePreview';

const UFV_APPLICATION_ID = 'FDX';

export const FDXFilePreview: React.FC<{ fileId: number }> = ({ fileId }) => {
  return (
    <FilePreview
      key={fileId}
      id={`${UFV_APPLICATION_ID}-${fileId}`}
      applicationId={UFV_APPLICATION_ID}
      fileId={fileId}
      creatable={false}
      contextualization={false}
    />
  );
};