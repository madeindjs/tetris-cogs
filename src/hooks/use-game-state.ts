import { createSignal } from "solid-js";
import { RotationDirection, type Cog, type Grid } from "../model";
import { computeRotationDirection, getNeighborsCogs, isColliding, isSameCog, moveCog } from "../utils/cog.utils";

export function useGameState(grid: Grid, tickMove = 10) {
  const buildDefaultCog = (): Cog => ({
    position: [10, 0],
    size: grid.gap,
    rotationDirection: RotationDirection.Clockwise,
  });

  const [activeCog, setActiveCog] = createSignal<Cog | undefined>(buildDefaultCog());
  const [cogs, setCogs] = createSignal<Cog[]>([]);

  function tick() {
    const cog = activeCog();
    if (!cog) return;

    const newCog = moveCog(cogs(), cog, grid, [0, tickMove]);

    // cog succeed to move, OK
    if (isSameCog(newCog, cog)) {
      addStaticCog(newCog);
    } else {
      setActiveCog(newCog);
    }
  }

  function addStaticCog(cog: Cog) {
    const colliding = getNeighborsCogs(cog, cogs());
    if (!colliding.length) {
      setCogs([...cogs(), cog]);
      setActiveCog(buildDefaultCog());
      return;
    }

    const newRotationDirection = colliding.reduce(
      (acc, c) => computeRotationDirection(acc, c.rotationDirection),
      cog.rotationDirection
    );

    //  add a new cog
    setCogs([...cogs(), { ...cog, rotationDirection: newRotationDirection }]);
    setActiveCog(undefined);

    const newCog = buildDefaultCog();

    if (!isColliding(newCog, cogs())) {
      setActiveCog(newCog);
    }
  }

  function moveLeft() {
    const cog = activeCog();
    if (!cog) return;
    setActiveCog(moveCog(cogs(), cog, grid, [-grid.gap, 0]));
  }

  function moveRight() {
    const cog = activeCog();
    if (!cog) return;
    setActiveCog(moveCog(cogs(), cog, grid, [grid.gap, 0]));
  }

  function moveBottom() {
    tick();
  }

  return {
    cogs: () => [...cogs(), activeCog()].filter((c) => c !== undefined),
    tick,
    moveLeft,
    moveRight,
    moveBottom,
  };
}
