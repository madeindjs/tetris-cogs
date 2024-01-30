import type { GridSize, Point } from "../model";

export function isSamePoint(a: Point, b: Point) {
  return a[0] === b[0] && a[1] === b[1];
}

export function movePoint([x, y]: Point, [tx, ty]: Point): Point {
  return [x + tx, y + ty];
}

export function getNeighborsPoints(point: Point): Point[] {
  const neighborTranslations: Point[] = [
    [0, -1],
    [0, 1],
    [1, 0],
    [-1, 0],
  ];

  return neighborTranslations.map((t) => movePoint(point, t));
}

export function isPointInsideArea(point: Point, gridSize: GridSize) {
  const [x, y] = point;
  const [width, height] = gridSize;

  return x >= 0 && y >= 0 && x < width && y < height;
}
