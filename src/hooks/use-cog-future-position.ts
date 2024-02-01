import { createMemo, type Accessor } from "solid-js";
import type { Cog, CogGroup, Grid } from "../model";
import { isCogGroupTouchingSomething, moveCogGroup } from "../utils/cog-group.utils";

export function useCogFuturePosition(cogs$: Accessor<Cog[]>, active$: Accessor<CogGroup>, grid: Grid) {
  return createMemo(() => {
    const cogs = cogs$();
    let active = active$();

    while (!isCogGroupTouchingSomething(cogs, active, grid)) {
      active = moveCogGroup(cogs, active, [0, 1], grid.size);
    }

    return active;
  });
}
