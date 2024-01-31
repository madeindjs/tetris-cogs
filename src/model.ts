export type Point = [x: number, y: number];

export type Line = [from: Point, to: Point];

export type GridSize = [width: number, height: number];

export type Grid = { size: GridSize };

export type ViewBox = [x: number, y: number, width: number, height: number];

export type Link = { points: Line; broken?: boolean };

export enum Rotation {
  Clockwise = 1,
  Anti = -1,
  None = 0,
}

export type Cog = { position: Point; rotation: Rotation };

/**
 * Aggregate of cogs which represent a {@link CogGroupShape}
 */
export type CogGroup = Cog[];

/**
 * Represent all Tetris shapes
 */
export enum CogGroupShape {
  /**
   * ~~~
   * xxxx
   * ~~~
   */
  I = "I",
  /**
   * ~~~
   *  xx
   * xx
   * ~~~
   */
  S = "S",
  /**
   * ~~~
   * x
   * xxx
   * ~~~
   */
  J = "J",
  /**
   * ~~~
   *  x
   * xxx
   * ~~~
   */
  T = "T",
  /**
   * ~~~
   * x
   * x
   * XX
   * ~~~
   */
  L = "L",
  /**
   * ~~~
   * xx
   * xx
   * ~~~
   */
  O = "O",
  /**
   * ~~~
   * xx
   *  xx
   * ~~~
   */
  Z = "Z",
}
