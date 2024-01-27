import { For } from "solid-js";
import type { Cog as CogProps } from "../model";

export default function Cog({ size, position: [x, y], rotationDirection }: CogProps) {
  const color = "red";

  function Tooth(props: { rotation: number }) {
    const transform = `rotate(${props.rotation} ${x} ${y})`;
    return <rect x={x - 1} y={y - size} width={2} height={size * 2} fill={color} rx={2} transform={transform} />;
  }

  return (
    <g aria-describedby="cog">
      <circle r={size - 2} cx={x} cy={y} fill={color} />
      <For each={[0, 20, 40, 60, 80, 100, 120, 140, 160]}>{(angle) => <Tooth rotation={angle} />}</For>
      <circle r={5} cx={x} cy={y} fill="white" />
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from={`0 ${x} ${y}`}
        to={`${rotationDirection * 360} ${x} ${y}`}
        dur="10s"
        repeatCount="indefinite"
      />
    </g>
  );
}
