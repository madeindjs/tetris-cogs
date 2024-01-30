export type Point = [x: number, y: number];
export type Line = [from: Point, to: Point];

export type GridSize = [xCount: number, yCount: number];

export type Grid = { size: Point };

export type ViewBox = [x: number, y: number, width: number, height: number];

export enum RotationDirection {
  Clockwise = 1,
  Anti = -1,
  None = 0,
}

export type Cog = {
  position: Point;
  rotationDirection: RotationDirection;
};

export enum GameStatus {
  InProgress = "in-progress",
  Loose = "loose",
}
