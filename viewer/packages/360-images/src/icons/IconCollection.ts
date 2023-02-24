/*!
 * Copyright 2023 Cognite AS
 */

import { Camera, CanvasTexture, Matrix4, Texture, Vector3, WebGLRenderer } from 'three';
import { BeforeSceneRenderedDelegate, EventTrigger, SceneHandler } from '@reveal/utilities';
import { Image360Icon } from './Image360Icon';
import { InstancedIconSprite } from './InstancedIconSprite';
import { IconOctree } from './IconOctree';
import { OctreeHelper } from 'sparse-octree';

export class Image360CollectionIcons {
  private readonly MIN_PIXEL_SIZE = 16;
  private readonly MAX_PIXEL_SIZE = 64;
  private readonly _sceneHandler: SceneHandler;
  private readonly _hoverIconTexture: CanvasTexture;
  private readonly _onRenderTrigger: EventTrigger<(renderer: WebGLRenderer, camera: Camera) => void>;
  private readonly _sharedTexture: Texture;
  private readonly _icons: Image360Icon[];
  private readonly _iconsSprite: InstancedIconSprite;

  get icons(): Image360Icon[] {
    return this._icons;
  }

  constructor(
    points: Vector3[],
    sceneHandler: SceneHandler,
    onBeforeSceneRendered: EventTrigger<BeforeSceneRenderedDelegate>
  ) {
    const sharedTexture = this.createOuterRingsTexture();
    this._onRenderTrigger = new EventTrigger();
    const iconsSprites = new InstancedIconSprite(
      points.length,
      sharedTexture,
      this.MIN_PIXEL_SIZE,
      this.MAX_PIXEL_SIZE
    );
    iconsSprites.setPoints(points);

    this._hoverIconTexture = this.createHoverIconTexture();
    this._sharedTexture = sharedTexture;
    this._icons = this.initializeImage360Icons(points, sceneHandler, onBeforeSceneRendered);

    const octreeBounds = IconOctree.getMinimalOctreeBoundsFromIcons(this._icons);
    const octree = new IconOctree(this._icons, octreeBounds, 4);

    const clusterSprites = new InstancedIconSprite(
      points.length,
      this.createClusterTexture(),
      this.MIN_PIXEL_SIZE * 8,
      this.MAX_PIXEL_SIZE * 8
    );
    const projection = new Matrix4();
    onBeforeSceneRendered.subscribe(({ camera }) => {
      const a = octree.getLODByScreenArea(
        0.1,
        projection.copy(camera.projectionMatrix).multiply(camera.matrixWorldInverse)
      );

      const nodes = [...a];
      const clusterPoints = nodes.filter(p => p.data === null).map(p => octree.getPointCenterOfNode(p)!);
      clusterSprites.setPoints(clusterPoints);
      const leafData = nodes.filter(p => p.data !== null).flatMap(p => p.data.data.map(q => q.position));
      iconsSprites.setPoints(leafData);
    });

    sceneHandler.addCustomObject(new OctreeHelper(octree));
    this._sceneHandler = sceneHandler;
    this._iconsSprite = iconsSprites;

    sceneHandler.addCustomObject(iconsSprites);
    sceneHandler.addCustomObject(clusterSprites);
  }

  private initializeImage360Icons(
    points: Vector3[],
    sceneHandler: SceneHandler,
    onBeforeSceneRendered: EventTrigger<BeforeSceneRenderedDelegate>
  ): Image360Icon[] {
    return points.map(
      point =>
        new Image360Icon(
          point,
          this._hoverIconTexture,
          sceneHandler,
          this.MIN_PIXEL_SIZE,
          this.MAX_PIXEL_SIZE,
          onBeforeSceneRendered
        )
    );
  }

  public dispose(): void {
    this._sceneHandler.removeCustomObject(this._iconsSprite);
    this._onRenderTrigger.unsubscribeAll();
    this._sharedTexture.dispose();
  }

  private createClusterTexture(): CanvasTexture {
    const canvas = document.createElement('canvas');
    const textureSize = this.MAX_PIXEL_SIZE * 10;
    canvas.width = textureSize;
    canvas.height = textureSize;

    const halfTextureSize = textureSize / 2;

    const context = canvas.getContext('2d')!;
    drawClusterRings();
    drawInnerCircle();
    drawOuterCircle();

    return new CanvasTexture(canvas);

    function drawClusterRings() {
      context.beginPath();
      context.lineWidth = textureSize / 88;
      context.strokeStyle = '#FFFFFF';
      context.arc(halfTextureSize, halfTextureSize, (halfTextureSize * 36) / 44, 0, 2 * Math.PI);
      context.stroke();

      context.beginPath();
      context.lineWidth = textureSize / 88;
      context.strokeStyle = '#FFFFFF';
      context.arc(halfTextureSize, halfTextureSize, (halfTextureSize * 40) / 44, 0, 2 * Math.PI);
      context.stroke();

      context.beginPath();
      context.lineWidth = textureSize / 88;
      context.strokeStyle = '#FFFFFF';
      context.arc(halfTextureSize, halfTextureSize, halfTextureSize - context.lineWidth / 2, 0, 2 * Math.PI);
      context.stroke();
    }

    function drawOuterCircle() {
      context.beginPath();
      context.lineWidth = textureSize / 22;
      context.strokeStyle = '#FFFFFF';
      context.arc(halfTextureSize, halfTextureSize, (halfTextureSize * 30) / 44, 0, 2 * Math.PI);
      context.stroke();
    }

    function drawInnerCircle() {
      context.beginPath();
      context.lineWidth = textureSize / 11;
      context.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      context.arc(halfTextureSize, halfTextureSize, (halfTextureSize * 24) / 44, 0, 2 * Math.PI);
      context.shadowColor = 'red';
      context.stroke();
    }
  }

  private createOuterRingsTexture(): CanvasTexture {
    const canvas = document.createElement('canvas');
    const textureSize = this.MAX_PIXEL_SIZE;
    canvas.width = textureSize;
    canvas.height = textureSize;

    const context = canvas.getContext('2d')!;
    drawInnerCircle();
    drawOuterCircle();

    return new CanvasTexture(canvas);

    function drawOuterCircle() {
      context.beginPath();
      context.lineWidth = textureSize / 16;
      context.strokeStyle = '#FFFFFF';
      context.arc(textureSize / 2, textureSize / 2, textureSize / 2 - context.lineWidth / 2 - 2, 0, 2 * Math.PI);
      context.stroke();
    }

    function drawInnerCircle() {
      context.beginPath();
      context.lineWidth = textureSize / 8;
      context.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      context.arc(textureSize / 2, textureSize / 2, textureSize / 2 - context.lineWidth, 0, 2 * Math.PI);
      context.shadowColor = 'red';
      context.stroke();
    }
  }

  private createHoverIconTexture(): CanvasTexture {
    const canvas = document.createElement('canvas');
    const textureSize = this.MAX_PIXEL_SIZE;
    canvas.width = textureSize;
    canvas.height = textureSize;

    const context = canvas.getContext('2d')!;
    drawHoverSelector();

    return new CanvasTexture(canvas);

    function drawHoverSelector() {
      const outerCircleLineWidth = textureSize / 16;
      const innerCircleLineWidth = textureSize / 8;
      context.beginPath();
      context.fillStyle = '#FC2574';
      context.arc(
        textureSize / 2,
        textureSize / 2,
        textureSize / 2 - outerCircleLineWidth - 2 * innerCircleLineWidth,
        0,
        2 * Math.PI
      );
      context.fill();
    }
  }
}
