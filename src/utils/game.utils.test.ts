import { describe, expect, it } from "vitest";
import type { Cog, Grid, Line } from "../model";
import { RotationDirection } from "../model";
import { buildLinks, getCompleteLines, removeLine } from "./game.utils";

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

describe(removeLine.name, () => {
  it("should remove a simple line", () => {
    const cogA: Cog = { position: [0, 0], rotationDirection: RotationDirection.Clockwise, size: 1 };
    const cogB: Cog = { position: [2, 0], rotationDirection: RotationDirection.Anti, size: 1 };
    const cogC: Cog = { position: [2, 2], rotationDirection: RotationDirection.Clockwise, size: 1 };

    const result = removeLine([cogA, cogB, cogC], 0, 1);

    expect(result.cogs).toHaveLength(1);
    expect(result.cogs[0]).toStrictEqual({ position: [2, 2], rotationDirection: RotationDirection.Clockwise, size: 1 });

    expect(result.links).toHaveLength(0);
  });

  it("should remove a line and move", () => {
    const cogA: Cog = { position: [0, 0], rotationDirection: RotationDirection.Clockwise, size: 1 };
    const cogB: Cog = { position: [0, 2], rotationDirection: RotationDirection.Anti, size: 1 };
    const cogC: Cog = { position: [2, 2], rotationDirection: RotationDirection.Clockwise, size: 1 };

    const result = removeLine([cogA, cogB, cogC], 2, 1);

    expect(result.cogs).toHaveLength(1);
    expect(result.cogs[0]).toStrictEqual({ position: [0, 2], rotationDirection: RotationDirection.Clockwise, size: 1 });

    expect(result.links).toHaveLength(0);
  });
});

describe(buildLinks.name, () => {
  it("should build links", () => {
    const cogA: Cog = { position: [0, 0], rotationDirection: RotationDirection.Clockwise, size: 1 };
    const cogB: Cog = { position: [2, 0], rotationDirection: RotationDirection.Anti, size: 1 };
    const cogC: Cog = { position: [2, 2], rotationDirection: RotationDirection.Clockwise, size: 1 };
    const cogD: Cog = { position: [10, 10], rotationDirection: RotationDirection.Clockwise, size: 1 };

    const links = buildLinks([cogA, cogB, cogC, cogD]);

    expect(links).toHaveLength(2);

    const linkA: Line = [cogA.position, cogB.position];
    const linkB: Line = [cogB.position, cogC.position];
    expect(links).toStrictEqual([linkA, linkB]);
  });
});
