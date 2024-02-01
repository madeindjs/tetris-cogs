export default function Hero() {
  return (
    <div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 backdrop-blur-sm">
      <div class="card-body">
        <h1 class="card-title">Tetris with Cogs</h1>
        <p>This is just an expiriment to build a Tetris wherein you need to take of rotation of block.</p>
        <p class="text-xl mt-2">Controls:</p>
        <ul>
          <li>
            <strong>move to left</strong>: <kbd class="kbd">left</kbd> / swipe left
          </li>
          <li>
            <strong>move to right</strong>: <kbd class="kbd">right</kbd> / swipe right
          </li>
          <li>
            <strong>move to bottom</strong>: <kbd class="kbd">down</kbd> / swipe down
          </li>
          <li>
            <strong>rotate</strong>: <kbd class="kbd">up</kbd> / swipe up
          </li>
          <li>
            <strong>confirm</strong>: <kbd class="kbd">enter</kbd>
          </li>
        </ul>
      </div>
    </div>
  );
}
