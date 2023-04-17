import { CogniteClient } from '@cognite/sdk';
import { getAssetTableContainerConfig } from '@cognite/unified-file-viewer';
import { IndustryCanvasContainerConfig } from '../../types';
import {
  DEFAULT_ASSET_HEIGHT,
  DEFAULT_ASSET_WIDTH,
} from '../../utils/addDimensionsToContainerReference';
import { v4 as uuid } from 'uuid';

const resolveAssetContainerConfig = async (
  sdk: CogniteClient,
  {
    id,
    resourceId,
    x,
    y,
    width,
    height,
  }: {
    id?: string | undefined;
    resourceId: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }
): Promise<IndustryCanvasContainerConfig> => {
  const asset = await sdk.assets.retrieve([{ id: resourceId }]);

  if (asset.length !== 1) {
    throw new Error('Expected to find exactly one asset');
  }

  return {
    ...(await getAssetTableContainerConfig(
      sdk as any,
      {
        id: id || uuid(),
        label: asset[0].name ?? asset[0].externalId,
        x: x,
        y: y,
        width: width ?? DEFAULT_ASSET_WIDTH,
        height: height ?? DEFAULT_ASSET_HEIGHT,
      },
      {
        assetId: resourceId,
      }
    )),
    metadata: {
      resourceId,
    },
  } as IndustryCanvasContainerConfig;
};

export default resolveAssetContainerConfig;