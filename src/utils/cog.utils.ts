import type { Cog, Grid, Point } from "../model";
import { RotationDirection } from "../model";
import { isCirclesIntersect, isCirclesTouch, movePoint } from "./geometry.utils";

function isOutside(cog: Cog, grid: Grid) {
  const [x, y] = cog.position;
  const [xMin, _, xMax, yMax] = grid.viewBox;

  // outside bottom
  if (y + cog.size / 2 >= yMax) return true;
  // outside left
  if (x - cog.size / 2 < xMin) return true;
  // outside right
  if (x + cog.size / 2 >= xMax) return true;

  return false;
}

export function isColliding(cog: Cog, others: Cog[]) {
  return others.some((c) =>
    isCirclesIntersect(c.position[0], c.position[1], c.size, cog.position[0], cog.position[1], cog.size)
  );
}

export function getNeighborsCogs(cog: Cog, others: Cog[]) {
  return others.filter((c) =>
    isCirclesTouch(c.position[0], c.position[1], c.size, cog.position[0], cog.position[1], cog.size)
  );
}

export function computeRotationDirection(dir: RotationDirection, ...dirs: RotationDirection[]): RotationDirection {
  for (const d of dirs) {
    dir = d * -1;
  }
  return dir;
}

export function isSameCog(a: Cog, b: Cog) {
  return a.size === b.size && a.position[0] === b.position[0] && a.position[1] === b.position[1];
}

export function moveCog(cogs: Cog[], cog: Cog, grid: Grid, move: Point): Cog {
  const newCog: Cog = {
    ...cog,
    position: movePoint(cog.position, move),
  };

  return isOutside(newCog, grid) || isColliding(newCog, cogs) ? cog : newCog;
}

export function moveCogsToBottom(cogs: Cog[], grid: Grid) {
  return cogs.map((c) => moveCog(cogs, c, grid, [0, grid.gap]));
}

export function getOppositeRotation(rotation: RotationDirection): RotationDirection {
  return rotation * -1;
}
