import { createSignal } from "solid-js";
import { Cog, Grid, Rotation } from "../model";
import { buildCogGroup } from "../utils/cog-group.utils";

function useQueue<T>(size: number, generate: () => T) {
  const [getQueue, setQueue] = createSignal<T[]>(new Array(size).fill("").map(() => generate()));

  function take(): T {
    const queue = getQueue();

    const item = queue[0];
    if (item === undefined) throw Error("queue is empty");

    setQueue([...queue.slice(1), generate()]);

    return item;
  }

  return { queue: getQueue, take };
}

function getRandomDirection(): Rotation {
  const rand = Math.random();
  if (rand < 1 / 3) {
    return Rotation.Anti;
  } else if (rand > 2 / 3) {
    return Rotation.Clockwise;
  } else {
    return Rotation.None;
  }
}

export function useCogGroupQueue(grid: Grid) {
  const buildDefaultCog = (): Cog => ({
    position: [grid.size[0] / 2, 0],
    rotation: getRandomDirection(),
  });

  return useQueue(3, () => buildCogGroup(buildDefaultCog()));
}
