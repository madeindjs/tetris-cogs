import { describe, expect, it } from "vitest";
import { Grid, Line } from "../model";
import { getCompleteLines } from "./game.utils";

describe(getCompleteLines.name, () => {
  const grid: Grid = {
    gap: 1,
    viewBox: [0, 0, 4, 4],
  };

  it("should detect 1 lines", () => {
    const links: Line[] = [
      [
        [0, 0],
        [2, 0],
      ],
    ];

    const res = getCompleteLines(links, grid);

    expect(res).toStrictEqual([0]);
  });

  it("should detect 2 lines", () => {
    const links: Line[] = [
      [
        [0, 0],
        [0, 2],
      ],
      [
        [2, 0],
        [2, 2],
      ],
    ];

    const res = getCompleteLines(links, grid);

    expect(res).toStrictEqual([0, 2]);
  });
});
