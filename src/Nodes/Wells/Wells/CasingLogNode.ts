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

import { FloatLog } from "@/Nodes/Wells/Logs/FloatLog";
import { BaseLogNode } from "@/Nodes/Wells/Wells/BaseLogNode";
import { WellLogType } from "@/Nodes/Wells/Logs/WellLogType";
import CasingLogNodeIcon from "@images/Nodes/CasingLogNode.png";

export class CasingLogNode extends BaseLogNode
{
  //==================================================
  // INSTANCE PROPERTIES
  //==================================================

  public get data(): FloatLog | null { return this.anyData as FloatLog; }
  public set data(value: FloatLog | null) { this.anyData = value; }

  //==================================================
  // CONSTRUCTORS
  //==================================================

  public constructor() { super(); }

  //==================================================
  // OVERRIDES of Identifiable
  //==================================================

  public /*override*/ get className(): string { return CasingLogNode.name; }
  public /*override*/ isA(className: string): boolean { return className === CasingLogNode.name || super.isA(className); }

  //==================================================
  // OVERRIDES of BaseNode
  //==================================================

  public /*override*/ get typeName(): string { return "Casing" }

  public /*override*/ getIcon(): string { return CasingLogNodeIcon }

  //==================================================
  // OVERRIDES of BaseLogNode
  //==================================================

  public /*override*/  get wellLogType(): WellLogType { return WellLogType.Casing; }
}