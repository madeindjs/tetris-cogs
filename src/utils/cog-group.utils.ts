import { Cog, CogGroup, CogGroupShape, Grid, GridSize, Point } from "../model";
import { getNeighborsCogsBottom, getOppositeRotation } from "./cog.utils";
import { isPointInsideArea, isSamePoint, movePoint } from "./geometry.utils";

function getRandomCogGroupShape(): CogGroupShape {
  const enumValues = Object.values(CogGroupShape);
  const index = Math.floor(Math.random() * enumValues.length);
  return enumValues[index] as CogGroupShape;
}

export function buildCogGroup(origin: Cog, shape: CogGroupShape = getRandomCogGroupShape()): CogGroup {
  const { position, rotation } = origin;

  switch (shape) {
    case CogGroupShape.I:
      return [
        origin,
        { position: movePoint(position, [0, 1]), rotation: getOppositeRotation(rotation) },
        { position: movePoint(position, [0, 2]), rotation },
        { position: movePoint(position, [0, 3]), rotation: getOppositeRotation(rotation) },
      ];
    case CogGroupShape.J:
      return [
        origin,
        { position: movePoint(position, [0, 1]), rotation: getOppositeRotation(rotation) },
        { position: movePoint(position, [1, 1]), rotation },
        { position: movePoint(position, [2, 1]), rotation: getOppositeRotation(rotation) },
      ];
    case CogGroupShape.L:
      return [
        origin,
        { position: movePoint(position, [0, 1]), rotation: getOppositeRotation(rotation) },
        { position: movePoint(position, [0, 2]), rotation },
        { position: movePoint(position, [1, 2]), rotation: getOppositeRotation(rotation) },
      ];
    case CogGroupShape.O:
      return [
        origin,
        { position: movePoint(position, [0, 1]), rotation: getOppositeRotation(rotation) },
        { position: movePoint(position, [1, 0]), rotation: getOppositeRotation(rotation) },
        { position: movePoint(position, [1, 1]), rotation },
      ];
    case CogGroupShape.S:
      return [
        origin,
        { position: movePoint(position, [1, 0]), rotation: getOppositeRotation(rotation) },
        { position: movePoint(position, [0, 1]), rotation: getOppositeRotation(rotation) },
        { position: movePoint(position, [-1, 1]), rotation },
      ];
    case CogGroupShape.T:
      return [
        origin,
        { position: movePoint(position, [-1, 0]), rotation: getOppositeRotation(rotation) },
        { position: movePoint(position, [1, 0]), rotation: getOppositeRotation(rotation) },
        { position: movePoint(position, [0, 1]), rotation: getOppositeRotation(rotation) },
      ];
    case CogGroupShape.Z:
      return [
        origin,
        { position: movePoint(position, [-1, 0]), rotation: getOppositeRotation(rotation) },
        { position: movePoint(position, [0, 1]), rotation: getOppositeRotation(rotation) },
        { position: movePoint(position, [1, 1]), rotation },
      ];
  }
}

export function moveCogGroup(existing: Cog[], group: CogGroup, offset: Point, gridSize: GridSize): CogGroup {
  const newGroup: CogGroup = group.map((c) => ({ ...c, position: movePoint(c.position, offset) }));

  const canMove = newGroup.every((c) => {
    return isPointInsideArea(c.position, gridSize) && !existing.some((e) => isSamePoint(e.position, c.position));
  });

  return canMove ? newGroup : group;
}

function average(numbers: number[]): number {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum / numbers.length;
}

function getCogGroupCenterPoint(group: CogGroup): Point {
  const points = group.map((g) => g.position);
  return [Math.round(average(points.map((p) => p[0]))), Math.round(average(points.map((p) => p[1])))];
}

export function rotateGroup(group: CogGroup) {
  const [cx, cy] = getCogGroupCenterPoint(group);

  let rotatedShape: CogGroup = [];

  for (const cog of group) {
    const x = cog.position[0] - cx;
    const y = cog.position[1] - cy;
    const xNew = cx + y;
    const yNew = cy - x;
    rotatedShape.push({ ...cog, position: [xNew, yNew] });
  }

  return rotatedShape;
}

export function isCogGroupTouchingSomething(cogs: Cog[], group: CogGroup, grid: Grid) {
  if (group.some((c) => c.position[1] === grid.size[1] - 1)) return true;
  return group.some((cog) => getNeighborsCogsBottom(cog, cogs) !== undefined);
}
