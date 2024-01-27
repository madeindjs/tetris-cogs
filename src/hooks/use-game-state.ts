import { createSignal } from "solid-js";
import { RotationDirection, type Cog, type Grid } from "../model";
import { isSameCog, moveCog } from "../utils/cog.utils";

export function useGameState(grid: Grid) {
  const [activeCog, setActiveCog] = createSignal<Cog>({
    position: [10, 0],
    size: 10,
    rotationDirection: RotationDirection.Clockwise,
  });

  const [cogs, setCogs] = createSignal<Cog[]>([
    { position: [10, 90], size: 10, rotationDirection: RotationDirection.Clockwise },
  ]);

  function tick() {
    const newCog = moveCog(cogs(), activeCog(), grid, [0, grid.gap]);

    if (isSameCog(newCog, activeCog())) {
      setCogs([...cogs(), newCog]);
      setActiveCog({
        position: [10, 0],
        size: 10,
        rotationDirection: RotationDirection.Clockwise,
      });
    } else {
      setActiveCog(newCog);
    }
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
