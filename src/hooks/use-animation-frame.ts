import { onCleanup } from "solid-js";

export function useAnimationFrame(callback: () => void, ms = 200) {
  let running = false;
  let animationFrameId: number | undefined;

  function tick() {
    animationFrameId = requestAnimationFrame(() => {
      if (!running) return;
      callback();
      setTimeout(tick, ms);
    });
  }

  onCleanup(() => {
    stop();
  });

  function start() {
    stop();
    running = true;
    tick();
  }

  function stop() {
    running = false;
    if (animationFrameId === undefined) return;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = undefined;
  }

  return { start, stop };
}
