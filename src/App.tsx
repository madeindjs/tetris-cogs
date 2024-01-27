import { For } from "solid-js";
import "./App.css";
import Cog from "./components/cog";
import Grid from "./components/grid";
import SVG from "./components/svg";
import { useAnimationFrame } from "./hooks/use-animation-frame";
import { useGameState } from "./hooks/use-game-state";
import { useKeyboardControl } from "./hooks/use-keyboard-controls";
import { type Grid as GridProps } from "./model";

function App() {
  const width = 700;
  const height = 700;
  const gridGap = 5;

  const grid: GridProps = {
    viewBox: [0, 0, 100, 100],
    gap: 10,
  };

  const { cogs, tick, moveLeft, moveRight, moveBottom } = useGameState(grid);

  useKeyboardControl({
    onRight: moveRight,
    onBottom: moveBottom,
    onLeft: moveLeft,
  });

  useAnimationFrame(tick, 500);

  return (
    <SVG width={width} height={height} viewBox={grid.viewBox.join(" ")}>
      <Grid viewBox={grid.viewBox} gap={gridGap} />
      <For each={cogs()}>
        {(cog) => <Cog position={cog.position} size={cog.size} rotationDirection={cog.rotationDirection} />}
      </For>
    </SVG>
  );
}

export default App;
