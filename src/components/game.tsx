import { For, Show, createEffect, on, onMount } from "solid-js";
import { useAnimationFrame } from "../hooks/use-animation-frame";
import { useGameState } from "../hooks/use-game-state";
import { useKeyboardControl } from "../hooks/use-keyboard-controls";
import { useLinks } from "../hooks/use-links";
import { useSwipeGesture } from "../hooks/use-swipe-gesture";
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

  useSwipeGesture({
    onSwipeLeft: moveLeft,
    onSwipeBottom: moveBottom,
    onSwipeRight: moveRight,
    onSwipeUp: rotate,
  });

  const { start, stop } = useAnimationFrame(tick, speedMs);

  onMount(start);

  createEffect(on(hasErrors, (value) => value && stop()));

  function retry() {
    reset();
    start();
  }

  return (
    <div class="flex flex-col-reverse gap-2 h-full w-full sm:flex-row">
      <SVG viewBox={viewBox.join(" ")} class="flex-grow">
        <Grid gridSize={grid.size} />
        <For each={cogs()}>
          {(cog) => <Cog position={() => cog.position} size={() => cogSize} rotation={() => cog.rotation} />}
        </For>
        <Show when={activeCogGroup()}>{(group) => <CogGroup cogGroup={group} />}</Show>
        <For each={links()}>{({ points: [from, to], broken }) => <CogsLink from={from} to={to} error={broken} />}</For>
      </SVG>
      <div class="flex w-full h-48 flex-row gap-2 sm:flex-col sm:flex-grow-0 sm:w-48 max-h-">
        <div class="border rounded p-2 bg-base-100">
          <p class="text-xl font-bold mb-2">Score:</p>
          <p class="text-xl text-right">{score()}</p>
        </div>
        <div class="border rounded p-2 bg-base-100">
          <p class="text-xl font-bold mb-2">Level:</p>
          <p class="text-xl text-right">{score()}</p>
        </div>
        <div class="border rounded p-2 bg-base-100 flex-grow sm:flex-grow-0 flex sm:block">
          <p class="text-xl font-bold mb-2">Next:</p>
          <CogGroupNextPreview cogGroups={nextCogGroups} class="sm:w-full h-fit" />
        </div>
        <Show when={hasErrors()}>
          <button onClick={retry} class="btn btn-primary">
            Retry
          </button>
        </Show>
      </div>
    </div>
  );
}
