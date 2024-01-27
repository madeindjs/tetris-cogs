import type { Cog as CogProps } from "../model";

export default function Cog({ size, position: [x, y], rotationDirection }: CogProps) {
  return (
    <g aria-describedby="cog">
      <circle r={size} cx={x} cy={y} fill="red" stroke-width={1}></circle>
      {/* line for debugging rotation */}
      <line x1={x} y1={y} x2={x + size} y2={y} stroke="black" />
      <line x1={x} y1={y} x2={x - size} y2={y} stroke="black" />
      <line x1={x} y1={y} x2={x} y2={y + size} stroke="black" />
      <line x1={x} y1={y} x2={x} y2={y - size} stroke="black" />
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from={`0 ${x} ${y}`}
        to={`${rotationDirection === "clock" ? 360 : -360} ${x} ${y}`}
        dur="10s"
        repeatCount="indefinite"
      />
    </g>
  );
}
