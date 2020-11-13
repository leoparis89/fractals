import math from "mathjs";
import { complex } from "mathjs";

import config from "./config";
const { width, height } = config.canvas;
// the rest of your script...

// Turn XY pixel coordinates into a point on the complex plane
export function pixelToPoint(x: number, y: number) {
  // Map percentage of total width/height to a value from -1 to +1
  var zx = (x / width) * 2 - 1;
  var zy = 1 - (y / height) * 2;

  // Create a complex number based on our new XY values
  return complex(zx, zy);
}

export function pointToColor(point: math.Complex) {
  var red = point.re * 255;
  var green = point.im * 255;
  return `rgb(${red}, ${green}, 0)`;
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
