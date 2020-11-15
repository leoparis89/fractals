import * as math from "mathjs";

import config from "./config";
const { width, height } = config.canvas;
// the rest of your script...

// Turn XY pixel coordinates into a point on the complex plane
export function pixelToPoint(x: number, y: number) {
  // Map percentage of total width/height to a value from -1 to +1
  var zx = (x / width) * 2 - 1;
  var zy = 1 - (y / height) * 2;

  // Create a complex number based on our new XY values
  return math.complex(zx, zy);
}

export function pointToColor(point: math.Complex, constant?: math.Complex) {
  let newpoint = point;
  if (constant) {
    newpoint = math.divide(point, constant) as math.Complex;
    var iterations = julia(point, constant);
    const percentage = iterations / maxIterations;

    var red = percentage * 255;
    var green = percentage * 255;
    var blue = percentage * 255;

    return `rgb(${red}, ${green}, ${blue})`;
  }
  return "";
  // How many iterations on this point before it escapes?
  // var red = newpoint.re * 255;
  // var green = newpoint.im * 255;
  // var blue = (math.abs(point) as any) * 255;
}

export function drawPixel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

export const maxIterations = 64;

// Apply the Julia Set formula to see if point z "escapes"
export function julia(z: math.Complex, c: math.Complex, i = 0): number {
  // Apply the Julia Set formula: z*z+constant
  const result = math.add(math.multiply(z, z), c) as math.Complex;

  // Has our point escaped, or hit the iteration limit?
  if (((math.abs(result) as any) as number) > 2 || i === maxIterations) {
    return i;
  }
  // If so, return number of iterations
  // If not, iterate again!
  return julia(result, c, i + 1);
}
