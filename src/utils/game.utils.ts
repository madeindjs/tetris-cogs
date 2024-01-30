import type { Cog, Grid, Line } from "../model";
import { getNeighborsCogs, isSameCog } from "./cog.utils";
import { isSamePoint, movePoint } from "./geometry.utils";

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
  const links: Line[] = [];

  function addLine(line: Line) {
    const exists = links.some(([from, to]) => line.every((p) => isSamePoint(p, from) || isSamePoint(p, to)));
    if (!exists) links.push(line);
  }

  for (const cog of cogs) {
    const others = cogs.filter((c) => !isSameCog(c, cog));
    const neighbors = getNeighborsCogs(cog, others);
    for (const neighbor of neighbors) addLine([cog.position, neighbor.position]);
  }

  return links;
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
