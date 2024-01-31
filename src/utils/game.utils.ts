import { Rotation, type Cog, type Grid } from "../model";
import { getNeighborsCogs, getOppositeRotation, isSameCog } from "./cog.utils";
import { movePoint } from "./geometry.utils";

export function getCompleteLines(cogs: Cog[], grid: Grid): number[] {
  const points = cogs
    .map((c) => c.position)
    .reduce<Record<number, Set<number>>>((acc, [x, y]) => {
      acc[y] ??= new Set();
      acc[y].add(x);
      return acc;
    }, {});

  return Object.entries(points)
    .filter(([_, ys]) => ys.size === grid.size[0])
    .map(([x]) => Number(x));
}

export function removeLine(cogs: Cog[], y: number) {
  return cogs
    .filter((cog) => cog.position[1] !== y)
    .map<Cog>((cog) => {
      if (cog.position[1] > y) return cog;
      return { ...cog, position: movePoint(cog.position, [0, 1]) };
    });
}

export function checkAndRemoveCompleteLines(cogs: Cog[], grid: Grid) {
  return getCompleteLines(cogs, grid).reduce<Cog[]>((acc, v) => removeLine(acc, v), cogs);
}

export function computeCogsRotation(currentCogs: Cog[]) {
  const cogs = [...currentCogs];
  let changed = false;

  function updateCog(old: Cog, current: Cog) {
    const index = cogs.findIndex((c) => isSameCog(c, old));
    if (index === -1) return console.error("cannot find cog");
    cogs[index] = current;
    changed = true;
  }

  do {
    changed = false;

    for (const cogA of cogs) {
      const others = cogs.filter((c) => !isSameCog(c, cogA));

      for (const cogB of getNeighborsCogs(cogA, others)) {
        if (cogA.rotation === Rotation.None && cogB.rotation !== Rotation.None) {
          updateCog(cogA, { ...cogA, rotation: getOppositeRotation(cogB.rotation) });
        } else if (cogB.rotation === Rotation.None && cogA.rotation !== Rotation.None) {
          updateCog(cogB, { ...cogB, rotation: getOppositeRotation(cogA.rotation) });
        }
      }
    }
  } while (changed);

  return cogs;
}
