import type { Cog, Grid, Point } from "../model";
import { Rotation } from "../model";
import { getNeighborsPoints, isPointInsideArea, isSamePoint, movePoint } from "./geometry.utils";

export function isColliding(cog: Cog, others: Cog[]) {
  return others.some((o) => isSamePoint(o.position, cog.position));
}

export function getNeighborsCogs(cog: Cog, others: Cog[]) {
  const neighborsPoints = getNeighborsPoints(cog.position);
  return others.filter((o) => neighborsPoints.some((p) => isSamePoint(p, o.position)));
}

export function getNeighborsCogsBottom(cog: Cog, others: Cog[]) {
  const point = movePoint(cog.position, [0, 1]);
  return others.find((o) => isSamePoint(point, o.position));
}

export function computeRotationDirection(dir: Rotation, ...dirs: Rotation[]): Rotation {
  return dirs.reduce((_, d) => d * -1, dir);
  for (const d of dirs) dir = d * -1;
  return dir;
}

export function isSameCog(a: Cog, b: Cog) {
  return isSamePoint(a.position, b.position) && a.rotation === b.rotation;
}

export function moveCog(cogs: Cog[], cog: Cog, gridSize: Point, move: Point): Cog {
  const newCog: Cog = { ...cog, position: movePoint(cog.position, move) };
  return !isPointInsideArea(newCog.position, gridSize) || isColliding(newCog, cogs) ? cog : newCog;
}

export function moveCogsToBottom(cogs: Cog[], grid: Grid) {
  return cogs.map((c) => moveCog(cogs, c, grid.size, [0, 1]));
}

export function getOppositeRotation(rotation: Rotation): Rotation {
  return rotation === 0 ? 0 : rotation * -1;
}
