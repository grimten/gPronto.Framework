import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import type { PropsWithChildren } from "react";
import type { GProntoFrameworkStyling } from "./gPronto.Framework.Styles.StylingContract";

type GApplicationSharedProviderCompositionProps = PropsWithChildren<{
  styling: GProntoFrameworkStyling;
}>;

export function GApplicationSharedProviderComposition({
  children,
  styling,
}: GApplicationSharedProviderCompositionProps) {
  return (
    <StyledEngineProvider injectFirst>
      <style data-gpronto-styling={styling.identifier}>{styling.css}</style>
      {children}
    </StyledEngineProvider>
  );
}
