export function isCirclesIntersect(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number) {
  // Calculate the distance between the centers of the circles
  const distanceBetweenCenters = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  // Check if the distance is less than the sum of the radii
  return distanceBetweenCenters < r1 + r2;
}
