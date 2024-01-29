import { For, type Accessor } from "solid-js";
import { RotationDirection, type Point } from "../model";

type Props = {
  size: Accessor<number>;
  position: Accessor<Point>;
  rotationDirection: Accessor<RotationDirection>;
};

export default function Cog({ size, position, rotationDirection }: Props) {
  const color = () => getCogColor(rotationDirection());

  const toothOfsset = () => size() * 0.15;
  const baseCircleRadius = () => size() - toothOfsset();
  const innerCircleRadius = () => baseCircleRadius() / 2;

  const x = () => position()[0];
  const y = () => position()[1];

  function Tooth(props: { rotation: number }) {
    const transform = `rotate(${props.rotation} ${x()} ${y()})`;
    return (
      <rect
        x={x() - 1}
        y={y() - size()}
        width={toothOfsset()}
        height={size() * 2}
        class={color()}
        rx={toothOfsset()}
        transform={transform}
      />
    );
  }

  return (
    <g aria-describedby="cog">
      <circle r={baseCircleRadius()} cx={x()} cy={y()} class={color()} />
      <For each={[0, 20, 40, 60, 80, 100, 120, 140, 160]}>{(angle) => <Tooth rotation={angle} />}</For>
      <circle r={innerCircleRadius()} cx={x()} cy={y()} fill="white" class="fill-base-300" />
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from={`0 ${x()} ${y()}`}
        to={`${rotationDirection() * 360} ${x()} ${y()}`}
        dur="10s"
        repeatCount="indefinite"
      />
    </g>
  );
}

function getCogColor(rotationDirection: RotationDirection) {
  switch (rotationDirection) {
    case RotationDirection.Clockwise:
      return "fill-blue-700";
    case RotationDirection.Anti:
      return "fill-green-700";
    case RotationDirection.None:
      return "fill-base-content";
  }
}
