import React, { useRef, useState, useEffect } from "react";
import { pixelToPoint, pointToColor, drawPixel } from "./utils";
import config from "./config";

const { height, width } = config.canvas;

const canvasStyle = {
  border: "1px solid blue"
};

type T = (event: React.PointerEvent<HTMLCanvasElement>) => void;

export default function Canvas() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const [constant, setConstant] = useState<any>();

  useEffect(() => {
    if (canvasEl.current) {
      // draw(ctx);
      var ctx = canvasEl.current!.getContext("2d")!;
      draw(ctx);
      // drawPixel(ctx, 100, 100, `rgb(${49}, ${80}, 0)`);
    }
  }, []);

  const handleMove: T = event => {
    const rect = (event.target as any).getBoundingClientRect();
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    const point = pixelToPoint(position.x, position.y);

    // setConstant([Math.round(re * 100) / 100, Math.round(im * 100) / 100]);
    setConstant(point);

    if (constant) {
      // var color = pointToColor(constant);
      var ctx = canvasEl.current!.getContext("2d")!;
      draw(ctx, constant);
      // drawPixel(ctx, position.x, position.y, color);
    }

    // drawPixel(ctx, event.clientX, event.clientY, color);
    // Get the mouse's XY coordinates on canvas
    //   const mouseX = event.clientX-canvas.offsetLeft
    //   mouseY = event.clientY-canvas.offsetTop

    //   // Turn mouse coordinates into a point on the complex plane
    //   constant = pixelToPoint(mouseX, mouseY)

    //   // Round that point off to the nearest 0.01
    //   constant.re = math.round(constant.re*100)/100
    //   constant.im = math.round(constant.im*100)/100
  };
  const rounded = constant && [
    Math.round(constant.re * 100) / 100,
    Math.round(constant.im * 100) / 100
  ];
  return (
    <div>
      <canvas
        ref={canvasEl}
        onPointerMove={handleMove}
        style={canvasStyle}
        width={config.canvas.width}
        height={config.canvas.height}
      ></canvas>
      {constant && <h1>{`${rounded[0]} + ${rounded[1]}i`}</h1>}
    </div>
  );
}

function draw(ctx: CanvasRenderingContext2D, constant?: any) {
  // Loop over every column of pixels
  for (var y = 0; y < height; y++) {
    // Loop over every row of pixels
    for (var x = 0; x < width; x++) {
      // Turn this pixel into a point in the complex plane
      var point = pixelToPoint(x, y);

      // Turn that point into a color
      var color = pointToColor(point, constant);

      drawPixel(ctx, x, y, color);
    }
  }
}

const round = (n: number) => Math.round(n / 100) * 100;
