import React, { useRef, useEffect } from "react";

const canvasStyle = {
  border: "1px solid blue",
  width: 200,
  height: 200
};

type T = (event: React.PointerEvent<HTMLCanvasElement>) => void;

export default function Canvas() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const handleMove: T = event => {
    const rect = (event.target as any).getBoundingClientRect();
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    console.log(position);
    // Get the mouse's XY coordinates on canvas
    //   const mouseX = event.clientX-canvas.offsetLeft
    //   mouseY = event.clientY-canvas.offsetTop

    //   // Turn mouse coordinates into a point on the complex plane
    //   constant = pixelToPoint(mouseX, mouseY)

    //   // Round that point off to the nearest 0.01
    //   constant.re = math.round(constant.re*100)/100
    //   constant.im = math.round(constant.im*100)/100
  };
  return (
    <div>
      <canvas
        ref={canvasEl}
        onPointerMove={handleMove}
        style={canvasStyle}
      ></canvas>
    </div>
  );
}
