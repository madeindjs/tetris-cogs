import { createEffect, createSignal, on } from "solid-js";
import type { Cog, CogGroup, Grid, Line } from "../model";
import { GameStatus, RotationDirection } from "../model";
import { buildCogGroup, getLinksFromGroup, moveCogGroup } from "../utils/cog-group.utils";
import { getNeighborsCogs, getNeighborsCogsBottom } from "../utils/cog.utils";
import { checkAndRemoveCompleteLines, computeCogsRotation } from "../utils/game.utils";
import { useLines } from "./use-lines";

function getRandomDirection(): RotationDirection {
  const rand = Math.random();
  if (rand < 1 / 3) {
    return RotationDirection.Anti;
  } else if (rand > 2 / 3) {
    return RotationDirection.Clockwise;
  } else {
    return RotationDirection.None;
  }
}

export function useGameState(grid: Grid) {
  const buildDefaultCog = (): Cog => ({
    position: [grid.size[0] / 2, 0],
    rotationDirection: getRandomDirection(),
  });

  const buildDefaultCogGroup = () => buildCogGroup(buildDefaultCog());

  const [gameStatus, setGameStatus] = createSignal(GameStatus.InProgress);
  const [activeCogGroup, setActiveCogGroup] = createSignal<CogGroup | undefined>(buildDefaultCogGroup());
  const [nextCogGroup, setNextCogGroup] = createSignal(buildDefaultCogGroup());
  const [cogs, setCogs] = createSignal<Cog[]>([]);
  const [links, setLinks] = createSignal<Line[]>([]);
  const [brokenLinks, setBrokenLinks] = createSignal<Line[]>([]);
  const [score, setScore] = createSignal(0);

  function tick() {
    if (gameStatus() === GameStatus.Loose) return false;

    const cogGroup = activeCogGroup();
    if (!cogGroup) return;

    const newCogGroup = moveCogGroup(cogs(), cogGroup, [0, 1], grid.size);

    const { lines: newLinks, addLine } = useLines();

    for (const cog of newCogGroup) {
      const nBottom = getNeighborsCogsBottom(cog, cogs());
      if (!nBottom && newLinks.length === 0) continue;
      const neighbors = getNeighborsCogs(cog, cogs());
      for (const neighbor of neighbors) addLine([neighbor.position, cog.position]);
    }

    const touchSomething = newLinks.length !== 0;
    const touchBottom = newCogGroup.some((c) => c.position[1] === grid.size[1] - 1);

    if (!touchSomething && !touchBottom) return setActiveCogGroup(newCogGroup);

    setCogs([...cogs(), ...newCogGroup]);
    setLinks([...links(), ...newLinks, ...getLinksFromGroup(newCogGroup)]);
    setActiveCogGroup(nextCogGroup());
    setNextCogGroup(buildDefaultCogGroup());
  }

  createEffect(
    on(
      () => links(),
      (current) => {
        const {
          cogs: cogsAfterRemove,
          links: linksAfterRemove,
          removeCount,
        } = checkAndRemoveCompleteLines(cogs(), current, grid);

        setScore(score() + removeCount);

        const result = computeCogsRotation(cogsAfterRemove, linksAfterRemove);

        setCogs(result.cogs);
        if (result.brokenLinks) setBrokenLinks([...brokenLinks(), ...result.brokenLinks]);
      }
    )
  );

  createEffect(
    on(
      () => brokenLinks(),
      (current) => {
        if (current.length > 0) setGameStatus(GameStatus.Loose);
      }
    )
  );

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
    setLinks([]);
    setBrokenLinks([]);
    setGameStatus(GameStatus.InProgress);
    setScore(0);
  }

  return {
    cogs: () => [...cogs(), ...(activeCogGroup() ?? [])] as Cog[],
    tick,
    links,
    gameStatus,
    score,
    moveLeft: () => moveActive(-1),
    moveRight: () => moveActive(1),
    moveBottom: tick,
    nextCogGroup,
    brokenLinks,
    reset,
  };
}
