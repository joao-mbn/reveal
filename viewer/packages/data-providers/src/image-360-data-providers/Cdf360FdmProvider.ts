/*!
 * Copyright 2023 Cognite AS
 */

import { CogniteClient } from '@cognite/sdk';
import {
  Historical360ImageSet,
  Image360FileDescriptor,
  Image360EventDescriptor,
  Image360DescriptorProvider,
  Image360Descriptor
} from '../types';
import { get360ImageCollectionsQuery } from './listCollections';
import { Euler, Matrix4 } from 'three';
import assert from 'assert';

export type DM360CollectionIdentifier = {
  space: string;
  dataModelExternalId: string;
  image360CollectionExternalId: string;
};

type JSONData = {
  getImage360CollectionById: {
    items: Image360Collection[];
  };
};

type Image360Collection = {
  externalId: string;
  label: string;
  stations: {
    items: Image360Station[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
};

type Image360Station = {
  externalId: string;
  label: string;
  revisions: {
    items: Image360Revision[];
  };
};

type Image360Revision = {
  externalId: string;
  label: string;
  timeTaken: number | null;
  translation: {
    x: number;
    y: number;
    z: number;
  };
  eulerRotation: {
    x: number;
    y: number;
    z: number;
  };
  cubeMap: {
    back: FileMetadata;
    bottom: FileMetadata;
    front: FileMetadata;
    left: FileMetadata;
    right: FileMetadata;
    top: FileMetadata;
  };
};

type FileMetadata = {
  id: number;
  mimeType: 'image/jpeg' | 'image/png';
};

export class Cdf360FdmProvider implements Image360DescriptorProvider<DM360CollectionIdentifier> {
  private readonly _sdk: CogniteClient;

  constructor(sdk: CogniteClient) {
    this._sdk = sdk;
  }
  public async get360ImageDescriptors(
    metadataFilter: DM360CollectionIdentifier,
    _: boolean
  ): Promise<Historical360ImageSet[]> {
    const { image360CollectionExternalId } = metadataFilter;

    const image360Stations = await this.fetchImageCollection(metadataFilter);

    const collectionId = image360CollectionExternalId;
    const collectionLabel = 'test';

    const imgs = await Promise.all(
      image360Stations.map(station => this.createHistorical360ImageSet(station, collectionId, collectionLabel))
    );
    return imgs;
  }

  private async fetchImageCollection(metadataFilter: DM360CollectionIdentifier): Promise<Image360Station[]> {
    const { dataModelExternalId, space, image360CollectionExternalId } = metadataFilter;

    const baseUrl = this._sdk.getBaseUrl();
    const project = this._sdk.project;
    const graphQlEndpoint = `${baseUrl}/api/v1/projects/${project}/userapis/spaces/${space}/datamodels/${dataModelExternalId}/versions/1/graphql`;

    const stations: Image360Station[] = [];

    let hasNextPage = true;
    let endCursor: string | undefined = undefined;

    const start = performance.now();

    while (hasNextPage) {
      const result = await this._sdk.post(graphQlEndpoint, {
        data: { query: get360ImageCollectionsQuery(image360CollectionExternalId, space, endCursor) }
      });

      const data = result.data.data as JSONData;
      stations.push(...data.getImage360CollectionById.items[0].stations.items);
      hasNextPage = data.getImage360CollectionById.items[0].stations.pageInfo.hasNextPage;
      endCursor = data.getImage360CollectionById.items[0].stations.pageInfo.endCursor;
    }

    console.log(`Fetched ${stations.length} stations in ${performance.now() - start} ms`);

    return stations;
  }

  private async createHistorical360ImageSet(
    image360Station: Image360Station,
    collectionId: string,
    collectionLabel: string
  ): Promise<Historical360ImageSet> {
    const revisions = image360Station.revisions.items;

    assert(revisions.length >= 0, 'Expected at least one revision to be returned from the query');

    const primaryRevision = revisions[0];
    const primaryRevisionTransform = this.getRevisionTransform(primaryRevision);

    const image360Descriptor: Image360EventDescriptor = {
      collectionId,
      collectionLabel,
      id: image360Station.externalId,
      label: image360Station.label,
      transform: primaryRevisionTransform
    };

    const imageRevisions = await Promise.all(revisions.map(revision => this.getRevisionDescriptor(revision)));

    return { ...image360Descriptor, imageRevisions };
  }

  private getRevisionTransform(revision: Image360Revision): Matrix4 {
    const transform = getTranslation();
    transform.multiply(getEulerRotation());
    return transform;

    function getEulerRotation(): Matrix4 {
      const { x, y, z } = revision.eulerRotation;
      const eulerRotation = new Euler(x, z, -y, 'XYZ');
      return new Matrix4().makeRotationFromEuler(eulerRotation);
    }

    function getTranslation(): Matrix4 {
      const { x, y, z } = revision.translation;
      return new Matrix4().makeTranslation(x, z, -y);
    }
  }

  private async getRevisionDescriptor(revision: Image360Revision): Promise<Image360Descriptor> {
    const faceDescriptors: Image360FileDescriptor[] = Object.entries(revision.cubeMap).map(
      ([faceKey, fileMetadata]) => {
        const face = faceKey as Image360FileDescriptor['face'];
        return { face, fileId: fileMetadata.id, mimeType: fileMetadata.mimeType };
      }
    );

    return {
      timestamp: revision.timeTaken ?? undefined,
      faceDescriptors
    };
  }
}
