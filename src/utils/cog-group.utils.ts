import { useLines } from "../hooks/use-lines";
import { Cog, CogGroup, CogGroupShape, GridSize, Point } from "../model";
import { getNeighborsCogs, getOppositeRotation, isSameCog } from "./cog.utils";
import { isPointInsideArea, isSamePoint, movePoint } from "./geometry.utils";

export function getRandomCogGroupShape(): CogGroupShape {
  const enumValues = Object.values(CogGroupShape);
  const index = Math.floor(Math.random() * enumValues.length);
  return enumValues[index] as CogGroupShape;
}

export function buildCogGroup(origin: Cog, shape: CogGroupShape = getRandomCogGroupShape()): CogGroup {
  const { position, rotationDirection } = origin;

  switch (shape) {
    case CogGroupShape.I:
      return [
        origin,
        { position: movePoint(position, [0, 1]), rotationDirection: getOppositeRotation(rotationDirection) },
        { position: movePoint(position, [0, 2]), rotationDirection },
        { position: movePoint(position, [0, 3]), rotationDirection: getOppositeRotation(rotationDirection) },
      ];
    case CogGroupShape.J:
      return [
        origin,
        { position: movePoint(position, [0, 1]), rotationDirection: getOppositeRotation(rotationDirection) },
        { position: movePoint(position, [1, 1]), rotationDirection },
        { position: movePoint(position, [2, 1]), rotationDirection: getOppositeRotation(rotationDirection) },
      ];
    case CogGroupShape.L:
      return [
        origin,
        { position: movePoint(position, [0, 1]), rotationDirection: getOppositeRotation(rotationDirection) },
        { position: movePoint(position, [0, 2]), rotationDirection },
        { position: movePoint(position, [1, 2]), rotationDirection: getOppositeRotation(rotationDirection) },
      ];
    case CogGroupShape.O:
      return [
        origin,
        { position: movePoint(position, [0, 1]), rotationDirection: getOppositeRotation(rotationDirection) },
        { position: movePoint(position, [1, 0]), rotationDirection: getOppositeRotation(rotationDirection) },
        { position: movePoint(position, [1, 1]), rotationDirection },
      ];
    case CogGroupShape.S:
      return [
        origin,
        { position: movePoint(position, [1, 0]), rotationDirection: getOppositeRotation(rotationDirection) },
        { position: movePoint(position, [0, 1]), rotationDirection: getOppositeRotation(rotationDirection) },
        { position: movePoint(position, [-1, 1]), rotationDirection },
      ];
    case CogGroupShape.T:
      return [
        origin,
        { position: movePoint(position, [-1, 0]), rotationDirection: getOppositeRotation(rotationDirection) },
        { position: movePoint(position, [1, 0]), rotationDirection: getOppositeRotation(rotationDirection) },
        { position: movePoint(position, [0, 1]), rotationDirection: getOppositeRotation(rotationDirection) },
      ];
    case CogGroupShape.Z:
      return [
        origin,
        { position: movePoint(position, [-1, 0]), rotationDirection: getOppositeRotation(rotationDirection) },
        { position: movePoint(position, [0, 1]), rotationDirection: getOppositeRotation(rotationDirection) },
        { position: movePoint(position, [1, 1]), rotationDirection },
      ];
  }
}

export function isSameCogGroup(a: CogGroup, b: CogGroup) {
  if (a.length !== b.length) return false;
  return a.every((ca) => b.some((cb) => isSameCog(ca, cb)));
}

export function moveCogGroup(existing: Cog[], group: CogGroup, offset: Point, gridSize: GridSize): CogGroup {
  const newGroup: CogGroup = group.map((c) => ({ ...c, position: movePoint(c.position, offset) }));

  const canMove = newGroup.every((c) => {
    return isPointInsideArea(c.position, gridSize) && !existing.some((e) => isSamePoint(e.position, c.position));
  });

  return canMove ? newGroup : group;
}

export function getLinksFromGroup(group: CogGroup) {
  const { lines, addLine } = useLines();

  for (const cog of group) {
    const others = group.filter((c) => !isSameCog(c, cog));
    for (const n of getNeighborsCogs(cog, others)) addLine([n.position, cog.position]);
  }

  return lines;
}
