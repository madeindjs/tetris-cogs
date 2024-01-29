import type { Grid, Line } from "../model";

function* getRows(grid: Grid) {
  for (let index = grid.viewBox[0]; index < grid.viewBox[2]; index += grid.gap) {
    yield index;
  }
}

function* getColumns(grid: Grid) {
  for (let index = grid.viewBox[1]; index < grid.viewBox[3]; index += grid.gap) {
    yield index;
  }
}

export function getCompleteLines(links: Line[], grid: Grid): number[] {
  const points = links
    .flatMap((l) => l)
    .reduce<Record<number, Set<number>>>((acc, [x, y]) => {
      acc[y] ??= new Set();
      acc[y].add(x);
      return acc;
    }, {});

  const max = (grid.viewBox[2] - grid.viewBox[0]) / (grid.gap * 2);

  return Object.entries(points)
    .filter(([_, ys]) => ys.size === max)
    .map(([x]) => Number(x));
}
