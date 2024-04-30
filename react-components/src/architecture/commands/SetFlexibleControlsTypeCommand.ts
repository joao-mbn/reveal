/*!
 * Copyright 2024 Cognite AS
 */
/* eslint-disable @typescript-eslint/class-literal-property-style */

import { RenderTargetCommand } from './RenderTargetCommand';
import { type RevealRenderTarget } from '../renderTarget/RevealRenderTarget';
import { FlexibleControlsType } from '@cognite/reveal';
import { type Tooltip } from './BaseCommand';

export class SetFlexibleControlsTypeCommand extends RenderTargetCommand {
  private readonly _controlsType: FlexibleControlsType;

  // ==================================================
  // CONSTRUCTOR
  // ==================================================

  public constructor(controlsType: FlexibleControlsType) {
    super();
    this._controlsType = controlsType;
  }

  public override attach(renderTarget: RevealRenderTarget): void {
    super.attach(renderTarget);
    const { cameraManager } = renderTarget;
    cameraManager.addControlsTypeChangeListener(this._controlsTypeChangeHandler);
  }

  // ==================================================
  // OVERRIDES
  // ==================================================

  public override dispose(): void {
    super.dispose();
    const { cameraManager } = this.renderTarget;
    cameraManager.removeControlsTypeChangeListener(this._controlsTypeChangeHandler);
  }

  public override get name(): string {
    return this.tooltip.fallback;
  }

  public override get icon(): string {
    switch (this._controlsType) {
      case FlexibleControlsType.FirstPerson:
        return 'Plane';
      case FlexibleControlsType.Orbit:
        return 'Circle';
      case FlexibleControlsType.OrbitInCenter:
        return 'Coordinates';
      default:
        return 'Error';
    }
  }

  public override get tooltip(): Tooltip {
    switch (this._controlsType) {
      case FlexibleControlsType.FirstPerson:
        return { key: 'CONTROLS_TYPE_FIRST_PERSON', fallback: 'Fly' };
      case FlexibleControlsType.Orbit:
        return { key: 'CONTROLS_TYPE_ORBIT', fallback: 'Orbit' };
      case FlexibleControlsType.OrbitInCenter:
        return { key: 'CONTROLS_TYPE_ORBIT_IN_CENTER', fallback: 'Center Orbit' };
      default:
        return super.tooltip;
    }
  }

  public override get isCheckable(): boolean {
    return true;
  }

  public override get isChecked(): boolean {
    const { renderTarget } = this;
    const { cameraManager } = renderTarget;
    return cameraManager.controlsType === this._controlsType;
  }

  protected override invokeCore(): boolean {
    const { renderTarget } = this;
    const { cameraManager } = renderTarget;
    if (cameraManager.controlsType === this._controlsType) {
      return false;
    }
    cameraManager.controlsType = this._controlsType;
    return true;
  }

  // ==================================================
  // INSTANCE METHODS
  // ==================================================

  private readonly _controlsTypeChangeHandler = (_newControlsType: FlexibleControlsType): void => {
    this.update();
  };
}