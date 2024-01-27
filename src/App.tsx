import "./App.css";
import Cog from "./components/cog";
import Grid from "./components/grid";
import SVG from "./components/svg";
import type { ViewBox } from "./model";

function App() {
  const width = 700;
  const height = 700;
  const viewBox: ViewBox = [0, 0, 100, 100];

  return (
    <SVG width={width} height={height} viewBox={viewBox.join(" ")}>
      <Cog position={[10, 10]} size={10} />
      <Cog position={[30, 30]} size={10} />
      <Grid viewBox={viewBox} gap={10} />
    </SVG>
  );
}

export default App;
