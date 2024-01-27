import type { Cog as CogProps } from "../model";

export default function Cog({ size, position: [x, y] }: CogProps) {
  return (
    <g aria-describedby="cog">
      <circle r={size} cx={x} cy={y} fill="red" stroke-width={1}></circle>;
    </g>
  );
}
