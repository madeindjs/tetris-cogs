export type Point = [x: number, y: number];
export type Line = [from: Point, to: Point];

export type GridSize = [xCount: number, yCount: number];

export type Grid = { size: Point };

export type ViewBox = [x: number, y: number, width: number, height: number];

export type Link = {
  points: Line;
  broken?: boolean;
};

export enum Rotation {
  Clockwise = 1,
  Anti = -1,
  None = 0,
}

export type Cog = {
  position: Point;
  rotation: Rotation;
};

export type CogGroup = Cog[];

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
