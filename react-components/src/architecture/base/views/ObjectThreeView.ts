/*!
 * Copyright 2024 Cognite AS
 */
/* eslint-disable @typescript-eslint/class-literal-property-style */

import { Box3, Group, Mesh, type Object3D } from 'three';
import { ThreeView } from './ThreeView';
import { type DomainObjectChange } from '../domainObjectsHelpers/DomainObjectChange';
import { Changes } from '../domainObjectsHelpers/Changes';
import {
  type CustomObjectIntersectInput,
  type CustomObjectIntersection,
  type ICustomObject
} from '@cognite/reveal';
import { type DomainObjectIntersection } from '../domainObjectsHelpers/DomainObjectIntersection';

/**
 * Represents an abstract class for a Three.js view that renders an Object3D.
 * This class extends the ThreeView class.
 * @remarks
 * You only have to override createObject3D() to create the object to be render.
 */

export abstract class ObjectThreeView extends ThreeView implements ICustomObject {
  // ==================================================
  // INSTANCE FIELDS
  // ==================================================

  protected readonly _group: Group = new Group();

  protected get isEmpty(): boolean {
    return this._group.children.length === 0;
  }

  // ==================================================
  // IMPLEMENTATION of ICustomObject
  // ==================================================

  public get object(): Object3D {
    if (this.isEmpty) {
      this.makeChildern();
    }
    return this._group;
  }

  public get shouldPick(): boolean {
    return true; // To be overridden
  }

  public get shouldPickBoundingBox(): boolean {
    return true; // To be overridden
  }

  public get isPartOfBoundingBox(): boolean {
    return true; // To be overridden
  }

  public getBoundingBox(target: Box3): Box3 {
    target.copy(this.boundingBox);
    return target;
  }

  public intersectIfCloser(
    intersectInput: CustomObjectIntersectInput,
    closestDistance: number | undefined
  ): undefined | CustomObjectIntersection {
    const intersection = intersectInput.raycaster.intersectObject(this.object);
    if (intersection.length === 0) {
      return undefined;
    }
    const { point, distance } = intersection[0];
    if (closestDistance !== undefined && closestDistance < distance) {
      return undefined;
    }
    if (!intersectInput.isVisible(point)) {
      return undefined;
    }
    const customObjectIntersection: DomainObjectIntersection = {
      type: 'customObject',
      point,
      distanceToCamera: distance,
      userData: intersection[0],
      customObject: this,
      domainObject: this.domainObject
    };
    if (this.shouldPickBoundingBox) {
      const boundingBox = this.boundingBox;
      if (!boundingBox.isEmpty()) {
        customObjectIntersection.boundingBox = this.boundingBox;
      }
    }
    return customObjectIntersection;
  }

  // ==================================================
  // OVERRIDES of BaseView
  // ==================================================

  public initialize(): void {
    super.initialize();
    if (this.isEmpty) {
      this.makeChildern();
    }
    const { viewer } = this.renderTarget;
    viewer.addCustomObject(this);
  }

  public override update(change: DomainObjectChange): void {
    super.update(change);
    if (change.isChanged(Changes.geometry)) {
      this.removeChildren();
      this.invalidateRenderTarget();
    }
  }

  public override clearMemory(): void {
    super.clearMemory();
    this.removeChildren();
  }

  public override beforeRender(): void {
    super.beforeRender();
    if (this.isEmpty) {
      this.makeChildern();
    }
  }

  public override dispose(): void {
    this.removeChildren();
    const { viewer } = this.renderTarget;
    viewer.removeCustomObject(this);
    super.dispose();
  }

  // ==================================================
  // OVERRIDES of ThreeView
  // ==================================================

  public override calculateBoundingBox(): Box3 {
    if (this.object === undefined) {
      return new Box3().makeEmpty();
    }
    const boundingBox = new Box3();
    boundingBox.setFromObject(this.object, true);
    return boundingBox;
  }

  // ==================================================
  // VIRTUAL METHODS
  // ==================================================

  protected abstract addChildren(): void;

  // ==================================================
  // INSTANCE METHODS
  // ==================================================

  private makeChildern(): void {
    if (!this.isEmpty) {
      throw Error('Can make the object when it is already made');
    }
    this.addChildren();
  }

  protected removeChildren(): void {
    if (this.isEmpty) {
      return;
    }
    disposeMaterials(this._group);
    this._group.remove(...this._group.children);
  }

  protected addChild(child: Object3D | undefined): void {
    if (child === undefined) {
      return;
    }
    this._group.add(child);
  }

  protected removeChild(child: Object3D | undefined): void {
    if (child === undefined) {
      return;
    }
    disposeMaterials(child);
    this._group.remove(child);
  }
}

function disposeMaterials(object: Object3D): void {
  if (object === undefined) {
    return undefined;
  }
  if (object instanceof Group) {
    for (const child of object.children) {
      disposeMaterials(child);
    }
  }
  if (object instanceof Mesh) {
    const material = object.material;
    if (material !== null && material !== undefined) {
      const texture = material.texture;
      if (texture !== undefined && texture !== null) {
        texture.dispose();
      }
      material.dispose();
    }
  }
}