import { For, Show } from "solid-js";
import Cog from "./components/cog";
import CogsLink from "./components/cogs-link";
import Grid from "./components/grid";
import SVG from "./components/svg";
import { useAnimationFrame } from "./hooks/use-animation-frame";
import { useGameState } from "./hooks/use-game-state";
import { useKeyboardControl } from "./hooks/use-keyboard-controls";
import { GameStatus, type Grid as GridProps } from "./model";

function App() {
  const width = 700;
  const height = 700;

  const grid: GridProps = {
    viewBox: [0, 0, 100, 100],
    gap: 10,
  };

  const { cogs, tick, moveLeft, moveRight, moveBottom, gameStatus, links, nextCog, reset, brokenLinks } =
    useGameState(grid);

  useKeyboardControl({
    onRight: moveRight,
    onBottom: moveBottom,
    onLeft: moveLeft,
  });

  useAnimationFrame(tick, 200);

  return (
    <div class="h-screen w-screen flex items-center justify-center">
      <div class="flex gap-2 border rounded">
        <SVG width={width} height={height} viewBox={grid.viewBox.join(" ")} class="bg-base-300">
          <Grid viewBox={grid.viewBox} gap={grid.gap} />
          <For each={cogs()}>
            {(cog) => (
              <Cog
                position={() => cog.position}
                size={() => cog.size}
                rotationDirection={() => cog.rotationDirection}
              />
            )}
          </For>
          <For each={links()}>{([from, to]) => <CogsLink from={from} to={to} />}</For>
          <For each={brokenLinks()}>{([from, to]) => <CogsLink from={from} to={to} error />}</For>
        </SVG>
        <div class="w-48 flex flex-col gap-2 p-2">
          <p class="text-xl">Next:</p>
          <Show when={nextCog()}>
            {(cog) => (
              <SVG width={100} height={100} viewBox={[0, 0, 20, 20].join(" ")}>
                <Cog
                  position={() => [10, 10]}
                  size={() => cog().size}
                  rotationDirection={() => cog().rotationDirection}
                />
              </SVG>
            )}
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
