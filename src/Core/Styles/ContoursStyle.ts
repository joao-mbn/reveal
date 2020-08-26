//=====================================================================================
// This code is part of the Reveal Viewer architecture, made by Nils Petter Fremming
// in October 2019. It is suited for flexible and customizable visualization of
// multiple dataset in multiple viewers.
//
// It is a C# to typescript port from the Modern Model architecture,
// based on the experience when building Petrel.
//
// NOTE: Always keep the code according to the code style already applied in the file.
// Put new code under the correct section, and make more sections if needed.
// Copyright (c) Cognite AS. All rights reserved.
//=====================================================================================

import * as Lodash from "lodash";
import { ColorType } from "@/Core/Enums/ColorType";
import { BaseStyle } from "@/Core/Styles/BaseStyle";
import BasePropertyFolder from "@/Core/Property/Base/BasePropertyFolder";
import { NumberSelectProperty } from "@/Core/Property/Concrete/Property/NumberSelectProperty";
import { ColorTypeProperty } from "@/Core/Property/Concrete/Property/ColorTypeProperty";

export class ContoursStyle extends BaseStyle
{
  //==================================================
  // INSTANCE FIELDS
  //==================================================

  public colorType = new ColorTypeProperty({ name: "Contour color", value: ColorType.Black });
  public increment = new NumberSelectProperty({ name: "Increment", value: 0 });

  //==================================================
  // CONSTRUCTORS
  //==================================================

  public constructor() { super(); }

  //==================================================
  // OVERRIDES of BaseStyle
  //==================================================

  public /*override*/ clone(): BaseStyle { return Lodash.cloneDeep<ContoursStyle>(this); }
  protected /*override*/ populateCore(folder: BasePropertyFolder)
  {
    folder.addChild(this.colorType);
    folder.addChild(this.increment);
  }
}
