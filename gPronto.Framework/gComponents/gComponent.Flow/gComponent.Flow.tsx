import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";

export type GComponentFlowProps =
  | Readonly<{
      direction: "horizontal";
      children: ReactNode;
      gap?: "xs" | "sm" | "md" | "lg" | "xl";
      justify?: "start" | "center" | "end" | "space-between";
    }>
  | Readonly<{
      direction: "vertical";
      children: ReactNode;
      gap?: "xs" | "sm" | "md" | "lg" | "xl";
    }>;

export function GComponentFlow(props: GComponentFlowProps) {
  const gap = props.gap ?? "md";

  if (props.direction === "horizontal") {
    const justify = props.justify ?? "start";

    return (
      <Stack
        direction="row"
        className={`gcomponent-flow gcomponent-flow--horizontal gcomponent-flow--gap-${gap} gcomponent-flow--justify-${justify}`}
        data-flow-direction="horizontal"
      >
        {props.children}
      </Stack>
    );
  }

  return (
    <Stack
      className={`gcomponent-flow gcomponent-flow--gap-${gap}`}
      data-flow-direction="vertical"
    >
      {props.children}
    </Stack>
  );
}
