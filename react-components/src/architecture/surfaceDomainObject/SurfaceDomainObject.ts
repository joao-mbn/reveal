/*!
 * Copyright 2024 Cognite AS
 */

import { ColorType } from '../utilities/colors/ColorType';
import { VisualDomainObject } from '../domainObjects/VisualDomainObject';
import { SurfaceRenderStyle } from './SurfaceRenderStyle';
import { type RegularGrid2 } from '../utilities/geometry/RegularGrid2';
import { type RenderStyle } from '../utilities/misc/RenderStyle';
import { type ThreeView } from '../views/ThreeView';
import { SurfaceThreeView } from './SurfaceThreeView';

export class SurfaceDomainObject extends VisualDomainObject {
  // ==================================================
  // INSTANCE FIELDS
  // ==================================================

  private _surface: RegularGrid2 | undefined = undefined;

  // ==================================================
  // INSTANCE PROPERTIES
  // ==================================================

  public get surface(): RegularGrid2 | undefined {
    return this._surface;
  }

  public set surface(value: RegularGrid2 | undefined) {
    this._surface = value;
  }

  public get renderStyle(): SurfaceRenderStyle | undefined {
    return this.getRenderStyle() as SurfaceRenderStyle;
  }

  // ==================================================
  // OVERRIDES of DomainObject
  // ==================================================

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public override get typeName(): string {
    return 'Surface';
  }

  public override createRenderStyle(): RenderStyle | undefined {
    return new SurfaceRenderStyle();
  }

  public override verifyRenderStyle(style: RenderStyle): void {
    if (!(style instanceof SurfaceRenderStyle)) {
      return;
    }
    const { surface } = this;
    if (surface === undefined) {
      return;
    }
    const { boundingBox } = surface;
    const zRange = boundingBox.z;
    if (zRange.isEmpty || !zRange.hasSpan) {
      return;
    }
    if (
      style.increment <= 0 ||
      style.increment > zRange.delta ||
      style.increment < zRange.delta * 200
    ) {
      style.increment = zRange.getBestInc();
    }
  }

  // ==================================================
  // OVERRIDES of VisualDomainObject
  // ==================================================

  protected override createThreeView(): ThreeView | undefined {
    return new SurfaceThreeView();
  }

  // ==================================================
  // INSTANCE METHODS
  // ==================================================

  public supportsColorType(colorType: ColorType, solid: boolean): boolean {
    switch (colorType) {
      case ColorType.Specified:
      case ColorType.Parent:
      case ColorType.Black:
      case ColorType.White:
        return true;

      case ColorType.ColorMap:
        return solid;

      default:
        return false;
    }
  }
}
