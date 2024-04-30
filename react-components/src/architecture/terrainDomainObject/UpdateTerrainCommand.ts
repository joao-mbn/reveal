/*!
 * Copyright 2024 Cognite AS
 * BaseTool: Base class for the tool are used to interact with the render target.
 */
/* eslint-disable @typescript-eslint/class-literal-property-style */

import { RenderTargetCommand } from '../commands/RenderTargetCommand';
import { Vector3 } from 'three';
import { Range3 } from '../utilities/geometry/Range3';
import { createFractalRegularGrid2 } from '../utilities/geometry/createFractalRegularGrid2';
import { DEFAULT_TERRAIN_NAME, TerrainDomainObject } from './TerrainDomainObject';
import { Changes } from '../utilities/misc/Changes';
import { type Tooltip } from '../commands/BaseCommand';

export class UpdateTerrainCommand extends RenderTargetCommand {
  // ==================================================
  // OVERRIDES
  // ==================================================

  public override get icon(): string {
    return 'Refresh';
  }

  public override get tooltip(): Tooltip {
    return { key: 'UNKNOWN', fallback: 'Change the visible terrain' };
  }

  public get isEnabled(): boolean {
    const { renderTarget } = this;
    const { rootDomainObject } = renderTarget;
    const terrainDomainObject = rootDomainObject.getDescendantByTypeAndName(
      TerrainDomainObject,
      DEFAULT_TERRAIN_NAME
    );
    if (terrainDomainObject === undefined) {
      return false;
    }
    return terrainDomainObject.isVisible(renderTarget);
  }

  protected override invokeCore(): boolean {
    const { renderTarget } = this;
    const { rootDomainObject } = renderTarget;

    const terrainDomainObject = rootDomainObject.getDescendantByTypeAndName(
      TerrainDomainObject,
      DEFAULT_TERRAIN_NAME
    );
    if (terrainDomainObject === undefined) {
      return false;
    }
    if (!terrainDomainObject.isVisible(renderTarget)) {
      return false;
    }
    const range = new Range3(new Vector3(0, 0, 0), new Vector3(1000, 1000, 200));
    terrainDomainObject.grid = createFractalRegularGrid2(range);
    terrainDomainObject.notify(Changes.geometry);
    return true;
  }
}
