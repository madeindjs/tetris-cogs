import { createSignal } from "solid-js";
import type { Cog, CogGroup, Grid } from "../model";
import { Rotation } from "../model";
import { buildCogGroup, moveCogGroup } from "../utils/cog-group.utils";
import { getNeighborsCogsBottom } from "../utils/cog.utils";
import { computeCogsRotation } from "../utils/game.utils";

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

export function useGameState(grid: Grid) {
  const buildDefaultCog = (): Cog => ({
    position: [grid.size[0] / 2, 0],
    rotation: getRandomDirection(),
  });

  const buildDefaultCogGroup = () => buildCogGroup(buildDefaultCog());

  const [activeCogGroup, setActiveCogGroup] = createSignal<CogGroup | undefined>(buildDefaultCogGroup());
  const [nextCogGroup, setNextCogGroup] = createSignal(buildDefaultCogGroup());
  const [cogs, setCogs] = createSignal<Cog[]>([]);
  const [score, setScore] = createSignal(0);

  function tick() {
    const cogGroup = activeCogGroup();
    if (!cogGroup) return;

    const newCogGroup = moveCogGroup(cogs(), cogGroup, [0, 1], grid.size);

    function isTouchingSomething() {
      if (newCogGroup.some((c) => c.position[1] === grid.size[1] - 1)) return true;

      return newCogGroup.some((cog) => getNeighborsCogsBottom(cog, cogs()) !== undefined);
    }

    if (!isTouchingSomething()) return setActiveCogGroup(newCogGroup);

    setCogs(computeCogsRotation([...cogs(), ...newCogGroup]));
    setActiveCogGroup(nextCogGroup());
    setNextCogGroup(buildDefaultCogGroup());
  }

  function moveActive(direction: -1 | 1) {
    const cog = activeCogGroup();
    if (!cog) return;

    const newCogGroup = moveCogGroup(cogs(), cog, [1 * direction, 0], grid.size);
    if (newCogGroup !== cog) setActiveCogGroup(newCogGroup);
  }

  function reset() {
    setCogs([]);
    setActiveCogGroup(buildDefaultCogGroup());
    setNextCogGroup(buildDefaultCogGroup());
    setScore(0);
  }

  return {
    // TODO: separate this to improve memo
    cogs: () => [...cogs(), ...(activeCogGroup() ?? [])] as Cog[],
    tick,
    score,
    moveLeft: () => moveActive(-1),
    moveRight: () => moveActive(1),
    moveBottom: tick,
    nextCogGroup,
    reset,
  };
}
