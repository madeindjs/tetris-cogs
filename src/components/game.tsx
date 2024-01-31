import { For, Show, createEffect, on, onMount } from "solid-js";
import { useAnimationFrame } from "../hooks/use-animation-frame";
import { useGameState } from "../hooks/use-game-state";
import { useKeyboardControl } from "../hooks/use-keyboard-controls";
import { useLinks } from "../hooks/use-links";
import { Grid as GridProps, ViewBox } from "../model";
import Cog from "./cog";
import CogGroup from "./cog-group";
import CogGroupNextPreview from "./cog-group-next-preview";
import CogsLink from "./cogs-link";
import Grid from "./grid";
import SVG from "./svg";

type Props = {
  width: number;
  height: number;
  speedMs: number;
};

export default function Game({ height, speedMs, width }: Props) {
  const grid: GridProps = { size: [10, 20] };
  const cogSize = 1;
  const viewBox: ViewBox = [-0.5, -0.5, grid.size[0], grid.size[1]];

  const { cogs, tick, moveLeft, moveRight, moveBottom, nextCogGroups, reset, score, activeCogGroup, rotate, confirm } =
    useGameState(grid);

  const links = useLinks(cogs);

  const hasErrors = () => links().some((l) => l.broken);

  useKeyboardControl({
    onRight: moveRight,
    onBottom: moveBottom,
    onLeft: moveLeft,
    onEnter: confirm,
    onSpace: confirm,
    onUp: rotate,
  });

  const { start, stop } = useAnimationFrame(tick, speedMs);

  onMount(start);

  createEffect(on(hasErrors, (value) => value && stop()));

  function retry() {
    reset();
    start();
  }

  return (
    <div class="flex gap-2">
      <SVG width={width} height={height} viewBox={viewBox.join(" ")} class="bg-base-300">
        <Grid gridSize={grid.size} />
        <For each={cogs()}>
          {(cog) => <Cog position={() => cog.position} size={() => cogSize} rotation={() => cog.rotation} />}
        </For>
        <Show when={activeCogGroup()}>{(group) => <CogGroup cogGroup={group} />}</Show>
        <For each={links()}>{({ points: [from, to], broken }) => <CogsLink from={from} to={to} error={broken} />}</For>
      </SVG>
      <div class="w-48 flex flex-col gap-2 p-2">
        <p class="text-xl">Score:</p>
        <p class="text-xl text-right">{score()}</p>
        <p class="text-xl">Next:</p>
        <CogGroupNextPreview cogGroups={nextCogGroups} />
        <Show when={hasErrors()}>
          <button onClick={retry} class="btn btn-primary">
            Retry
          </button>
        </Show>
      </div>
    </div>
  );
}
