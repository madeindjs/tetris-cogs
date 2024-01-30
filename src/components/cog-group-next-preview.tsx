import { type Accessor } from "solid-js";
import type { CogGroup as CogGroupModel, ViewBox } from "../model";
import CogGroup from "./cog-group";
import SVG from "./svg";

type Props = {
  cogGroup: Accessor<CogGroupModel>;
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
      <CogGroup cogGroup={cogGroup} />
    </SVG>
  );
}
