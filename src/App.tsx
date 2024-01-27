import { For, createSignal } from "solid-js";
import "./App.css";
import Cog from "./components/cog";
import Grid from "./components/grid";
import SVG from "./components/svg";
import { useAnimationFrame } from "./hooks/use-animation-frame";
import { RotationDirection, type Cog as CogProps, type Grid as GridProps } from "./model";
import { moveCogs } from "./utils/cog.utils";

function App() {
  const width = 700;
  const height = 700;
  const gridGap = 5;

  const grid: GridProps = {
    viewBox: [0, 0, 200, 300],
    gap: 10,
  };

  const [cogs, setCogs] = createSignal<CogProps[]>([
    { position: [10, 0], size: 10, rotationDirection: RotationDirection.Clockwise },
    { position: [10, 30], size: 10, rotationDirection: RotationDirection.Clockwise },
    { position: [10, 60], size: 10, rotationDirection: RotationDirection.Clockwise },
  ]);

  function tick() {
    const newCogs = moveCogs(cogs(), grid);

    setCogs(newCogs);
  }

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
