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

import { ColorType } from "@/Core/Enums/ColorType";
import { BaseStyle } from "@/Core/Styles/BaseStyle";

export class ContoursStyle extends BaseStyle
{
  //==================================================
  // INSTANCE FIELDS
  //==================================================

  public colorType = ColorType.Black;
  public inc = 20;

  //==================================================
  // CONSTRUCTORS
  //==================================================

  public constructor() { super(); }

  public /*copy constructor*/ clone(): ContoursStyle
  {
    const style = new ContoursStyle();
    style.colorType = this.colorType;
    style.inc = this.inc;
    return style;
  }

}



