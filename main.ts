import { ThreeModule } from './src/Three/ThreeModule';
import { PolylinesNode } from './src/Core/Geometry/PolylinesNode';
import { Polylines } from './src/Core/Geometry/Polylines';

main();

export function main()
{
  // Create the module and initialize it
  const module = new ThreeModule();
  module.install();

  const root = module.createRoot();
  module.initialize(root);

  // Add some data
  if (!root.dataFolder)
    throw Error("No data folder in the project");

  for (let i = 0; i < 4; i++)
  {
    const node = new PolylinesNode();
    node.data = Polylines.createByRandom(10, 10);
    node.name = "Polylines " + i;
    root.dataFolder.addChild(node);
    node.setVisible(true);
  }
  // In the end 
}

