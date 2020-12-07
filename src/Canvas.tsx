import React, { useRef, useState, useEffect } from "react";
import { pixelToPoint, pointToColor, drawPixel, Point } from "./utils";
import config from "./config";
import { TextField, Button, MenuItem } from "@material-ui/core";

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
    refresh();
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

  const refresh = () => {
    var ctx = fractalDisplayEl.current!.getContext("2d")!;
    draw(ctx, constant);
  };
  const handleChange = (point: Point) => {
    setConstant(point);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refresh();
  };
  return (
    <div>
      <FractalForm
        constant={constant}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      {/* <canvas
        ref={complexMapEl}
        onPointerMove={handleMove}
        style={canvasStyle}
        width={width}
        height={height}
      /> */}
      <h1>{`${round(constant.x)} + ${round(constant.y)}i`}</h1>
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

const FractalForm: React.FC<{
  constant: Point;
  onChange: any;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}> = ({ constant, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <TextField
        id="standard-select-currency"
        select
        label="Select"
        variant="outlined"
        // value={currency}
        // onChange={handleChange}
        helperText="Select a preset"
      >
        {currencies.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        type="number"
        id="outlined-basic"
        label="Real"
        variant="outlined"
        value={constant.x}
        onChange={e => {
          onChange({ x: Number(e.target.value), y: constant.y });
        }}
        InputProps={{
          inputProps: {
            max: 1,
            min: 0,
            step: 0.001
          }
        }}
      />
      <TextField
        type="number"
        id="outlined-basic"
        label="Imaginary"
        variant="outlined"
        value={constant.y}
        onChange={e => {
          onChange({ y: Number(e.target.value), x: constant.x });
        }}
        InputProps={{
          inputProps: {
            max: 1,
            min: 0,
            step: 0.001
          }
        }}
      />
      <Button type="submit">Generate</Button>
    </form>
  );
};

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

const currencies = [
  {
    value: "USD",
    label: "$"
  },
  {
    value: "EUR",
    label: "€"
  },
  {
    value: "BTC",
    label: "฿"
  },
  {
    value: "JPY",
    label: "¥"
  }
];
