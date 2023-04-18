/*!
 * Copyright 2022 Cognite AS
 */

import { Image360Entity } from '../entity/Image360Entity';
import { Image360RevisionEntity } from '../entity/Image360RevisionEntity';
import pull from 'lodash/pull';
import findLast from 'lodash/findLast';
import find from 'lodash/find';
import remove from 'lodash/remove';
import { Log } from '@reveal/logger';

export type DownloadRequest = {
  entity: Image360Entity;
  revision: Image360RevisionEntity;
  completed: Promise<void>;
  abort: () => void;
};

export type Loaded360Image = {
  entity: Image360Entity;
  revision: Image360RevisionEntity;
};

export class Image360LoadingCache {
  private readonly _loaded360Images: Loaded360Image[];
  private readonly _inProgressDownloads: DownloadRequest[];
  private _lockedDownload: Image360RevisionEntity | undefined;

  get cachedRevisions(): Image360RevisionEntity[] {
    return this._loaded360Images.map(image => {
      return image.revision;
    });
  }

  get currentlyLoadingEntities(): DownloadRequest[] {
    return this._inProgressDownloads;
  }

  public getDownloadInProgress(revision: Image360RevisionEntity): DownloadRequest | undefined {
    const inProgressDownload = this._inProgressDownloads.find(download => {
      return download.revision === revision;
    });
    return inProgressDownload;
  }

  constructor(private readonly _imageCacheSize = 5, private readonly _downloadCacheSize = 3) {
    this._loaded360Images = [];
    this._inProgressDownloads = [];
  }

  public async cachedPreload(
    entity: Image360Entity,
    revision: Image360RevisionEntity,
    lockDownload = false
  ): Promise<void> {
    if (this._loaded360Images.find(image => image.revision === revision)) {
      return;
    }

    if (lockDownload) {
      this._lockedDownload = revision;
    }

    const inProgressDownload = this.getDownloadInProgress(revision);
    if (inProgressDownload !== undefined) {
      return inProgressDownload.completed;
    }

    if (this._inProgressDownloads.length >= this._downloadCacheSize) {
      this.abortLastRecentlyReqestedRevision();
    }

    const { signal, abort } = this.createAbortSignal();
    const completed = revision.loadTextures(signal);

    this._inProgressDownloads.push({
      entity,
      revision,
      completed,
      abort
    });

    const revisionTextureReady = await completed
      .catch(e => {
        return Promise.reject(e);
      })
      .then(
        () => {
          this.addRevisionToCache(entity, revision);
        },
        reason => {
          if (signal.aborted || reason === 'Aborted') {
            Log.info('360 Image download aborted: ' + reason);
          } else {
            throw new Error('Failed to load 360 image: ' + reason);
          }
        }
      )
      .finally(() => {
        if (this._lockedDownload === revision) {
          this._lockedDownload = undefined;
        }
        remove(this._inProgressDownloads, download => {
          return download.revision === revision;
        });
      });

    return revisionTextureReady;
  }

  public async purge(entity: Image360Entity): Promise<void> {
    const { _inProgressDownloads, _loaded360Images } = this;
    entity.getRevisions().forEach(revision => purgeRevision(revision));

    function purgeRevision(revision: Image360RevisionEntity): void {
      _inProgressDownloads
        .filter(download => {
          download.revision === revision;
        })
        .forEach(download => {
          pull(_inProgressDownloads, download);
          download.abort();
        });

      remove(_loaded360Images, image => {
        return image.revision === revision;
      });
    }
  }

  private addRevisionToCache(entity: Image360Entity, revision: Image360RevisionEntity) {
    if (this._loaded360Images.length === this._imageCacheSize) {
      const imageToPurge = findLast(
        this._loaded360Images,
        image => !this.isRevisionVisible(image.entity, image.revision)
      );
      if (imageToPurge === undefined) {
        throw new Error('Unable to purge 360 image from cache due to too many visible instances');
      }
      pull(this._loaded360Images, imageToPurge);
      imageToPurge.revision.dispose();
      if (!imageToPurge.entity.image360Visualization.visible) imageToPurge.entity.unloadImage();
    }
    this._loaded360Images.unshift({ entity, revision });
  }

  private abortLastRecentlyReqestedRevision() {
    const download = find(
      this._inProgressDownloads,
      download =>
        download.revision !== this._lockedDownload && !this.isRevisionVisible(download.entity, download.revision)
    );
    if (download) {
      pull(this._inProgressDownloads, download);
      download.abort();
    }
  }

  private createAbortSignal() {
    const abortController = new AbortController();
    const abort = () => {
      abortController.abort();
    };
    return { signal: abortController.signal, abort };
  }

  private isRevisionVisible(entity: Image360Entity, revision: Image360RevisionEntity): boolean {
    return entity.getActiveRevision() === revision && entity.image360Visualization.visible;
  }
}
