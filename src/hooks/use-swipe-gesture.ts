import { onCleanup, onMount } from "solid-js";
import { Point } from "../model";
import { getCardinalDirection, getDistance } from "../utils/geometry.utils";

type Callbacks = Partial<Record<"onSwipeLeft" | "onSwipeRight" | "onSwipeBottom" | "onSwipeUp", () => void>>;

type Opts = {
  /**
   * Minimum distance betwenn `touchstart` & `touchend` to considerate as a swipe movement.
   */
  minDistance: number;
};

/**
 * Listen `touchstart` & `touchend` events to detect swipe.
 */
export function useSwipeGesture(callbacks: Callbacks, opts: Opts = { minDistance: 20 }) {
  let touchStart: Point | undefined;

  function onTouchStart(event: TouchEvent) {
    touchStart = getPointFromTouchEvent(event);
  }

  function onTouchEnd(event: TouchEvent) {
    if (touchStart === undefined) return;

    const touchEnd = getPointFromTouchEvent(event);

    const distance = getDistance(touchStart, touchEnd);
    if (distance < opts.minDistance) {
      touchStart = undefined;
      return;
    }

    switch (getCardinalDirection(touchStart, touchEnd)) {
      case "up":
        callbacks.onSwipeUp?.();
        break;
      case "bottom":
        callbacks.onSwipeBottom?.();
        break;
      case "left":
        callbacks.onSwipeLeft?.();
        break;
      case "right":
        callbacks.onSwipeRight?.();
        break;
    }

    touchStart = undefined;
  }

  onMount(() => {
    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchend", onTouchEnd);
  });

  onCleanup(() => {
    document.removeEventListener("touchstart", onTouchStart);
    document.removeEventListener("touchend", onTouchEnd);
  });
}

function getPointFromTouchEvent(event: TouchEvent): Point {
  const { screenX, screenY } = event.changedTouches[0];
  return [screenX, screenY];
}
