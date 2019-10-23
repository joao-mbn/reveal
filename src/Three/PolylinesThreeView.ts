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

import { BaseThreeView } from "./BaseThreeView";
import { PolylinesNode } from "../Core/Geometry/PolylinesNode";
import { PolylinesRenderStyle } from "../Core/Geometry/PolylinesRenderStyle";

import * as THREE from 'three';
import { Color } from "three";
import { ThreeConverter } from "./ThreeConverter";
import { ColorType } from "../Core/Enums/ColorType";
import { Colors } from "../Core/PrimitivClasses/Colors";

export class PolylinesThreeView extends BaseThreeView
{
  //==================================================
  // CONSTRUCTORS
  //==================================================

  public constructor() { super(); }

  //==================================================
  // PROPERTIES
  //==================================================

  protected get node(): PolylinesNode { return super.getNode() as PolylinesNode; }
  protected get style(): PolylinesRenderStyle { return super.getStyle() as PolylinesRenderStyle; }

  //==================================================
  // OVERRIDES of BaseView
  //==================================================

  public /*override*/ initialize(): void
  {
    const node = this.node;
    const style = this.style;
    const scene = this.scene;

    const polylines = node.data;
    if (!polylines)
      throw Error("polylines is missing in view");

    let color = node.color;
    const colorType = style.colorType;

    let i = 0;
    for (const polyline of polylines.list)
    {
      const points = new THREE.Geometry();
      for (const point of polyline.list)
        points.vertices.push(ThreeConverter.toVector(point));

      if (colorType === ColorType.DifferentColor)
        color = Colors.getNextColor(i++);

      const threeColor: Color = ThreeConverter.toColor(color);
      const line = new THREE.Line(points, new THREE.LineBasicMaterial({ color: threeColor, linewidth: style.lineWidth }));
      scene.add(line);
    }
  }
}
