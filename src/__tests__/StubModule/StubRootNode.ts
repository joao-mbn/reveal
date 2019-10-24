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

import { BaseRootNode } from "../../Core/Nodes/BaseRootNode";
import { StubTargetNode } from "./StubTargetNode";

export class StubRootNode extends BaseRootNode
{
  //==================================================
  // CONSTRUCTORS
  //==================================================

  public constructor() { super(); }

  //==================================================
  // OVERRIDES of Identifiable
  //==================================================

  public /*override*/ get className(): string { return StubRootNode.name; }
  public /*override*/ isA(className: string): boolean { return className === StubRootNode.name || super.isA(className); }

  //==================================================
  // OVERRIDES of BaseNode
  //==================================================

  public /*override*/ get typeName(): string { return "Stub root" }

  protected /*override*/ initializeCore(): void
  {
    super.initializeCore();

    const target = new StubTargetNode();
    target.isActive = true;

    this.targetFolder.addChild(target)

    if (!this.activeTargetIdAccessor)
      throw Error("target is not added properly");
  }
}