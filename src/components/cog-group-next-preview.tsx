import { For, type Accessor } from "solid-js";
import type { CogGroup, ViewBox } from "../model";
import Cog from "./cog";
import SVG from "./svg";

type Props = {
  cogGroup: Accessor<CogGroup>;
};

export default function CogGroupNextPreview({ cogGroup }: Props) {
  const viewBox = (): ViewBox => {
    const points = cogGroup().map((c) => c.position);

    const xMin = Math.min(...points.map((c) => c[0]));
    const xMax = Math.max(...points.map((c) => c[0]));
    const yMin = Math.min(...points.map((c) => c[1]));
    const yMax = Math.max(...points.map((c) => c[1]));

    return [xMin - 0.5, yMin - 0.5, xMax - xMin + 1, yMax - yMin + 1];
  };

  return (
    <SVG width={100} height={100} viewBox={viewBox().join(" ")}>
      <For each={cogGroup()}>
        {(cog) => <Cog position={() => cog.position} size={() => 1} rotation={() => cog.rotation} />}
      </For>
    </SVG>
  );
}
