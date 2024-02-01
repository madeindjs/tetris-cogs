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
import { GameLayout } from "./game-layout";
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
    <GameLayout
      childrenGame={
        <SVG viewBox={viewBox.join(" ")}>
          <Grid gridSize={grid.size} />
          <For each={cogs()}>
            {(cog) => <Cog position={() => cog.position} size={() => cogSize} rotation={() => cog.rotation} />}
          </For>
          <Show when={activeCogGroup()}>{(group) => <CogGroup cogGroup={group} />}</Show>
          <For each={links()}>
            {({ points: [from, to], broken }) => <CogsLink from={from} to={to} error={broken} />}
          </For>
        </SVG>
      }
      childrenScore={<p class="text-xl text-right">{score()}</p>}
      childrenLevel={<p class="text-xl text-right">{score()}</p>}
      childrenNext={<CogGroupNextPreview cogGroups={nextCogGroups} class="-rotate-90 sm:rotate-0" />}
      childrenRetry={
        <Show when={hasErrors()}>
          <button onClick={retry} class="btn btn-primary">
            Retry
          </button>
        </Show>
      }
    />
  );
}
