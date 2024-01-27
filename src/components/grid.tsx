import { For } from "solid-js";
import type { ViewBox } from "../model";

type Props = {
  viewBox: ViewBox;
  gap: number;
};

type LinePoints = [x1: number, y1: number, x2: number, y2: number];

export default function Grid({ viewBox: [x, y, width, height], gap }: Props) {
  function* getColumns(): Generator<LinePoints> {
    for (let i = x; i <= width; i += gap) {
      yield [i, 0, i, height];
    }
  }

  function* getRows(): Generator<LinePoints> {
    for (let i = x; i <= height; i += gap) {
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
        {([x1, y1, x2, y2]) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="gray" />}
      </For>
    </g>
  );
}
