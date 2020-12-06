import React, { useRef, useState, useEffect } from "react";
import { pixelToPoint, pointToColor, drawPixel, Point } from "./utils";
import config from "./config";

const { height, width } = config.canvas;

const canvasStyle = {
  border: "1px solid blue"
};

type T = (event: React.PointerEvent<HTMLCanvasElement>) => void;

export default function Canvas() {
  const complexMapEl = useRef<HTMLCanvasElement>(null);
  const fractalDisplayEl = useRef<HTMLCanvasElement>(null);
  const [constant, setConstant] = useState<Point>({
    x: 0.285,
    y: 0.013
  });

  useEffect(() => {
    var ctx = fractalDisplayEl.current!.getContext("2d")!;
    draw(ctx, constant);
  }, []);

  const handleMove: T = event => {
    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    const point = pixelToPoint(position.x, position.y);

    setConstant(point);

    if (constant) {
      var ctx = fractalDisplayEl.current!.getContext("2d")!;
      draw(ctx, constant);
    }
  };

  return (
    <div>
      <canvas
        ref={complexMapEl}
        onPointerMove={handleMove}
        style={canvasStyle}
        width={width}
        height={height}
      />
      {constant && <h1>{`${round(constant.x)} + ${round(constant.y)}i`}</h1>}
      <div>
        <canvas
          ref={fractalDisplayEl}
          style={canvasStyle}
          width={config.display.width}
          height={config.display.height}
        />
      </div>
    </div>
  );
}

function draw(ctx: CanvasRenderingContext2D, constant: Point) {
  const { clientWidth, clientHeight } = ctx.canvas;
  // Loop over every column of pixels
  for (let y = 0; y < clientHeight; y++) {
    // Loop over every row of pixels
    for (let x = 0; x < clientWidth; x++) {
      // Turn this pixel into a point in the complex plane
      const point = pixelToPoint(x, y);
      const color = pointToColor(point, constant);

      drawPixel(ctx, x, y, color);
    }
  }
}

const round = (x: number) => Math.round(x * 100) / 100;
