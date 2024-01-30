import { useLines } from "../hooks/use-lines";
import { Point, RotationDirection, type Cog, type Grid, type Line } from "../model";
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

export function checkAndRemoveCompleteLines(cogs: Cog[], links: Line[], grid: Grid, removeCount = 0) {
  const completeLines = getCompleteLines(links, grid);

  const res = completeLines.reduce<{ links: Line[]; cogs: Cog[]; removeCount: number }>(
    (acc, v) => {
      const res = removeLine(acc.cogs, v);
      return { ...res, removeCount: acc.removeCount + res.removeCount };
    },
    {
      links,
      cogs: cogs,
      removeCount,
    }
  );

  if (res.removeCount === removeCount) return res;

  return checkAndRemoveCompleteLines(res.cogs, res.links, grid, res.removeCount);
}

export function computeCogsRotation(currentCogs: Cog[], links: Line[]) {
  const cogs = [...currentCogs];
  const brokenLinks: Line[] = [];

  const getCogOnPoint = ([x, y]: Point) => cogs.find((c) => c.position[0] === x && c.position[1] === y);

  function updateCog(old: Cog, current: Cog) {
    const index = cogs.findIndex((c) => isSameCog(c, old));
    if (index === -1) throw Error("cannot find cog");
    cogs[index] = current;
  }

  function checkLink([from, to]: Line) {
    const cogA = getCogOnPoint(from);
    const cogB = getCogOnPoint(to);
    if (!cogA || !cogB) throw Error();

    if (cogA.rotationDirection === RotationDirection.None && cogB.rotationDirection === RotationDirection.None) {
      return;
    } else if (cogA.rotationDirection === RotationDirection.None) {
      updateCog(cogA, { ...cogA, rotationDirection: getOppositeRotation(cogB.rotationDirection) });
    } else if (cogB.rotationDirection === RotationDirection.None) {
      updateCog(cogB, { ...cogB, rotationDirection: getOppositeRotation(cogA.rotationDirection) });
    } else if (cogA.rotationDirection === cogB.rotationDirection) {
      brokenLinks.push([cogA.position, cogB.position]);
    }
  }

  for (const link of links) checkLink(link);

  return { cogs, brokenLinks };
}
