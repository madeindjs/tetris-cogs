import { createSignal } from "solid-js";
import type { Cog, CogGroup, Grid, Point } from "../model";
import { Rotation } from "../model";
import { buildCogGroup, moveCogGroup, rotateGroup } from "../utils/cog-group.utils";
import { getNeighborsCogsBottom } from "../utils/cog.utils";
import { checkAndRemoveCompleteLines, computeCogsRotation } from "../utils/game.utils";

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
    console.log("tick");
    const cogGroup = activeCogGroup();
    if (!cogGroup) return;

    const newCogGroup = moveCogGroup(cogs(), cogGroup, [0, 1], grid.size);

    // TODO: let extra move once touch something
    function isTouchingSomething() {
      if (newCogGroup.some((c) => c.position[1] === grid.size[1] - 1)) return true;

      return newCogGroup.some((cog) => getNeighborsCogsBottom(cog, cogs()) !== undefined);
    }

    if (!isTouchingSomething()) return setActiveCogGroup(newCogGroup);

    const newCogs = [...cogs(), ...newCogGroup];
    const newCogsAfterDelete = checkAndRemoveCompleteLines([...cogs(), ...newCogGroup], grid);

    const deletedCogs = newCogs.length - newCogsAfterDelete.length;
    if (deletedCogs) setScore(score() + deletedCogs);

    setCogs(computeCogsRotation(newCogsAfterDelete));
    setActiveCogGroup(nextCogGroup());
    setNextCogGroup(buildDefaultCogGroup());
  }

  function moveActive(move: Point) {
    const group = activeCogGroup();
    if (!group) return;

    const newCogGroup = moveCogGroup(cogs(), group, move, grid.size);
    if (newCogGroup !== group) setActiveCogGroup(newCogGroup);
  }

  function rotateActivateGroup() {
    const cog = activeCogGroup();
    if (cog) setActiveCogGroup(rotateGroup(cog));
  }

  function reset() {
    setCogs([]);
    setActiveCogGroup(buildDefaultCogGroup());
    setNextCogGroup(buildDefaultCogGroup());
    setScore(0);
  }

  return {
    cogs,
    activeCogGroup,
    tick,
    score,
    rotate: rotateActivateGroup,
    moveLeft: () => moveActive([-1, 0]),
    moveRight: () => moveActive([1, 0]),
    moveBottom: () => moveActive([0, 1]),
    nextCogGroup,
    reset,
  };
}
