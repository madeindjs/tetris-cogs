import type { Line } from "../model";
import { isSamePoint } from "../utils/geometry.utils";

export function useLines() {
  const lines: Line[] = [];

  function addLine(line: Line) {
    const exists = lines.some(([from, to]) => line.every((p) => isSamePoint(p, from) || isSamePoint(p, to)));
    if (!exists) lines.push(line);
  }

  return { lines, addLine };
}
