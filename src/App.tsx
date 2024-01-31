import Game from "./components/game";

export default function App() {
  return (
    <div class="h-screen w-screen flex items-center justify-center bg-base-300 p-2">
      <Game height={800} speedMs={300} width={400} />
    </div>
  );
}
