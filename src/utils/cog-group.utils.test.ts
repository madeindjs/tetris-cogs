import { describe, expect, it } from "vitest";
import { Cog, CogGroupShape, Rotation } from "../model";
import { buildCogGroup } from "./cog-group.utils";

describe(buildCogGroup.name, () => {
  const cog: Cog = { position: [0, 0], rotation: Rotation.Clockwise };

  it.each([
    CogGroupShape.I,
    CogGroupShape.J,
    CogGroupShape.L,
    CogGroupShape.O,
    CogGroupShape.S,
    CogGroupShape.T,
    CogGroupShape.Z,
  ])("Should compute shape %s", (shape) => {
    expect(buildCogGroup(cog, shape)).toMatchSnapshot();
  });
});
