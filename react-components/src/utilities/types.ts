/*!
 * Copyright 2024 Cognite AS
 */
import { type Relationship } from '@cognite/sdk/';
import { type DmsUniqueIdentifier, type Source } from './FdmSDK';

export type FdmInstanceWithView = DmsUniqueIdentifier & { view: Source };

export type AssetInstanceReference = { assetId: number };
export type InstanceReference = AssetInstanceReference | DmsUniqueIdentifier;

export function isAssetInstance(instance: InstanceReference): instance is AssetInstanceReference {
  return 'assetId' in instance;
}

export function isDmsInstance(instance: InstanceReference): instance is DmsUniqueIdentifier {
  return 'externalId' in instance && 'space' in instance;
}

export type RelationshipsFilterInternal = {
  labels?: string[];
};

export type ExtendedRelationship = {
  relation: 'Source' | 'Target';
} & Relationship;
