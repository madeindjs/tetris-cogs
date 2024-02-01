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

export function getBoundingRect(
  points: Point[],
  radius: number = 0
): [xMin: number, yMin: number, xMax: number, yMax: number] {
  const xMin = Math.min(...points.map((c) => c[0]));
  const xMax = Math.max(...points.map((c) => c[0]));
  const yMin = Math.min(...points.map((c) => c[1]));
  const yMax = Math.max(...points.map((c) => c[1]));

  return [xMin - radius / 2, yMin - radius / 2, xMax - xMin + radius, yMax - yMin + radius];
}

export function getDistance(a: Point, b: Point) {
  const x = a[0] - b[0];
  const y = a[1] - b[1];

  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

export function getCardinalDirection(a: Point, b: Point): "up" | "bottom" | "left" | "right" {
  const x = a[0] - b[0];
  const y = a[1] - b[1];

  const isVertical = Math.abs(y) > Math.abs(x);

  if (isVertical) {
    return y > 0 ? "up" : "bottom";
  } else {
    return x > 0 ? "left" : "right";
  }
}
