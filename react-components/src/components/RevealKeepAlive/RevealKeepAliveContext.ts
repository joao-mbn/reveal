/*!
 * Copyright 2023 Cognite AS
 */
import { type MutableRefObject, createContext, useContext } from 'react';
import { type FdmNodeCache } from '../CacheProvider/FdmNodeCache';
import { type AssetMappingCache } from '../CacheProvider/AssetMappingCache';
import { type PointCloudAnnotationCache } from '../CacheProvider/PointCloudAnnotationCache';
import { type Image360AnnotationCache } from '../CacheProvider/Image360AnnotationCache';
import { type SceneIdentifiers } from '../SceneContainer/sceneTypes';
import { type RevealRenderTarget } from '../../architecture/RenderTarget/RevealRenderTarget';

export type RevealKeepAliveData = {
  renderTargetRef: MutableRefObject<RevealRenderTarget | undefined>;
  isRevealContainerMountedRef: MutableRefObject<boolean>;
  sceneLoadedRef: MutableRefObject<SceneIdentifiers | undefined>;
  fdmNodeCache: MutableRefObject<FdmNodeCache | undefined>;
  assetMappingCache: MutableRefObject<AssetMappingCache | undefined>;
  pointCloudAnnotationCache: MutableRefObject<PointCloudAnnotationCache | undefined>;
  image360AnnotationCache: MutableRefObject<Image360AnnotationCache | undefined>;
};

export const RevealKeepAliveContext = createContext<RevealKeepAliveData | undefined>(undefined);

export const useRevealKeepAlive = (): RevealKeepAliveData | undefined => {
  return useContext(RevealKeepAliveContext);
};
