/*!
 * Copyright 2023 Cognite AS
 */

import {
  type AddModelOptions,
  type SupportedModelTypes,
  type CadIntersection,
  type NodeAppearance
} from '@cognite/reveal';
import { type Matrix4 } from 'three';
import { type DmsUniqueIdentifier, type Source } from '../../utilities/FdmSDK';
import { type Node3D } from '@cognite/sdk/dist/src';

export type AddImageCollection360Options = {
  siteId: string;
};

export type FdmPropertyType<NodeType> = Record<string, Record<string, NodeType>>;

export type AddResourceOptions = AddReveal3DModelOptions | AddImageCollection360Options;

export type AddReveal3DModelOptions = AddModelOptions & { transform?: Matrix4 } & {
  styling?: { default?: NodeAppearance; mapped?: NodeAppearance };
};
export type TypedReveal3DModel = AddReveal3DModelOptions & { type: SupportedModelTypes };

export type NodeDataResult = {
  nodeExternalId: string;
  view: Source;
  cadNode: Node3D;
  intersection: CadIntersection;
};

export type FdmAssetStylingGroup = {
  fdmAssetExternalIds: DmsUniqueIdentifier[];
  style: { cad: NodeAppearance };
};

export type DefaultResourceStyling = {
  cad?: { default?: NodeAppearance; mapped?: NodeAppearance };
  pointcloud?: { default: NodeAppearance };
};

export type Reveal3DResourcesProps = {
  resources: AddResourceOptions[];
  defaultResourceStyling?: DefaultResourceStyling;
  instanceStyling?: FdmAssetStylingGroup[];
  onNodeClick?: (node: Promise<NodeDataResult | undefined>) => void;
  onResourcesAdded?: () => void;
};
