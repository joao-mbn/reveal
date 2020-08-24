import { PropertyType } from "@/Core/Enums/PropertyType";
import UseProperty from "@/Core/Property/Base/UseProperty";
import IPropertyParams from "@/Core/Property/Base/IPropertyParams";

export class SelectProperty extends UseProperty<unknown>
{
  //==================================================
  // INSTANCE METHODS
  //==================================================

  public addOption(name: unknown): void
  {
    if (!this.options)
      this.options = [];
    this.options.push(name);
  }

  //==================================================
  // CONSTRUCTORS
  //==================================================

  public constructor(params: IPropertyParams<unknown>)
  {
    super(params);
  }
  
  //==================================================
  // OVERRIDES of BaseProperty
  //==================================================

  public getType(): PropertyType { return PropertyType.Select; }
}
