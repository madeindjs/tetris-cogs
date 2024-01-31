import { onCleanup, onMount } from "solid-js";

type Callbacks = Partial<Record<"onLeft" | "onRight" | "onBottom" | "onUp" | "onEnter" | "onSpace", () => void>>;

export function useKeyboardControl(callbacks: Callbacks) {
  function onKeyPress(event: KeyboardEvent) {
    event.preventDefault();

    switch (event.keyCode) {
      case 13:
        return callbacks.onEnter?.();
      case 32:
        return callbacks.onSpace?.();
      case 37:
        return callbacks.onLeft?.();
      case 38:
        return callbacks.onUp?.();
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
