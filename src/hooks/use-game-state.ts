import { createSignal } from "solid-js";
import { RotationDirection, type Cog, type Grid } from "../model";
import { computeRotationDirection, getNeighborsCogs, isSameCog, moveCog } from "../utils/cog.utils";

export function useGameState(grid: Grid, tickMove = 10) {
  const buildDefaultCog = (): Cog => ({
    position: [10, 0],
    size: grid.gap,
    rotationDirection: RotationDirection.Clockwise,
  });

  const [activeCog, setActiveCog] = createSignal<Cog>(buildDefaultCog());
  const [cogs, setCogs] = createSignal<Cog[]>([]);

  function tick() {
    const newCog = moveCog(cogs(), activeCog(), grid, [0, tickMove]);

    // cog succeed to move, OK
    if (isSameCog(newCog, activeCog())) {
      addStaticCog(newCog);
    } else {
      setActiveCog(newCog);
    }
  }

  function addStaticCog(cog: Cog) {
    const colliding = getNeighborsCogs(cog, cogs());
    console.log(colliding);
    if (!colliding.length) {
      setCogs([...cogs(), cog]);
      setActiveCog(buildDefaultCog());
      return;
    }

    const newRotationDirection = colliding.reduce(
      (acc, c) => computeRotationDirection(acc, c.rotationDirection),
      cog.rotationDirection
    );
    const newCog: Cog = {
      ...cog,
      rotationDirection: newRotationDirection,
    };

    setCogs([...cogs(), newCog]);
    setActiveCog({
      position: [10, 0],
      size: 10,
      rotationDirection: RotationDirection.Clockwise,
    });
  }

  /**
   * Compute the new rotation.
   */
  function cleanup() {
    // const newRotationDirection = colliding.reduce(
    //   (acc, c) => computeRotationDirection(acc, c.rotationDirection),
    //   newCog.rotationDirection
    // );
    // return {
    //   ...cog,
    //   rotationDirection: newRotationDirection,
    // };
  }

  function moveLeft() {
    setActiveCog(moveCog(cogs(), activeCog(), grid, [-grid.gap, 0]));
  }

  function moveRight() {
    setActiveCog(moveCog(cogs(), activeCog(), grid, [grid.gap, 0]));
  }

  function moveBottom() {
    tick();
  }

  return {
    cogs: () => [...cogs(), activeCog()],
    tick,
    moveLeft,
    moveRight,
    moveBottom,
  };
}
