import type { Accessor } from "solid-js";
import { CogGroup as CogGroupModel, Point } from "../model";
import CogGroup from "./cog-group";

type Props = {
  cogGroup: Accessor<CogGroupModel>;
  move: Accessor<Point>;
  durationMs: number;
};

/**
 * Represent a {@link CogGroup} but with translation animation
 */
export default function CogGroupMove({ cogGroup, move, durationMs }: Props) {
  console.log("CogGroupMove render");
  return (
    <g aria-label="CogGroupMove">
      <CogGroup cogGroup={cogGroup} />
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="translate"
        from="0 0"
        to={move().join(" ")}
        dur={`${durationMs}ms`}
        repeatCount="indefinite"
      />
    </g>
  );
}
