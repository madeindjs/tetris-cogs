import { For } from "solid-js";
import type { GridSize } from "../model";

type Props = {
  gridSize: GridSize;
};

type LinePoints = [x1: number, y1: number, x2: number, y2: number];

export default function Grid({ gridSize: [width, height] }: Props) {
  function* getColumns(): Generator<LinePoints> {
    for (let i = 0; i <= width; i += 1) {
      yield [i, 0, i, height];
    }
  }

  function* getRows(): Generator<LinePoints> {
    for (let i = 0; i <= height; i += 1) {
      yield [0, i, width, i];
    }
  }

  function* getLinesPoints(): Generator<LinePoints> {
    yield* getRows();
    yield* getColumns();
  }

  return (
    <g>
      <For each={Array.from(getLinesPoints())}>
        {([x1, y1, x2, y2]) => (
          <line
            x1={x1 - 0.5}
            y1={y1 - 0.5}
            x2={x2 - 0.5}
            y2={y2 - 0.5}
            stroke="lightgray"
            stroke-dasharray="0.1"
            stroke-width={0.05}
            class="stroke-neutral"
          />
        )}
      </For>
    </g>
  );
}
