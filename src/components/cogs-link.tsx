import type { Point } from "../model";

type Props = {
  from: Point;
  to: Point;
  error?: boolean;
};

export default function CogsLink({ from, to, error }: Props) {
  return (
    <g aria-label="Link">
      <line
        x1={from[0]}
        y1={from[1]}
        x2={to[0]}
        y2={to[1]}
        stroke-width={0.05}
        class={error ? "stroke-error" : "stroke-base-content"}
      />
      <Handle point={from} error={error} />
      <Handle point={to} error={error} />
    </g>
  );
}

type HandleProps = { point: Point; error?: boolean };

function Handle({ point: [x, y], error }: HandleProps) {
  return (
    <circle
      cx={x}
      cy={y}
      r={0.1}
      stroke-width={0.05}
      class={(error ? "stroke-error" : "stroke-base-content") + " fill-base-300"}
    />
  );
}
