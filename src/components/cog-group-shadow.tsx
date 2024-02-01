import { createUniqueId, type Accessor } from "solid-js";
import type { CogGroup as CogGroupModel } from "../model";
import CogGroup from "./cog-group";

type Props = {
  cogGroup: Accessor<CogGroupModel>;
};

export default function CogGroupShadow({ cogGroup }: Props) {
  const id = createUniqueId();

  return (
    <g aria-label="CogGroupShadow">
      <filter id={id}>
        <feColorMatrix type="saturate" values="0.30" />
      </filter>
      <g filter={`url(#${id})`}>
        <CogGroup cogGroup={cogGroup} />
      </g>
    </g>
  );
}
