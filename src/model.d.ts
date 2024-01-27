export type Point = [x: number, y: number];

export type Grid = { viewBox: ViewBox; gap: number };

export type ViewBox = [x: number, y: number, width: number, height: number];

export type Cog = {
  size: number;
  position: Point;
};
