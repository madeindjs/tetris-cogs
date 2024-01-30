import { describe, expect, it } from "vitest";
import type { Cog, Grid, Line } from "../model";
import { Rotation } from "../model";
import { buildLinks, checkAndRemoveCompleteLines, getCompleteLines, removeLine } from "./game.utils";

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

describe(removeLine.name, () => {
  it("should remove a simple line", () => {
    const cogA: Cog = { position: [0, 0], rotation: Rotation.Clockwise };
    const cogB: Cog = { position: [1, 0], rotation: Rotation.Anti };
    const cogC: Cog = { position: [1, 1], rotation: Rotation.Clockwise };

    const result = removeLine([cogA, cogB, cogC], 0);

    expect(result.cogs).toHaveLength(1);
    expect(result.cogs[0]).toStrictEqual({ position: [1, 1], rotation: Rotation.Clockwise });

    expect(result.links).toHaveLength(0);
  });

  it("should remove a line and move", () => {
    const cogA: Cog = { position: [0, 1], rotation: Rotation.Clockwise };
    const cogB: Cog = { position: [1, 1], rotation: Rotation.Anti };
    const cogC: Cog = { position: [1, 0], rotation: Rotation.Clockwise };

    const result = removeLine([cogA, cogB, cogC], 1);

    expect(result.cogs).toHaveLength(1);
    expect(result.cogs[0]).toStrictEqual({ position: [1, 1], rotation: Rotation.Clockwise });

    expect(result.links).toHaveLength(0);
  });
});

describe(buildLinks.name, () => {
  it("should build links", () => {
    const cogA: Cog = { position: [0, 0], rotation: Rotation.Clockwise };
    const cogB: Cog = { position: [1, 0], rotation: Rotation.Anti };
    const cogC: Cog = { position: [1, 1], rotation: Rotation.Clockwise };
    const cogD: Cog = { position: [10, 10], rotation: Rotation.Clockwise };

    const links = buildLinks([cogA, cogB, cogC, cogD]);

    expect(links).toHaveLength(2);

    const linkA: Line = [cogA.position, cogB.position];
    const linkB: Line = [cogB.position, cogC.position];
    expect(links).toStrictEqual([linkA, linkB]);
  });
});

describe(checkAndRemoveCompleteLines.name, () => {
  it("should not do anything", () => {
    const cogA: Cog = { position: [0, 0], rotation: Rotation.Clockwise };
    const cogB: Cog = { position: [1, 1], rotation: Rotation.Anti };
    const linkAB: Line = [cogA.position, cogB.position];

    const res = checkAndRemoveCompleteLines([cogA, cogB], [linkAB], { size: [2, 2] });

    expect(res.cogs).toHaveLength(2);
    expect(res.cogs).toStrictEqual([cogA, cogB]);
    expect(res.links).toHaveLength(1);
    expect(res.links).toStrictEqual([linkAB]);
  });

  it("should remove a single line", () => {
    const cogA: Cog = { position: [0, 0], rotation: Rotation.Clockwise };
    const cogB: Cog = { position: [1, 0], rotation: Rotation.Anti };
    const linkAB: Line = [cogA.position, cogB.position];

    const res = checkAndRemoveCompleteLines([cogA, cogB], [linkAB], { size: [2, 2] });

    expect(res.cogs).toHaveLength(0);
    expect(res.links).toHaveLength(0);
  });

  it("should remove multiples lines", () => {
    const cogA: Cog = { position: [0, 0], rotation: Rotation.Clockwise };
    const cogB: Cog = { position: [0, 1], rotation: Rotation.Anti };
    const cogC: Cog = { position: [1, 0], rotation: Rotation.Anti };
    const cogD: Cog = { position: [1, 1], rotation: Rotation.Clockwise };
    const linkAB: Line = [cogA.position, cogB.position];
    const linkAC: Line = [cogA.position, cogC.position];
    const linkCD: Line = [cogC.position, cogD.position];

    const res = checkAndRemoveCompleteLines([cogA, cogB], [linkAB, linkAC, linkCD], { size: [2, 2] });

    expect(res.cogs).toHaveLength(0);
    expect(res.links).toHaveLength(0);
    // expect(res.removeCount).toBe(4);
  });
});

// describe(computeCogsRotation.name, () => {});
