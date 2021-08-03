export type Coords = { x: number; y: number };

export type Preset = { value: Coords; label: string };

export type ColoredPoint = Coords & { color: string };
