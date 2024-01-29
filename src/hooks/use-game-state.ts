import { createEffect, createSignal, on } from "solid-js";
import { GameStatus, Point, RotationDirection, type Cog, type Grid } from "../model";
import {
  computeRotationDirection,
  getNeighborsCogs,
  getOppositeRotation,
  isColliding,
  isSameCog,
  moveCog,
} from "../utils/cog.utils";

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

export function useGameState(grid: Grid, tickMove = 10) {
  const buildDefaultCog = (): Cog => ({
    position: [grid.viewBox[2] / 2, 0],
    size: grid.gap,
    rotationDirection: getRandomDirection(),
  });

  const [gameStatus, setGameStatus] = createSignal(GameStatus.InProgress);
  const [activeCog, setActiveCog] = createSignal<Cog | undefined>(buildDefaultCog());
  const [nextCog, setNextCog] = createSignal(buildDefaultCog());
  const [cogs, setCogs] = createSignal<Cog[]>([]);
  const [links, setLinks] = createSignal<[Point, Point][]>([]);
  const [brokenLinks, setBrokenLinks] = createSignal<[Point, Point][]>([]);

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

  function checkLink([from, to]: [Point, Point]) {
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
    setLinks([...links(), ...colliding.map((c) => [c.position, cog.position] as [Point, Point])]);

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

  function checkRotations() {
    let needUpdate = false;

    const newCogs = cogs().map<Cog>((cog) => {
      const others = cogs().filter((c) => isSameCog(c, cog));
      const neighbors = getNeighborsCogs(cog, others);

      // for static cog, just compute the new rotation
      if (cog.rotationDirection === RotationDirection.None) {
        const newRotationDirection = neighbors.reduce(
          (acc, c) => computeRotationDirection(acc, c.rotationDirection),
          RotationDirection.Clockwise
        );
        needUpdate = true;
        return { ...cog, rotationDirection: newRotationDirection };
      }

      const wrong = neighbors.filter((c) => {
        if (c.rotationDirection === RotationDirection.None) return false;
        return c.rotationDirection === cog.rotationDirection;
      });

      console.log(wrong, neighbors);

      if (wrong.length > 0) {
        setBrokenLinks(wrong.map((c) => [c.position, cog.position] as [Point, Point]));
        setGameStatus(GameStatus.Loose);
      }

      return cog;
    });

    if (needUpdate) setCogs(newCogs);
  }

  function moveLeft() {
    const cog = activeCog();
    if (!cog) return;
    setActiveCog(moveCog(cogs(), cog, grid, [-grid.gap * 2, 0]));
  }

  function moveRight() {
    const cog = activeCog();
    if (!cog) return;
    setActiveCog(moveCog(cogs(), cog, grid, [grid.gap * 2, 0]));
  }

  function moveBottom() {
    tick();
  }

  function reset() {
    setCogs([]);
    setActiveCog(buildDefaultCog());
    setNextCog(buildDefaultCog());
    setLinks([]);
    setBrokenLinks([]);
    setGameStatus(GameStatus.InProgress);
  }

  return {
    cogs: () => [...cogs(), activeCog()].filter(Boolean) as Cog[],
    tick,
    links,
    gameStatus,
    moveLeft,
    moveRight,
    moveBottom,
    nextCog,
    brokenLinks,
    reset,
  };
}
