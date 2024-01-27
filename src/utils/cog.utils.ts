import type { Cog, Grid, RotationDirection } from "../model";
import { isCirclesIntersect } from "./geometry.utils";

function isOutside(cog: Cog, grid: Grid) {
  // todo
  const [x, y] = cog.position;
  const yMax = grid.viewBox[3];

  return y + cog.size / 2 >= yMax;
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

export function moveCogs(cogs: Cog[], grid: Grid) {
  function moveCog(cog: Cog): Cog {
    const others = cogs.filter((c) => !isSameCog(c, cog));

    const [x, y] = cog.position;
    const newCog: Cog = { ...cog, position: [x, y + grid.gap] };

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

    return isColliding(newCog, others) ? cog : newCog;
  }

  return cogs.map(moveCog);
}
