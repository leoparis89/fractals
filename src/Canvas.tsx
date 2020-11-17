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
  const displayEl = useRef<HTMLCanvasElement>(null);
  const [constant, setConstant] = useState<any>();

  useEffect(() => {}, []);

  const handleMove: T = event => {
    const rect = (event.target as any).getBoundingClientRect();
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    const point = pixelToPoint(position.x, position.y);

    setConstant(point);

    if (constant) {
      var ctx = displayEl.current!.getContext("2d")!;
      draw(ctx, constant);
    }
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
        width={width}
        height={height}
      />
      {constant && <h1>{`${rounded[0]} + ${rounded[1]}i`}</h1>}
      <div>
        <canvas
          ref={displayEl}
          style={canvasStyle}
          width={config.display.width}
          height={config.display.height}
        />
      </div>
    </div>
  );
}

function draw(ctx: CanvasRenderingContext2D, constant?: any) {
  const { clientWidth, clientHeight } = ctx.canvas;
  // Loop over every column of pixels
  for (let y = 0; y < clientHeight; y++) {
    // Loop over every row of pixels
    for (let x = 0; x < clientWidth; x++) {
      // Turn this pixel into a point in the complex plane
      let point = pixelToPoint(x, y);

      // Turn that point into a color
      let color = pointToColor(point, constant);

      drawPixel(ctx, x, y, color);
    }
  }
}
