import math from "mathjs";

import config from "./config";
const { width, height } = config.canvas;
// the rest of your script...

// Turn XY pixel coordinates into a point on the complex plane
function pixelToPoint(x: number, y: number) {
  // Map percentage of total width/height to a value from -1 to +1
  var zx = (x / width) * 2 - 1;
  var zy = 1 - height * 2;

  // Create a complex number based on our new XY values
  return math.complex(zx, zy);
}
