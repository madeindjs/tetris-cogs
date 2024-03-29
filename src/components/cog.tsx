import { For, type Accessor } from "solid-js";
import { Rotation, type Point } from "../model";

type Props = {
  size: Accessor<number>;
  position: Accessor<Point>;
  rotation: Accessor<Rotation>;
  shadow?: boolean;
};

/**
 * Represent a simple cog as SVG.
 */
export default function Cog({ size, position, rotation, shadow }: Props) {
  const color = () => (shadow ? "fill-base-100" : getCogColor(rotation()));
  const radius = () => size() / 2;
  const toothOfsset = () => radius() * 0.15;
  const baseCircleRadius = () => radius() - toothOfsset();
  const innerCircleRadius = () => baseCircleRadius() / 2;
  const x = () => position()[0];
  const y = () => position()[1];

  function Tooth(props: { rotation: number }) {
    const transform = `rotate(${props.rotation} ${x()} ${y()})`;
    return (
      <rect
        x={x() - toothOfsset() / 2}
        y={y() - radius()}
        width={toothOfsset()}
        height={size()}
        class={color()}
        rx={toothOfsset()}
        transform={transform}
        stroke-dasharray={shadow ? "0.1" : undefined}
        stroke-width={shadow ? "0.1" : undefined}
        stroke={shadow ? "fill-base-content" : undefined}
      />
    );
  }

  return (
    <g aria-label="Cog" class={"fill-base-300"}>
      {!shadow && <For each={[0, 20, 40, 60, 80, 100, 120, 140, 160]}>{(angle) => <Tooth rotation={angle} />}</For>}
      <circle
        r={baseCircleRadius()}
        cx={x()}
        cy={y()}
        class={color() + (shadow ? " stroke-current" : "")}
        stroke-dasharray={shadow ? "0.1" : undefined}
        stroke-width={shadow ? "0.05" : undefined}
        stroke={shadow ? "fill-base-content" : undefined}
      />
      <circle r={innerCircleRadius()} cx={x()} cy={y()} fill="white" class="fill-base-300" />
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from={`0 ${x()} ${y()}`}
        to={`${rotation() * 360} ${x()} ${y()}`}
        dur="10s"
        repeatCount="indefinite"
      />
    </g>
  );
}

function getCogColor(rotation: Rotation) {
  switch (rotation) {
    case Rotation.Clockwise:
      return "fill-blue-700";
    case Rotation.Anti:
      return "fill-green-700";
    case Rotation.None:
      return "fill-base-content";
  }
}
