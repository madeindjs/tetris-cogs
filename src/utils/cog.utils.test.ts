import { describe, expect, it } from "vitest";
import { Cog, Rotation } from "../model";
import { getOppositeRotation, isSameCog } from "./cog.utils";

describe(isSameCog.name, () => {
  const a: Cog = { position: [0, 0], rotation: Rotation.Anti };
  const b: Cog = { position: [0, 0], rotation: Rotation.Clockwise };

  it("should be same", () => {
    expect(isSameCog(a, a)).toBe(true);
  });

  it("should not be same", () => {
    expect(isSameCog(a, b)).toBe(false);
  });
});

describe(getOppositeRotation.name, () => {
  it("should get anti", () => {
    expect(getOppositeRotation(Rotation.Anti)).toBe(Rotation.Clockwise);
  });

  it("should get clock", () => {
    expect(getOppositeRotation(Rotation.Clockwise)).toBe(Rotation.Anti);
  });

  it("should get same", () => {
    expect(getOppositeRotation(Rotation.None)).toBe(Rotation.None);
  });
});
