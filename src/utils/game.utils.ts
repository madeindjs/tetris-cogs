import { useLines } from "../hooks/use-lines";
import { Rotation, type Cog, type Grid, type Line } from "../model";
import { getNeighborsCogs, getOppositeRotation, isSameCog } from "./cog.utils";
import { movePoint } from "./geometry.utils";

export function getCompleteLines(links: Line[], grid: Grid): number[] {
  const points = links
    .flatMap((l) => l)
    .reduce<Record<number, Set<number>>>((acc, [x, y]) => {
      acc[y] ??= new Set();
      acc[y].add(x);
      return acc;
    }, {});

  return Object.entries(points)
    .filter(([_, ys]) => ys.size === grid.size[1])
    .map(([x]) => Number(x));
}

export function buildLinks(cogs: Cog[]): Line[] {
  const { lines, addLine } = useLines();

  for (const cog of cogs) {
    const others = cogs.filter((c) => !isSameCog(c, cog));
    const neighbors = getNeighborsCogs(cog, others);
    for (const neighbor of neighbors) addLine([cog.position, neighbor.position]);
  }

  return lines;
}

export function removeLine(cogs: Cog[], y: number): { cogs: Cog[]; links: Line[]; removeCount: number } {
  const newCogs = cogs
    .filter((cog) => cog.position[1] !== y)
    .map((cog) => {
      if (cog.position[1] > y) return cog;
      return { ...cog, position: movePoint(cog.position, [0, 1]) };
    });

  return {
    links: Array.from(buildLinks(newCogs)),
    cogs: newCogs,
    removeCount: cogs.length - newCogs.length,
  };
}
// TODO: fix this
export function checkAndRemoveCompleteLines(cogs: Cog[], links: Line[], grid: Grid) {
  return getCompleteLines(links, grid).reduce<{ links: Line[]; cogs: Cog[]; removeCount: number }>(
    (acc, v) => {
      const res = removeLine(acc.cogs, v);
      return { ...res, removeCount: acc.removeCount + res.removeCount };
    },
    {
      links,
      cogs: cogs,
      removeCount: 0,
    }
  );
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
