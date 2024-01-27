import type { Point } from "../model";

type Props = {
  size: number;
  position: Point;
};

export default function Cog({ size, position: [x, y] }: Props) {
  return (
    <g aria-describedby="cog">
      <circle r={size} cx={x} cy={y} fill="red" stroke-width={1}></circle>;
    </g>
  );
}
