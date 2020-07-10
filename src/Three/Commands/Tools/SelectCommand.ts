
import { ThreeRenderTargetNode } from "@/Three/Nodes/ThreeRenderTargetNode";
import { ToolCommand } from "@/Three/Commands/Tools/ToolCommand";
import SelectCommandIcon from "@images/Commands/SelectCommand.png"

export class SelectCommand extends ToolCommand
{
  //==================================================
  // CONSTRUCTORS
  //==================================================

  public constructor(target: ThreeRenderTargetNode | null = null)
  {
    super(target);
  }

  //==================================================
  // OVERRIDES of BaseCommand
  //==================================================

  public /*override*/ getName(): string { return "Select or pick" }
  public /*override*/ getIcon(): string { return SelectCommandIcon; }

  //==================================================
  // OVERRIDES of ToolCommand
  //==================================================

  public /*override*/ overrideLeftButton(): boolean { return true; }

  public /*override*/ onMouseClick(event: MouseEvent): void
  {
    const target = this.target;
    if (!target)
      return;

    target.viewInfo.clearItems();
    const pixel = target.getMouseRelativePosition(event);
    const intersection = target.getIntersection(pixel);
    if (!intersection)
      return;

    const view = target.getViewByObject(intersection.object);
    if (!view)
      return;

    const preCount = target.viewInfo.items.length;
    view.onMouseClick(intersection)
    const postCount = target.viewInfo.items.length;
    if (preCount > 0 || postCount > 0)
      target.invalidate();
  }

  public /*override*/ onMouseMove(event: MouseEvent): void
  {
    const target = this.target;
    if (!target)
      return;

    const pixel = target.getMouseRelativePosition(event);
    const intersection = target.getIntersection(pixel);
    if (!intersection)
      return;

    const node = target.getNodeByObject(intersection.object);
    if (!node)
      return;
  }
}


