import type { Cog, Grid, Point } from "../model";
import { RotationDirection } from "../model";
import { getNeighborsPoints, isPointInsideArea, isSamePoint, movePoint } from "./geometry.utils";

export function isColliding(cog: Cog, others: Cog[]) {
  return others.some((o) => isSamePoint(o.position, cog.position));
}

export function getNeighborsCogs(cog: Cog, others: Cog[]) {
  const neighborsPoints = getNeighborsPoints(cog.position);
  return others.filter((o) => neighborsPoints.some((p) => isSamePoint(p, o.position)));
}

export function computeRotationDirection(dir: RotationDirection, ...dirs: RotationDirection[]): RotationDirection {
  for (const d of dirs) dir = d * -1;
  return dir;
}

export function isSameCog(a: Cog, b: Cog) {
  return isSamePoint(a.position, b.position) && a.rotationDirection === b.rotationDirection;
}

export function moveCog(cogs: Cog[], cog: Cog, gridSize: Point, move: Point): Cog {
  const newCog: Cog = { ...cog, position: movePoint(cog.position, move) };
  return !isPointInsideArea(newCog.position, gridSize) || isColliding(newCog, cogs) ? cog : newCog;
}

export function moveCogsToBottom(cogs: Cog[], grid: Grid) {
  return cogs.map((c) => moveCog(cogs, c, grid.size, [0, 1]));
}

export function getOppositeRotation(rotation: RotationDirection): RotationDirection {
  return rotation === 0 ? 0 : rotation * -1;
}
