import { describe, expect, it } from "vitest";
import { isCirclesIntersect } from "./geometry.utils";

describe(isCirclesIntersect.name, () => {
  it("should intersect", () => {
    expect(isCirclesIntersect(0, 0, 10, 4, 0, 2)).toBe(true);
  });

  it("should not intersect", () => {
    expect(isCirclesIntersect(0, 0, 10, 100, 100, 2)).toBe(false);
  });
});
