import { createEffect, createSignal, on } from "solid-js";
import type { Cog, Grid, Line, Point } from "../model";
import { GameStatus, RotationDirection } from "../model";
import { getNeighborsCogs, getOppositeRotation, isColliding, isSameCog, moveCog } from "../utils/cog.utils";
import { getCompleteLines, removeLine } from "../utils/game.utils";

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

function getRandomSize(gap: number): number {
  return gap;
  return Math.random() > 0.7 ? gap * 2 : gap;
}

export function useGameState(grid: Grid, tickMove = 10) {
  const buildDefaultCog = (): Cog => ({
    position: [grid.viewBox[2] / 2, 0],
    size: getRandomSize(grid.gap),
    rotationDirection: getRandomDirection(),
  });

  const [gameStatus, setGameStatus] = createSignal(GameStatus.InProgress);
  const [activeCog, setActiveCog] = createSignal<Cog | undefined>(buildDefaultCog());
  const [nextCog, setNextCog] = createSignal(buildDefaultCog());
  const [cogs, setCogs] = createSignal<Cog[]>([]);
  const [links, setLinks] = createSignal<Line[]>([]);
  const [brokenLinks, setBrokenLinks] = createSignal<Line[]>([]);
  const [score, setScore] = createSignal(0);

  function tick() {
    if (gameStatus() === GameStatus.Loose) return false;

    const cog = activeCog();
    if (!cog) return;

    const newCog = moveCog(cogs(), cog, grid, [0, tickMove]);

    // cog succeed to move, OK
    const ok = isSameCog(newCog, cog) ? addStaticCog(newCog) : setActiveCog(newCog);

    if (!ok) return false;
  }

  function getCogOnPoint([x, y]: Point): Cog | undefined {
    return cogs().find((c) => c.position[0] === x && c.position[1] === y);
  }

  function updateCog(old: Cog, current: Cog) {
    const index = cogs().findIndex((c) => isSameCog(c, old));
    if (index === -1) throw Error("cannot find cog");
    const copy = [...cogs()];
    copy[index] = current;
    setCogs(copy);
  }

  /**
   * Check that every lines are coherents
   */
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
      setBrokenLinks([...brokenLinks(), [cogA.position, cogB.position]]);
    }
  }

  createEffect(
    on(
      () => links(),
      (current) => {
        for (const link of current) checkLink(link);

        const completeLines = getCompleteLines(current, grid);

        const result = completeLines.reduce<{ links: Line[]; cogs: Cog[]; removeCount: number }>(
          (acc, v) => {
            const res = removeLine(acc.cogs, v, grid.gap);

            return { ...res, removeCount: acc.removeCount + res.removeCount };
          },
          {
            links: current,
            cogs: cogs(),
            removeCount: 0,
          }
        );

        setCogs(result.cogs);
        setLinks(result.links);
        setScore(score() + result.removeCount);
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

  function addStaticCog(cog: Cog) {
    const colliding = getNeighborsCogs(cog, cogs());
    if (!colliding.length) {
      setCogs([...cogs(), cog]);
      setActiveCog(nextCog());
      setNextCog(buildDefaultCog());
      return true;
    }

    setCogs([...cogs(), cog]);
    setLinks([...links(), ...colliding.map((c) => [c.position, cog.position] as Line)]);

    if (!isColliding(nextCog(), cogs())) {
      setActiveCog(nextCog());
      setNextCog(buildDefaultCog());
      return true;
    } else {
      setGameStatus(GameStatus.Loose);
      setActiveCog(undefined);
      return false;
    }
  }

  function moveActive(direction: -1 | 1) {
    const cog = activeCog();
    if (!cog) return;
    setActiveCog(moveCog(cogs(), cog, grid, [grid.gap * 2 * direction, 0]));
  }

  function reset() {
    setCogs([]);
    setActiveCog(buildDefaultCog());
    setNextCog(buildDefaultCog());
    setLinks([]);
    setBrokenLinks([]);
    setGameStatus(GameStatus.InProgress);
    setScore(0);
  }

  return {
    cogs: () => [...cogs(), activeCog()].filter(Boolean) as Cog[],
    tick,
    links,
    gameStatus,
    score,
    moveLeft: () => moveActive(-1),
    moveRight: () => moveActive(1),
    moveBottom: tick,
    nextCog,
    brokenLinks,
    reset,
  };
}
