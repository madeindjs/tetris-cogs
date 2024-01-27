import type { Cog, Grid, Point, RotationDirection } from "../model";
import { isCirclesIntersect, movePoint } from "./geometry.utils";

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

function isColliding(cog: Cog, others: Cog[]) {
  return others.some((c) =>
    isCirclesIntersect(c.position[0], c.position[1], c.size, cog.position[0], cog.position[1], cog.size)
  );
}

function getCollidingCogs(cog: Cog, others: Cog[]) {
  return others.filter((c) =>
    isCirclesIntersect(c.position[0], c.position[1], c.size, cog.position[0], cog.position[1], cog.size)
  );
}

function computeRotationDirection(dir: RotationDirection, ...dirs: RotationDirection[]): RotationDirection {
  for (const d of dirs) {
    dir = d * -1;
  }
  return dir;
}

function isSameCog(a: Cog, b: Cog) {
  return a.size === b.size && a.position[0] === b.position[0] && a.position[1] === b.position[1];
}

export function moveCog(cogs: Cog[], cog: Cog, grid: Grid, move: Point): Cog {
  const others = cogs.filter((c) => !isSameCog(c, cog));

  const newCog: Cog = {
    ...cog,
    position: movePoint(cog.position, move),
  };

  if (isOutside(newCog, grid)) return cog;

  const colliding = getCollidingCogs(newCog, others);

  if (!colliding.length) return newCog;

  const newRotationDirection = colliding.reduce(
    (acc, c) => computeRotationDirection(acc, c.rotationDirection),
    newCog.rotationDirection
  );

  return {
    ...cog,
    rotationDirection: newRotationDirection,
  };
}

export function moveCogsToBottom(cogs: Cog[], grid: Grid) {
  return cogs.map((c) => moveCog(cogs, c, grid, [0, grid.gap]));
}
