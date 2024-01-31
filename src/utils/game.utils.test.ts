import { describe, expect, it } from "vitest";
import { Cog, Grid, Rotation } from "../model";
import { checkAndRemoveCompleteLines, getCompleteLines, removeLine } from "./game.utils";

describe(removeLine.name, () => {
  it("should remove a simple line", () => {
    const cogA: Cog = { position: [0, 0], rotation: Rotation.Clockwise };
    const cogB: Cog = { position: [1, 0], rotation: Rotation.Anti };
    const cogC: Cog = { position: [1, 1], rotation: Rotation.Clockwise };

    const result = removeLine([cogA, cogB, cogC], 0);

    expect(result).toHaveLength(1);
    expect(result[0]).toStrictEqual({ position: [1, 1], rotation: Rotation.Clockwise });
  });

  it("should remove a line and move", () => {
    const cogA: Cog = { position: [0, 1], rotation: Rotation.Clockwise };
    const cogB: Cog = { position: [1, 1], rotation: Rotation.Anti };
    const cogC: Cog = { position: [1, 0], rotation: Rotation.Clockwise };

    const result = removeLine([cogA, cogB, cogC], 1);

    expect(result).toHaveLength(1);
    expect(result[0]).toStrictEqual({ position: [1, 1], rotation: Rotation.Clockwise });
  });
});

describe(checkAndRemoveCompleteLines.name, () => {
  it("should not do anything", () => {
    const cogA: Cog = { position: [0, 0], rotation: Rotation.Clockwise };
    const cogB: Cog = { position: [1, 1], rotation: Rotation.Anti };

    const res = checkAndRemoveCompleteLines([cogA, cogB], { size: [2, 2] });

    expect(res).toHaveLength(2);
    expect(res).toStrictEqual([cogA, cogB]);
  });

  it("should remove a single line", () => {
    const cogA: Cog = { position: [0, 0], rotation: Rotation.Clockwise };
    const cogB: Cog = { position: [1, 0], rotation: Rotation.Anti };

    const res = checkAndRemoveCompleteLines([cogA, cogB], { size: [2, 2] });

    expect(res).toHaveLength(0);
  });

  it("should remove multiples lines", () => {
    const cogA: Cog = { position: [0, 0], rotation: Rotation.Clockwise };
    const cogB: Cog = { position: [0, 1], rotation: Rotation.Anti };
    const cogC: Cog = { position: [1, 0], rotation: Rotation.Anti };
    const cogD: Cog = { position: [1, 1], rotation: Rotation.Clockwise };

    const res = checkAndRemoveCompleteLines([cogA, cogB, cogC, cogD], { size: [2, 2] });

    expect(res).toHaveLength(0);
  });
});

describe(getCompleteLines.name, () => {
  const grid: Grid = {
    size: [2, 2],
  };

  it("should detect 1 lines", () => {
    const cogA: Cog = { position: [0, 0], rotation: Rotation.Clockwise };
    const cogB: Cog = { position: [0, 1], rotation: Rotation.Anti };
    const cogC: Cog = { position: [1, 0], rotation: Rotation.Anti };
    const cogD: Cog = { position: [2, 2], rotation: Rotation.Anti };

    const res = getCompleteLines([cogA, cogB, cogC, cogD], grid);

    expect(res).toStrictEqual([0]);
  });

  it("should detect 2 lines", () => {
    const cogA: Cog = { position: [0, 0], rotation: Rotation.Clockwise };
    const cogB: Cog = { position: [0, 1], rotation: Rotation.Anti };
    const cogC: Cog = { position: [1, 0], rotation: Rotation.Anti };
    const cogD: Cog = { position: [1, 1], rotation: Rotation.Clockwise };

    const res = getCompleteLines([cogA, cogB, cogC, cogD], grid);

    expect(res).toStrictEqual([0, 1]);
  });
});
