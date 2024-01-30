import { describe, expect, it } from "vitest";
import type { Grid, Line } from "../model";
import { getCompleteLines } from "./game.utils";

describe(getCompleteLines.name, () => {
  const grid: Grid = {
    size: [2, 2],
  };

  it("should detect 1 lines", () => {
    const links: Line[] = [
      [
        [0, 0],
        [1, 0],
      ],
    ];

    const res = getCompleteLines(links, grid);

    expect(res).toStrictEqual([0]);
  });

  it("should detect 2 lines", () => {
    const links: Line[] = [
      [
        [0, 0],
        [1, 0],
      ],
      [
        [0, 1],
        [1, 1],
      ],
    ];

    const res = getCompleteLines(links, grid);

    expect(res).toStrictEqual([0, 1]);
  });
});

// describe(computeCogsRotation.name, () => {});
