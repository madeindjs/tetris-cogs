import { For, type Accessor, type JSX } from "solid-js";
import type { CogGroup as CogGroupModel, ViewBox } from "../model";
import { movePoint } from "../utils/geometry.utils";
import CogGroup from "./cog-group";
import SVG from "./svg";

type Props = {
  cogGroups: Accessor<CogGroupModel[]>;
} & Omit<JSX.SvgSVGAttributes<SVGSVGElement>, "xmlns">;

/**
 * Display the next 3 cogs groups.
 */
export default function CogGroupNextPreview(props: Props) {
  const cogGroupsPositionned = (): CogGroupModel[] => {
    return props.cogGroups().map<CogGroupModel>((cogGroup, i) => {
      if (i === 0) return cogGroup;

      return cogGroup.map((cog) => ({ ...cog, position: movePoint(cog.position, [0, i * 4 + i]) }));
    });
  };

  const viewBox = (): ViewBox => {
    const points = cogGroupsPositionned()
      .flatMap((g) => g)
      .map((c) => c.position);

    const xMin = Math.min(...points.map((c) => c[0]));
    const xMax = Math.max(...points.map((c) => c[0]));
    const yMin = Math.min(...points.map((c) => c[1]));
    const yMax = Math.max(...points.map((c) => c[1]));

    return [xMin - 0.5, yMin - 0.5, xMax - xMin + 1, yMax - yMin + 1];
  };

  return (
    <SVG viewBox={viewBox().join(" ")} class={props["class"]}>
      <For each={cogGroupsPositionned()}>{(cogGroup) => <CogGroup cogGroup={() => cogGroup} />}</For>
    </SVG>
  );
}
