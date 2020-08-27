import { ColorType } from "@/Core/Enums/ColorType";
import ValueProperty from "@/Core/Property/Base/ValueProperty";
import IPropertyParams from "@/Core/Property/Base/IPropertyParams";

export class ColorTypeProperty extends ValueProperty<ColorType>
{
  //==================================================
  // CONSTRUCTORS
  //==================================================

  public constructor(params: IPropertyParams<ColorType>) 
  {
    super(params);
    this.options = Object(ColorType);
  }

  public getOptionIcon(option: ColorType): string
  {
    switch (option)
    {
      case ColorType.Black:
      default: return "";
    }
  }
}
