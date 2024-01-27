import { For, createSignal } from "solid-js";
import "./App.css";
import Cog from "./components/cog";
import Grid from "./components/grid";
import SVG from "./components/svg";
import { useAnimationFrame } from "./hooks/use-animation-frame";
import type { Cog as CogProps, ViewBox } from "./model";

function App() {
  const width = 700;
  const height = 700;
  const viewBox: ViewBox = [0, 0, 100, 100];
  const gridGap = 10;

  const [cogs, setCogs] = createSignal<CogProps[]>([
    { position: [10, 0], size: 10 },
    { position: [10, 30], size: 10 },
    { position: [50, 0], size: 20 },
    { position: [90, 0], size: 20 },
  ]);

  function moveCog(cog: CogProps): CogProps {
    const [x, y] = cog.position;
    const yMax = viewBox[3];
    const yNew = y + gridGap;

    if (yNew + cog.size / 2 > yMax) return cog;

    return { ...cog, position: [x, yNew] };
  }

  function tick() {
    const newCogs = cogs().map(moveCog);

    setCogs(newCogs);
  }

  useAnimationFrame(tick, 1_000);

  return (
    <SVG width={width} height={height} viewBox={viewBox.join(" ")}>
      <Grid viewBox={viewBox} gap={gridGap} />
      <For each={cogs()}>{(cog) => <Cog position={cog.position} size={cog.size} />}</For>
    </SVG>
  );
}

export default App;
