import NodeUtils from "@/UserInterface/utils/NodeUtils";
import UseProperty from "@/Core/Property/Base/UseProperty";
import ExpanderProperty from "@/Core/Property/Concrete/Folder/ExpanderProperty";

export default class SettingsNodeUtils
{
  public static setPropertyValue<T>(id: string, value: T): void
  {
    const property = NodeUtils.getPropertyById(id);

    if (property)
    {
      (property as UseProperty<T>).value = value;
    }
    else
    {
      console.log("Couldn't find property!");
    }
  }

  public static setPropertyFolderExpand(id: string, expand: boolean): void
  {
    const property = NodeUtils.getPropertyById(id);

    if (property instanceof ExpanderProperty)
      property.expanded = expand;
    else
    {
      console.log("Couldn't find property!");
    }
  }
  
  public static setPropertyUse(id: string, useProperty: boolean): void
  {
    const property = NodeUtils.getPropertyById(id);

    if (property instanceof UseProperty)
    {
      property.use = useProperty;
    }
    else
    {
      console.log("Couldn't find property!", id);
    }
  }

}
