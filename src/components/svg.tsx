import type { JSX } from "solid-js/jsx-runtime";

type Props = Omit<JSX.SvgSVGAttributes<SVGSVGElement>, "xmlns">;

export default function SVG(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={props.height}
      width={props.width}
      viewBox={props.viewBox}
      class={props["class"]}
    >
      {props.children}
    </svg>
  );
}
