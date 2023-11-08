/*!
 * Copyright 2023 Cognite AS
 */

import { CogniteClient } from '@cognite/sdk';
import { Historical360ImageSet, Image360DescriptorProvider } from '../types';

export type DM360CollectionIdentifier = {
  space: string;
  image360CollectionExternalId: string;
};

export class Cdf360FdmProvider implements Image360DescriptorProvider<DM360CollectionIdentifier> {
  // private readonly _dmsSDK: DmsSDK;

  constructor(sdk: CogniteClient) {
    console.log(sdk);
    // this._dmsSDK = new DmsSDK(sdk);
  }
  public async get360ImageDescriptors(
    metadataFilter: DM360CollectionIdentifier,
    _: boolean
  ): Promise<Historical360ImageSet[]> {
    console.log(metadataFilter);
    return [];
    // const start = performance.now();
    // const collection = await this.fetchImageCollection(metadataFilter);
    // console.log(`Fetched collections in ${performance.now() - start} ms`);
    // console.log(collection.length);
    // return collection;
  }

  // private async fetchImageCollection(_: DM360CollectionIdentifier): Promise<Historical360ImageSet[]> {
  //   let hasNextPage = true;
  //   let nextCursors: Record<string, string> = {};

  //   const sets: Historical360ImageSet[] = [];

  //   while (hasNextPage) {
  //     const result = await this._dmsSDK.queryNodesAndEdges({ ...query, ...{ cursors: { ...nextCursors } } });
  //     // const result = await this._dmsSDK.queryNodesAndEdges(query);

  //     const { collection_360, images } = result.items;
  //     const collectionId = collection_360[0].space;
  //     const collectionProps = collection_360[0].properties;
  //     const collectionLabel = collectionProps.label;
  //     const hSets = images.map(image => this.getHistorical360ImageSet(collectionId, collectionLabel, image));
  //     sets.push(...hSets);

  //     hasNextPage = result.nextCursor !== undefined && result.nextCursor.images !== undefined && images.length >= 10000;
  //     if (hasNextPage) {
  //       nextCursors = {
  //         images: result.nextCursor?.images as string
  //       };
  //     }
  //   }

  //   return sets;
  // }

  // private getHistorical360ImageSet(
  //   collectionId: string,
  //   collectionLabel: string,
  //   image: NodeResult
  // ): Historical360ImageSet {
  //   const imageProps = image.properties;

  //   return {
  //     collectionId,
  //     collectionLabel,
  //     id: image.externalId,
  //     imageRevisions: [this.getImageRevision(imageProps)],
  //     label: imageProps.label,
  //     transform: this.getRevisionTransform(imageProps as any)
  //   };
  // }

  // private getImageRevision(imageProps: Record<string, any>): Image360Descriptor {
  //   return {
  //     faceDescriptors: getFaceDescriptors(),
  //     timestamp: imageProps.timeTaken
  //   };

  //   function getFaceDescriptors(): Image360FileDescriptor[] {
  //     return [
  //       {
  //         fileId: { externalId: imageProps.cubeMapFront },
  //         face: 'front',
  //         mimeType: 'image/jpeg'
  //       },
  //       {
  //         fileId: { externalId: imageProps.cubeMapBack },
  //         face: 'back',
  //         mimeType: 'image/jpeg'
  //       },
  //       {
  //         fileId: { externalId: imageProps.cubeMapLeft },
  //         face: 'left',
  //         mimeType: 'image/jpeg'
  //       },
  //       {
  //         fileId: { externalId: imageProps.cubeMapRight },
  //         face: 'right',
  //         mimeType: 'image/jpeg'
  //       },
  //       {
  //         fileId: { externalId: imageProps.cubeMapTop },
  //         face: 'top',
  //         mimeType: 'image/jpeg'
  //       },
  //       {
  //         fileId: { externalId: imageProps.cubeMapBottom },
  //         face: 'bottom',
  //         mimeType: 'image/jpeg'
  //       }
  //     ];
  //   }
  // }

  // private getRevisionTransform(revision: {
  //   translationX: number;
  //   translationY: number;
  //   translationZ: number;
  //   eulerRotationX: number;
  //   eulerRotationY: number;
  //   eulerRotationZ: number;
  // }): Matrix4 {
  //   const transform = getTranslation();
  //   transform.multiply(getEulerRotation());
  //   return transform;

  //   function getEulerRotation(): Matrix4 {
  //     const [x, y, z] = [revision.eulerRotationX, revision.eulerRotationY, revision.eulerRotationZ];
  //     const eulerRotation = new Euler(x, z, -y, 'XYZ');
  //     return new Matrix4().makeRotationFromEuler(eulerRotation);
  //   }

  //   function getTranslation(): Matrix4 {
  //     const [x, y, z] = [revision.translationX, revision.translationY, revision.translationZ];
  //     return new Matrix4().makeTranslation(x, z, -y);
  //   }
  // }
}
