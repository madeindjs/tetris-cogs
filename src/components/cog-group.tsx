import { For, type Accessor } from "solid-js";
import { useLinks } from "../hooks/use-links";
import type { CogGroup } from "../model";
import Cog from "./cog";
import CogsLink from "./cogs-link";

type Props = {
  cogGroup: Accessor<CogGroup>;
  shadow?: boolean;
};

export default function CogGroup({ cogGroup, shadow }: Props) {
  const links = useLinks(cogGroup);
  return (
    <g aria-label="CogGroup">
      <For each={cogGroup()}>
        {(cog) => <Cog position={() => cog.position} size={() => 1} rotation={() => cog.rotation} shadow={shadow} />}
      </For>
      <For each={links()}>{({ points: [from, to], broken }) => <CogsLink from={from} to={to} error={broken} />}</For>
    </g>
  );
}
