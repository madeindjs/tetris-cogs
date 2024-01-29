import { describe, expect, it } from "vitest";
import { Cog, RotationDirection } from "../model";
import { getOppositeRotation, isSameCog } from "./cog.utils";

describe(isSameCog.name, () => {
  const a: Cog = {
    position: [0, 0],
    rotationDirection: RotationDirection.Anti,
    size: 1,
  };

  const b: Cog = {
    position: [0, 0],
    rotationDirection: RotationDirection.Clockwise,
    size: 1,
  };

  it("should be same", () => {
    expect(isSameCog(a, a)).toBe(true);
  });

  it("should not be same", () => {
    expect(isSameCog(a, b)).toBe(false);
  });
});

describe(getOppositeRotation.name, () => {
  it("should get anti", () => {
    expect(getOppositeRotation(RotationDirection.Anti)).toBe(RotationDirection.Clockwise);
  });

  it("should get clock", () => {
    expect(getOppositeRotation(RotationDirection.Clockwise)).toBe(RotationDirection.Anti);
  });

  it("should get same", () => {
    expect(getOppositeRotation(RotationDirection.None)).toBe(RotationDirection.None);
  });
});
