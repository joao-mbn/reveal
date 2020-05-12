
import { ThreeModule } from './src/Three/ThreeModule';
import { ThreeRenderTargetNode } from './src/Three/ThreeRenderTargetNode';
import { Range3 } from './src/Core/Geometry/Range3';
import { WellNode } from './src/Nodes/WellNode';
import { Well } from './src/Nodes/Well';
import { RootNode } from './src/TreeNodes/RootNode';
import { AxisNode } from './src/Nodes/AxisNode';

main();

export function main()
{
  // Create the module and initialize it
  const module = new ThreeModule();
  module.install();

  // Add some random wells
  const root = module.createRoot() as RootNode;
  const wellTree = root.wells;
  for (let i = 0; i < 3; i++)
  {
    const node = new WellNode();
    node.data = Well.createByRandom(20, Range3.newTest);
    wellTree.addChild(node);
  }
  // Add a render target
  {
    const range = Range3.createByMinAndMax(0, 0, 1, 1);
    const target = new ThreeRenderTargetNode(range);
    root.targets.addChild(target);
  }

  module.initializeWhenPopulated(root);
  for (const target of root.targets.getChildrenByType(ThreeRenderTargetNode))
  {
    const range = target.pixelRange;
    const stats = target.stats;
    stats.dom.style.left = range.x.min.toFixed(0) + "px";
    stats.dom.style.top = range.y.min.toFixed(0) + "px";
    stats.dom.style.margin = "10px";
    stats.dom.style.position = "absolute";

    document.body.appendChild(target.domElement);
    document.body.appendChild(stats.dom);
    target.setActiveInteractive();
  }
  // Set some visible in target 0

  for (const node of root.getDescendantsByType(WellNode))
    node.setVisible(true);

  for (const node of root.getDescendantsByType(AxisNode))
    node.setVisible(true);

  const activeTarget = root.activeTarget as ThreeRenderTargetNode;
  console.log(activeTarget.toString());
  if (activeTarget)
    activeTarget.viewAll(); 

  // Trick
  (window as any).camera = activeTarget.activeCamera;
}




// Old test code:
//===============

//import { PolylinesNode } from './src/Nodes/PolylinesNode';
//import { PotreeNode } from './src/Nodes/PotreeNode';
//import { SurfaceNode } from './src/Nodes/SurfaceNode';
//import { PointsNode } from './src/Nodes/PointsNode';
//import { Points } from './src/Core/Geometry/Points';
//import { ColorType } from './src/Core/Enums/ColorType';
//import { Colors } from './src/Core/PrimitiveClasses/Colors';
  //{
  //  const range = Range3.createByMinAndMax(0, 0.5, 1, 1);
  //  const target = new ThreeRenderTargetNode(range);
  //  root.targets.addChild(target);
  //}
  // Add data
  //for (let i = 0; i < 1; i++)
  //{
  //  const range = Range3.newTest;
  //  range.expandByFraction(-0.3);
  //  const node = new PointsNode();
  //  node.data = Points.createByRandom(2_000_000, range);
  //  root.dataFolder.addChild(node);
  //}
  //for (let i = 0; i < 1; i++)
  //{
  //  const range = Range3.newTest;
  //  range.expandByFraction(-0.2);
  //  const node = new PolylinesNode();
  //  node.data = Polylines.createByRandom(20, 10, range);
  //  root.dataFolder.addChild(node);
  //}
  //for (let i = 0; i < 1; i++)
  //{
  //  const node = new SurfaceNode();
  //  node.data = RegularGrid2.createFractal(Range3.newTest, 8, 0.8, 2);
  //  root.dataFolder.addChild(node);
  //}
  //{
  //  const node = new PotreeNode();
  //  //node.url = 'https://betaserver.icgc.cat/potree12/resources/pointclouds/barcelonasagradafamilia/cloud.js';
  //  //node.name = 'Barcelona';
  //  node.url = '/Real/ept.json';
  //  node.name = 'Aerfugl';
  //  root.dataFolder.addChild(node);
  //}
  //for (const node of root.getDescendantsByType(PotreeNode))
  //  node.setVisible(true);
  // Set some visible in target 1
  // root.targets.children[0].setActiveInteractive();
  //for (const node of root.getDescendantsByType(PointsNode))
  //{
  //  const style = node.renderStyle;
  //  if (style)
  //  {
  //    style.colorType = ColorType.DepthColor;
  //    style.size = 1;
  //  }
  //  node.setVisible(true);
  //}
  //for (const node of root.getDescendantsByType(PolylinesNode))
  //{
  //  const style = node.renderStyle;
  //  if (style)
  //    style.lineWidth = 10;
  //  node.setVisible(true);
  //}
  //
  //for (const node of root.getDescendantsByType(SurfaceNode))
  //{
  //  const style = node.renderStyle;
  //  if (style)
  //  {
  //    style.colorType = ColorType.DepthColor;
  //  }
  //  node.setVisible(true);
  //}




