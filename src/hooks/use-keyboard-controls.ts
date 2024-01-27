import { onCleanup, onMount } from "solid-js";

type Callbacks = Partial<Record<"onLeft" | "onRight" | "onBottom", () => void>>;

export function useKeyboardControl(callbacks: Callbacks) {
  function onKeyPress(event: KeyboardEvent) {
    event.preventDefault();

    switch (event.keyCode) {
      case 37:
        return callbacks.onLeft?.();
      case 39:
        return callbacks.onRight?.();
      case 40:
        return callbacks.onBottom?.();
    }
  }

  onMount(() => {
    document.addEventListener("keydown", onKeyPress);
  });

  onCleanup(() => {
    document.removeEventListener("keydown", onKeyPress);
  });
}
