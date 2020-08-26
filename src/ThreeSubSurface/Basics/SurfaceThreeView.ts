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

import * as THREE from "three";

import { ColorType } from "@/Core/Enums/ColorType";
import Range3 from "@/Core/Geometry/Range3";

import { SurfaceNode } from "@/SubSurface/Basics/SurfaceNode";
import { SurfaceRenderStyle } from "@/SubSurface/Basics/SurfaceRenderStyle";
import { NodeEventArgs } from "@/Core/Views/NodeEventArgs";
import { RegularGrid2Buffers } from "@/Core/Geometry/RegularGrid2Buffers";

import { BaseGroupThreeView } from "@/Three/BaseViews/BaseGroupThreeView";
import { ThreeConverter } from "@/Three/Utilities/ThreeConverter";
import { TextureKit } from "@/Three/Utilities/TextureKit";
import { ContouringService } from "@/Core/Geometry/ContouringService";
import { ColorMaps } from "@/Core/Primitives/ColorMaps";
import { ViewInfo } from "@/Core/Views/ViewInfo";
import { Changes } from "@/Core/Views/Changes";
import { SolidStyle } from "@/Core/Styles/SolidStyle";

const SolidName = "Solid";
const ContoursName = "Contour";

export class SurfaceThreeView extends BaseGroupThreeView
{
  //==================================================
  // INSTANCE PROPERTIES
  //==================================================

  protected get node(): SurfaceNode { return super.getNode() as SurfaceNode; }

  protected get style(): SurfaceRenderStyle { return super.getStyle() as SurfaceRenderStyle; }

  //==================================================
  // CONSTRUCTORS
  //==================================================

  public constructor() { super(); }

  //==================================================
  // OVERRIDES of BaseView
  //==================================================

  protected /*override*/ updateCore(args: NodeEventArgs): void
  {
    super.updateCore(args);
    if (args.isChanged(Changes.nodeColorMap))
    {
      const parent = this.object3D;
      if (!parent)
        return;

      this.touch();
    }
    if (args.isChanged(Changes.renderStyle))
    {
      if (this._object3D)
      {
        const fieldName = args.getFieldName(Changes.renderStyle);
        if (fieldName === "Opacity" || fieldName === "Shininess")
        {
          const mesh = this._object3D.getObjectByName(SolidName) as THREE.Mesh;
          if (mesh)
          {
            SurfaceThreeView.setMaterial(mesh.material as THREE.MeshPhongMaterial, this.style.solid);
            this.invalidateTarget();
            return;
          }
        }
      }
      this.touch();
    }
  }

  //==================================================
  // OVERRIDES of Base3DView
  //==================================================

  public /*override*/ calculateBoundingBoxCore(): Range3 | undefined { return this.node.boundingBox; }

  //==================================================
  // OVERRIDES of BaseGroupThreeView
  //==================================================

  protected /*override*/ createObject3DCore(): THREE.Object3D | null
  {
    const { node } = this;
    const grid = node.surface;
    if (!grid)
      return null;

    const parent = new THREE.Group();
    const solid = this.createSolid();
    if (solid)
      parent.add(solid);

    const contours = this.createContours();
    if (contours)
      parent.add(contours);

    const { transformer } = this;

    parent.rotateZ(grid.rotationAngle);
    parent.position.copy(transformer.to3D(grid.origin));
    parent.scale.copy(transformer.scale);
    return parent;
  }

  public /*override*/ onShowInfo(viewInfo: ViewInfo, intersection: THREE.Intersection): void
  {
    const { node } = this;
    viewInfo.addPickedNode(node);

    const { transformer } = this;
    const position = transformer.toWorld(intersection.point);
    viewInfo.addValue("Position", position.getString(2));

    const { surface } = node;
    if (!surface)
      return;

    const cell = surface.getCellFromPosition(position);
    if (!surface.isNodeInside(cell.i, cell.j))
      return;

    viewInfo.addValue("Cell", cell.toString());
  }

  //==================================================
  // INSTANCE METHODS: 
  //==================================================

  private createSolid(): THREE.Object3D | null
  {
    const { node } = this;
    const style = this.style.solid;
    const grid = node.surface;
    if (!grid)
      return null;

    const colorType = style.colorType.value;
    const color = node.getColorByColorType(colorType);
    const buffers = new RegularGrid2Buffers(grid, colorType === ColorType.DepthColor);
    const geometry = buffers.getBufferGeometry();

    const material = new THREE.MeshPhongMaterial({
      color: ThreeConverter.toThreeColor(color),
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 4.0,
    });
    SurfaceThreeView.setMaterial(material, style);
    if (colorType === ColorType.DepthColor && buffers.hasUvs)
    {
      const texture = TextureKit.create1D(ColorMaps.get(node.colorMap));
      if (texture)
        texture.anisotropy = 4;
      material.map = texture;
    }

    const texture = material.map as THREE.DataTexture;
    if (texture)
    {
      material.map = TextureKit.create1DContours(ColorMaps.get(node.colorMap), grid.boundingBox.z, this.style.contours.increment.value, 1);
    }
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = SolidName;
    return mesh;
  }

  private createContours(): THREE.Object3D | null
  {
    const { node } = this;
    const style = this.style.contours;
    const grid = node.surface;
    if (!grid)
      return null;

    const color = node.getColorByColorType(style.colorType.value);
    const service = new ContouringService(style.increment.value);

    const contoursBuffer = service.createContoursAsXyzArray(grid);
    if (contoursBuffer.length === 0)
      return null;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(contoursBuffer, 3));

    const material = new THREE.LineBasicMaterial({ color: ThreeConverter.toThreeColor(color), linewidth: 1 });
    const contours = new THREE.LineSegments(geometry, material);
    contours.name = ContoursName;
    return contours;
  }

  //==================================================
  // INSTANCE METHODS: Shader experiments
  //==================================================

  private static setMaterial(material: THREE.MeshPhongMaterial | null, style: SolidStyle | null)
  {
    if (!material || !style)
      return;

    if (style.opacity.use)
    {
      material.opacity = style.opacity.value;
      material.transparent = true;
    }
    else
      material.transparent = true;

    material.shininess = style.shininess.use ? 100 * style.shininess.value : 0;
  }
}

//==================================================
// INSTANCE METHODS: Shader experiments
//==================================================

function vertexShader(): string
{
  return `
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `;
}
