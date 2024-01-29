export type Point = [x: number, y: number];

export type Grid = { viewBox: ViewBox; gap: number };

export type ViewBox = [x: number, y: number, width: number, height: number];

export enum RotationDirection {
  Clockwise = 1,
  Anti = -1,
  None = 0,
}

export type Cog = {
  size: number;
  position: Point;
  rotationDirection: RotationDirection;
};

export enum GameStatus {
  InProgress = "in-progress",
  Loose = "loose",
}
