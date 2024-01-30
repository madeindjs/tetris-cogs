import { For, Show } from "solid-js";
import Cog from "./components/cog";
import CogGroupNextPreview from "./components/cog-group-next-preview";
import CogsLink from "./components/cogs-link";
import Grid from "./components/grid";
import SVG from "./components/svg";
import { useAnimationFrame } from "./hooks/use-animation-frame";
import { useGameState } from "./hooks/use-game-state";
import { useKeyboardControl } from "./hooks/use-keyboard-controls";
import { GameStatus, ViewBox, type Grid as GridProps } from "./model";

function App() {
  const width = 400;
  const height = 800;
  const speed = 300;

  const grid: GridProps = { size: [10, 20] };

  const cogSize = 1;

  const viewBox: ViewBox = [-0.5, -0.5, grid.size[0], grid.size[1]];

  const { cogs, tick, moveLeft, moveRight, moveBottom, gameStatus, links, nextCogGroup, reset, brokenLinks, score } =
    useGameState(grid);

  useKeyboardControl({
    onRight: moveRight,
    onBottom: moveBottom,
    onLeft: moveLeft,
  });

  useAnimationFrame(tick, speed);

  return (
    <div class="h-screen w-screen flex items-center justify-center">
      <div class="flex gap-2 border rounded">
        <SVG width={width} height={height} viewBox={viewBox.join(" ")} class="bg-base-300">
          <Grid gridSize={grid.size} />
          <For each={cogs()}>
            {(cog) => (
              <Cog position={() => cog.position} size={() => cogSize} rotationDirection={() => cog.rotationDirection} />
            )}
          </For>
          <For each={links()}>{([from, to]) => <CogsLink from={from} to={to} />}</For>
          <For each={brokenLinks()}>{([from, to]) => <CogsLink from={from} to={to} error />}</For>
        </SVG>
        <div class="w-48 flex flex-col gap-2 p-2">
          <p class="text-xl">Score:</p>
          <p class="text-xl text-right">{score()}</p>
          <p class="text-xl">Next:</p>
          <Show when={nextCogGroup()}>
            <CogGroupNextPreview cogGroup={nextCogGroup} />
          </Show>
          <Show when={gameStatus() === GameStatus.Loose}>
            <button onClick={reset} class="btn btn-primary">
              Retry
            </button>
          </Show>
        </div>
      </div>
    </div>
  );
}

export default App;
