import React, { useRef, useState, useEffect } from "react";
import { pixelToPoint, pointToColor, drawPixel, Point } from "./utils";
import config from "./config";
import {
  TextField,
  Button,
  MenuItem,
  Container,
  Paper
} from "@material-ui/core";

const { height, width } = config.canvas;

const canvasStyle = {
  // border: "1px solid blue"
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
  const handlePresetChange = (preset: any) => {
    setConstant(preset);
  };
  return (
    <Container>
      <FractalForm
        constant={constant}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onPresetChange={handlePresetChange}
      />
      {/* <canvas
        ref={complexMapEl}
        onPointerMove={handleMove}
        style={canvasStyle}
        width={width}
        height={height}
      /> */}
      <h1>{`${constant.x} + ${constant.y}i`}</h1>
      <Paper>
        <canvas
          ref={fractalDisplayEl}
          style={canvasStyle}
          width={config.display.width}
          height={config.display.height}
        />
      </Paper>
    </Container>
  );
}

const FractalForm: React.FC<{
  constant: Point;
  onChange: any;
  onPresetChange: any;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}> = ({ constant, onChange, onSubmit, onPresetChange }) => {
  return (
    <form onSubmit={onSubmit} style={{ display: "flex", alignItems: "center" }}>
      <TextField
        id="standard-select-currency"
        select
        label="Select"
        variant="outlined"
        // value={currency}
        onChange={e => onPresetChange(JSON.parse(e.target.value))}
        helperText="Select a preset"
        margin="normal"
      >
        {fractalPresets.map(option => (
          <MenuItem
            key={JSON.stringify(option.value)}
            value={JSON.stringify(option.value)}
          >
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
            // max: 1,
            // min: 0
            // step: 0.001
          }
        }}
        helperText="Enter real number"
        margin="normal"
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
            // max: 1,
            // min: 0
            // step: 0.001
          }
        }}
        helperText="Enter imaginary number"
        margin="normal"
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

const fractalPresets = [
  {
    value: { x: 0.3, y: 0.5 },
    label: "preset1"
  },
  {
    value: { x: 0.285, y: 0.01 },
    label: "preset2"
  },
  {
    value: { x: -1.417022285618, y: 0.0099534 },
    label: "preset3"
  },
  {
    value: { x: 0.038088, y: 0.9754633 },
    label: "preset4"
  },
  {
    value: { x: 0.4, y: 0.6 },
    label: "preset5"
  },
  {
    value: { x: 0.8, y: 0.156 },
    label: "preset6"
  }
];
