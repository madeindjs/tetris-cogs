import type { Accessor } from "solid-js";

type Props = {
  value: Accessor<number>;
};

export default function Countdown({ value }: Props) {
  return (
    <span class="countdown font-mono text-5xl">
      <span style={`--value:${value()}`}></span>
    </span>
  );
}
