import {
  Button,
  Container,
  MenuItem,
  Paper,
  TextField,
} from "@material-ui/core";
import React, { useRef, useState } from "react";
import config from "./config";
import { ColoredPoint, Coords, Preset } from "./models";
import { drawPixel, pixelToPoint, pointToColor } from "./utils";

export default function FractalGen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [constant, setConstant] = useState<Coords>({
    x: 0.3,
    y: 0.5,
  });

  const refresh = () => {
    var ctx = canvasRef.current!.getContext("2d")!;
    draw(ctx, constant);
  };

  const handleChange = (point: Coords) => {
    setConstant(point);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refresh();
  };

  const handlePresetChange = (preset: Coords) => {
    setConstant(preset);
  };

  return (
    <Container>
      <FractalForm
        coords={constant}
        onCoordsChange={handleChange}
        onSubmit={handleSubmit}
        onPresetChange={handlePresetChange}
      />
      <h1>{`${constant.x} + ${constant.y}i`}</h1>
      <Paper>
        <canvas
          ref={canvasRef}
          width={config.display.width}
          height={config.display.height}
        />
      </Paper>
    </Container>
  );
}

const FractalForm: React.FC<{
  coords: Coords;
  onCoordsChange: any;
  onPresetChange: any;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}> = ({ coords, onCoordsChange, onSubmit, onPresetChange }) => {
  const handlePresetChange = ({ target: { value } }: any) =>
    onPresetChange(getValue(value));

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", alignItems: "center" }}>
      <TextField
        select
        label="Preset"
        variant="outlined"
        value={getLabel(coords) || "custom"}
        onChange={handlePresetChange}
        helperText="Select a preset"
        margin="normal"
      >
        {fractalPresets.map(({ label }) => (
          <MenuItem key={label} value={label}>
            {label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        type="number"
        id="outlined-basic"
        label="Real"
        variant="outlined"
        value={coords.x}
        onChange={(e) => {
          onCoordsChange({ x: Number(e.target.value), y: coords.y });
        }}
        InputProps={{
          inputProps: {
            // max: 1,
            // min: 0
            // step: 0.001
          },
        }}
        helperText="Enter real number"
        margin="normal"
      />
      <TextField
        type="number"
        id="outlined-basic"
        label="Imaginary"
        variant="outlined"
        value={coords.y}
        onChange={(e) => {
          onCoordsChange({ y: Number(e.target.value), x: coords.x });
        }}
        InputProps={{
          inputProps: {
            // max: 1,
            // min: 0
            // step: 0.001
          },
        }}
        helperText="Enter imaginary number"
        margin="normal"
      />
      <Button type="submit">Generate</Button>
    </form>
  );
};

function draw(ctx: CanvasRenderingContext2D, constant: Coords) {
  const { clientWidth, clientHeight } = ctx.canvas;
  // Loop over every column of pixels
  const points = genColoredPoints(constant, clientWidth, clientHeight);

  points.forEach((p) => drawPixel(ctx, p.x, p.y, p.color));
}

function genColoredPoints(constant, clientHeight, clientWidth) {
  const points: ColoredPoint[] = [];

  for (let y = 0; y < clientHeight; y++) {
    // Loop over every row of pixels
    for (let x = 0; x < clientWidth; x++) {
      // Turn this pixel into a point in the complex plane
      const point = pixelToPoint(x, y);
      const color = pointToColor(point, constant);

      points.push({ x, y, color });
    }
  }

  return points;
}

const fractalPresets: Preset[] = [
  {
    value: { x: 0, y: 0 },
    label: "custom",
  },
  {
    value: { x: 0.3, y: 0.5 },
    label: "preset1",
  },
  {
    value: { x: 0.285, y: 0.01 },
    label: "preset2",
  },
  {
    value: { x: -1.417022285618, y: 0.0099534 },
    label: "preset3",
  },
  {
    value: { x: 0.038088, y: 0.9754633 },
    label: "preset4",
  },
  {
    value: { x: 0.4, y: 0.6 },
    label: "preset5",
  },
  {
    value: { x: 0.8, y: 0.156 },
    label: "preset6",
  },
];

const getLabel = (coords: Coords) =>
  fractalPresets.find((p) => JSON.stringify(p.value) === JSON.stringify(coords))
    ?.label;

const getValue = (label: string) =>
  fractalPresets.find((p) => p.label === label)?.value;
