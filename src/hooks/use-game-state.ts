import { createSignal } from "solid-js";
import type { Cog, CogGroup, Grid, Point } from "../model";
import { isCogGroupTouchingSomething, moveCogGroup, rotateGroup } from "../utils/cog-group.utils";
import { checkAndRemoveCompleteLines, computeCogsRotation } from "../utils/game.utils";
import { useCogGroupQueue } from "./use-cog-group-queue";

export function useGameState(grid: Grid) {
  const { queue: nextCogGroups, take: getNextCogGroup } = useCogGroupQueue(grid);

  const [activeCogGroup, setActiveCogGroup] = createSignal<CogGroup>(getNextCogGroup());
  const [cogs, setCogs] = createSignal<Cog[]>([]);
  const [score, setScore] = createSignal(0);

  const level = () => Math.round(score() / 300) + 1;

  /**
   * @returns `true` if cog groups chnaged, `false` otherwhise
   */
  function tick() {
    const cogGroup = activeCogGroup();
    if (!cogGroup) return true;

    const newCogGroup = moveCogGroup(cogs(), cogGroup, [0, 1], grid.size);

    // TODO: let extra move once touch something
    if (!isCogGroupTouchingSomething(cogs(), newCogGroup, grid)) {
      setActiveCogGroup(newCogGroup);
      return false;
    }

    const newCogs = [...cogs(), ...newCogGroup];
    const newCogsAfterDelete = checkAndRemoveCompleteLines([...cogs(), ...newCogGroup], grid);

    const deletedCogs = newCogs.length - newCogsAfterDelete.length;
    if (deletedCogs) setScore(score() + deletedCogs * 10);

    setCogs(computeCogsRotation(newCogsAfterDelete));
    setActiveCogGroup(getNextCogGroup());

    return true;
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

  function confirm() {
    let ok = false;

    do {
      ok = tick();
    } while (!ok);
    // TODO: implement
  }

  function reset() {
    setCogs([]);
    setActiveCogGroup(getNextCogGroup());
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
    moveBottom: () => {
      moveActive([0, 1]);
      setScore(score() + 1);
    },
    confirm,
    nextCogGroups,
    reset,
    level,
  };
}
