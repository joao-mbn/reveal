/*!
 * Copyright 2023 Cognite AS
 */

import glsl from 'glslify';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DepthModes,
  GLSL3,
  Group,
  LessEqualDepth,
  Points,
  RawShaderMaterial,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three';
import image360IconVert from './image360Icon.vert';
import image360IconFrag from './image360Icon.frag';

export type PointsMaterialParameters = {
  spriteTexture: Texture;
  minPixelSize: number;
  maxPixelSize: number;
  radius: number;
  colorTint?: Color;
  depthMode?: DepthModes;
  collectionOpacity?: number;
};

export class OverlayPointsObject extends Group {
  private readonly _geometry: BufferGeometry;
  private readonly _frontMaterial: RawShaderMaterial;
  private readonly _positionBuffer: Float32Array;
  private readonly _positionAttribute: BufferAttribute;
  private readonly _colorBuffer: Float32Array;
  private readonly _colorAttribute: BufferAttribute;

  constructor(maxNumberOfPoints: number, materialParameters: PointsMaterialParameters) {
    super();
    const geometry = new BufferGeometry();
    this._positionBuffer = new Float32Array(maxNumberOfPoints * 3);
    this._positionAttribute = new BufferAttribute(this._positionBuffer, 3);
    this._colorBuffer = new Float32Array(maxNumberOfPoints * 3).fill(1);
    this._colorAttribute = new BufferAttribute(this._colorBuffer, 3);
    geometry.setAttribute('position', this._positionAttribute);
    geometry.setAttribute('color', this._colorAttribute);
    geometry.setDrawRange(0, 0);

    const {
      spriteTexture,
      minPixelSize,
      maxPixelSize,
      radius,
      colorTint = new Color(1, 1, 1),
      depthMode = LessEqualDepth,
      collectionOpacity = 1
    } = materialParameters;

    const frontMaterial = this.createIconsMaterial(
      spriteTexture,
      collectionOpacity,
      depthMode,
      minPixelSize,
      maxPixelSize,
      radius,
      colorTint
    );
    const frontPoints = this.initializePoints(geometry, frontMaterial);
    this.add(frontPoints);

    this._geometry = geometry;
    this._frontMaterial = frontMaterial;
  }

  public setPoints(points: Vector3[], colors?: Color[]): void {
    if (colors && points.length !== colors?.length)
      throw new Error('Points positions and colors arrays must have the same length');

    for (let index = 0; index < points.length; index++) {
      this._positionBuffer[index * 3 + 0] = points[index].x;
      this._positionBuffer[index * 3 + 1] = points[index].y;
      this._positionBuffer[index * 3 + 2] = points[index].z;

      if (colors) {
        this._colorBuffer[index * 3 + 0] = colors[index].r;
        this._colorBuffer[index * 3 + 1] = colors[index].g;
        this._colorBuffer[index * 3 + 2] = colors[index].b;
      }
    }

    this._positionAttribute.updateRange = { offset: 0, count: points.length * 3 };
    this._positionAttribute.needsUpdate = true;
    this._colorAttribute.updateRange = { offset: 0, count: points.length * 3 };
    this._colorAttribute.needsUpdate = true;
    this._geometry.setDrawRange(0, points.length);

    this._geometry.computeBoundingBox();
    this._geometry.computeBoundingSphere();
  }

  public addPoints(points: Vector3[]): void {
    const lastDrawIndex = this._geometry.drawRange.count * 3;

    if (lastDrawIndex + points.length * 3 > this._positionBuffer.length) return;

    points.forEach((point, index) => {
      this._positionBuffer[lastDrawIndex + index * 3 + 0] = point.x;
      this._positionBuffer[lastDrawIndex + index * 3 + 1] = point.y;
      this._positionBuffer[lastDrawIndex + index * 3 + 2] = point.z;
    });
    this._positionAttribute.updateRange = { offset: 0, count: lastDrawIndex + points.length * 3 };
    this._positionAttribute.needsUpdate = true;
    this._geometry.setDrawRange(0, lastDrawIndex + points.length);
  }

  public dispose(): void {
    this._frontMaterial.dispose();
    this._geometry.dispose();
  }

  private initializePoints(geometry: BufferGeometry, frontMaterial: ShaderMaterial): Points {
    const frontPoints = createPoints(geometry, frontMaterial);
    frontPoints.onBeforeRender = renderer => {
      setUniforms(renderer, frontMaterial);
    };

    return frontPoints;

    function createPoints(geometry: BufferGeometry, material: ShaderMaterial): Points {
      const points = new Points(geometry, material);
      points.frustumCulled = false;
      points.renderOrder = 4;
      return points;
    }

    function setUniforms(renderer: WebGLRenderer, material: ShaderMaterial): void {
      renderer.getDrawingBufferSize(material.uniforms.renderSize.value);
      material.uniforms.renderDownScale.value = material.uniforms.renderSize.value.x / renderer.domElement.clientWidth;
    }
  }

  private createIconsMaterial(
    texture: Texture,
    collectionOpacity: number,
    depthFunction: DepthModes,
    minPixelSize: number,
    maxPixelSize: number,
    radius: number,
    colorTint: Color
  ): RawShaderMaterial {
    return new RawShaderMaterial({
      uniforms: {
        map: { value: texture },
        radius: { value: radius },
        colorTint: { value: colorTint },
        renderSize: { value: new Vector2(1, 1) },
        collectionOpacity: { value: collectionOpacity },
        renderDownScale: { value: 1 },
        pixelSizeRange: { value: new Vector2(minPixelSize, maxPixelSize) }
      },
      vertexShader: glsl(image360IconVert),
      fragmentShader: glsl(image360IconFrag),
      depthTest: true,
      depthWrite: true,
      depthFunc: depthFunction,
      glslVersion: GLSL3,
      transparent: true
    });
  }
}
