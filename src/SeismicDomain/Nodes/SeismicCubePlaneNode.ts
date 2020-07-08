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

import { Range3 } from "@/Core/Geometry/Range3";
import { BaseRenderStyle } from "@/Core/Styles/BaseRenderStyle";
import { TargetId } from "@/Core/Primitives/TargetId";
import { SurfaceRenderStyle } from "@/Nodes/Misc/SurfaceRenderStyle";

import SurfaceNodeIcon from "@images/Nodes/SurfaceNode.png";
import { DataNode } from "@/Core/Nodes/DataNode";
import { SeismicCube } from '@/SeismicDomain/Data/SeismicCube';

export class SeismicCubePlaneNode extends DataNode
{
  //==================================================
  // STATIC FIELDS
  //==================================================

  static className = "SeismicCubePlaneNode";

  //==================================================
  // INSTANCE FIELDS
  //==================================================

  public perpendicularAxis = 0;
  public perpendicularIndexValue = -1; // Not used if arbitrary plane

  public get isArbitrary(): boolean { return this.perpendicularAxis < 0; }
  public get isHorizontal(): boolean { return this.perpendicularAxis == 2; }

  public get shortName(): string
  {
    switch (this.perpendicularAxis)
    {
      case 0: return "I"; // Inline
      case 1: return "X"; // X-line
      case 2: return "T"; //Time slice
      default: return "A";
    }
  }

  public get generalName(): string
  {
    switch (this.perpendicularAxis)
    {
      case 0: return "Inline";
      case 1: return "X-line";
      case 2: return "Time Slice";
      default: return "Arbitrary";
    }
  }

  //==================================================
  // CONSTRUCTORS
  //==================================================

  public constructor() { super(); }

  //==================================================
  // INSTANCE PROPERTIES
  //==================================================

  public get data(): SeismicCube | null { return this.anyData; }
  public set data(value: SeismicCube | null) { this.anyData = value; }
  public get renderStyle(): SurfaceRenderStyle | null { return this.getRenderStyle() as SurfaceRenderStyle; }

  //==================================================
  // OVERRIDES of Identifiable
  //==================================================

  public /*override*/ get className(): string { return SeismicCubePlaneNode.className; }
  public /*override*/ isA(className: string): boolean { return className === SeismicCubePlaneNode.className || super.isA(className); }

  //==================================================
  // OVERRIDES of BaseNode
  //==================================================

  public /*override*/ get typeName(): string { return "Plane" }
  public /*override*/ getName(): string
  {
    if (this.perpendicularAxis < 0 || this.perpendicularAxis >= 3)
      return this.generalName;
    return `${this.generalName} ${this.perpendicularIndexValue}`;
  }

  public /*override*/ getIcon(): string { return SurfaceNodeIcon }

  public /*override*/ get boundingBox(): Range3 { return this.data ? this.data.getRange() : new Range3(); }

  public /*override*/ createRenderStyle(targetId: TargetId): BaseRenderStyle | null
  {
    return new SurfaceRenderStyle(targetId);
  }
}