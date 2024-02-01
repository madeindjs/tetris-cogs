import type { JSX } from "solid-js";

type Props = {
  childrenGame: JSX.Element;
  childrenScore: JSX.Element;
  childrenLevel: JSX.Element;
  childrenNext: JSX.Element;
  childrenRetry?: JSX.Element;
};

export function GameLayout(props: Props) {
  return (
    <div class="grid grid-cols-6 grid-rows-6 gap-2 h-full w-full">
      <div class="col-start-1 col-span-6 row-span-4 row-start-2 sm:col-span-4 sm:row-span-6 flex justify-center relative">
        {props.childrenGame}
        {Boolean(props.childrenRetry) && (
          <div class="absolute left-0 top-0 flex w-full h-full justify-center items-center">{props.childrenRetry}</div>
        )}
      </div>

      <div class="border rounded p-2 bg-base-100 row-start-1 sm:row-start-1 col-start-1 sm:col-start-5 col-span-3 sm:col-span-2">
        <p class="text-xl font-bold mb-2">Score:</p>
        {props.childrenScore}
      </div>
      <div class="border rounded p-2 bg-base-100 row-start-1 sm:row-start-2 col-start-4 sm:col-start-5 col-span-3 sm:col-span-2">
        <p class="text-xl font-bold">Level:</p>
        {props.childrenLevel}
      </div>
      <div class="border rounded p-2 bg-base-100 flex sm:flex-col gap-2 row-start-6 col-start-1 col-span-6 sm:col-start-5 sm:row-span-4 sm:row-start-3 sm:col-span-2">
        <p class="text-xl font-bold">Next:</p>
        {/* <div class="flex-grow flex">{props.childrenNext}</div> */}
        {props.childrenNext}
      </div>
    </div>
  );
}
