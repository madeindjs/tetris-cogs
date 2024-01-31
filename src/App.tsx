import Game from "./components/game";

export default function App() {
  return (
    <div class="h-screen w-screen flex items-center justify-center">
      <div class="border rounded">
        <Game height={800} speedMs={300} width={400} />
      </div>
    </div>
  );
}
