/*!
 * Copyright 2024 Cognite AS
 */
/* eslint-disable @typescript-eslint/class-literal-property-style */

import { RenderTargetCommand } from '../commands/RenderTargetCommand';
import { type Tooltip } from '../commands/BaseCommand';

export class FitViewCommand extends RenderTargetCommand {
  public override get icon(): string {
    return 'ExpandAlternative';
  }

  public override get tooltip(): Tooltip {
    return { key: 'FIT_VIEW_TOOLTIP', fallback: 'Fit view' };
  }

  protected override invokeCore(): boolean {
    const { renderTarget } = this;
    const { viewer } = renderTarget;

    const boundingBox = viewer.getSceneBoundingBox();
    if (boundingBox.isEmpty()) {
      return false;
    }
    viewer.fitCameraToBoundingBox(boundingBox);
    return true;
  }
}