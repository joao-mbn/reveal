import { ThreeRenderTargetNode } from "@/Three/Nodes/ThreeRenderTargetNode";
import { ThreeRenderTargetCommand } from "@/Three/Commands/ThreeRenderTargetCommand";
import { Util } from "@/Core/Primitives/Util";

export class ZScaleCommand extends ThreeRenderTargetCommand
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

  protected /*override*/ getTooltipCore(): string { return "Set Scale Z"; }

  public /*override*/ getName(): string { return "Scale Z"; }
  public /*override*/ get isDropdown(): boolean { return true; }
  public /*override*/ get dropdownOptions(): string[] { return ["0.1", "0.25", "0.5", "1", "2", "3", "4", "5", "7.5", "10", "20", "50", "100"]; }
  public /*override*/ get value(): string { return !this.target ? "" : this.target.zScale.toString(); }
  protected /*override*/ invokeCore(): boolean { return true; }
  protected /*override*/ invokeValueCore(value: string): boolean
  {
    if (!this.target)
      return false;

    this.target.zScale = Util.getNumber(value);
    return true;
  }
}
