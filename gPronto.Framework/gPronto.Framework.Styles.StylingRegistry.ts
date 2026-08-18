import gStyling1Css from "./gStylings/gStyling-1/gStyling-1.css?inline";
import gStyling2Css from "./gStylings/gStyling-2/gStyling-2.css?inline";
import type {
  GProntoFrameworkStyling,
  GProntoFrameworkStylingIdentifier,
} from "./gPronto.Framework.Styles.StylingContract";

export const gProntoFrameworkStylingRegistry = Object.freeze({
  "gStyling-1": {
    identifier: "gStyling-1",
    css: gStyling1Css,
  },
  "gStyling-2": {
    identifier: "gStyling-2",
    css: gStyling2Css,
  },
}) satisfies Readonly<
  Record<GProntoFrameworkStylingIdentifier, GProntoFrameworkStyling>
>;

function formatStylingIdentifier(identifier: unknown): string {
  return typeof identifier === "string"
    ? `"${identifier}"`
    : String(identifier);
}

export function resolveGProntoFrameworkStyling(
  identifier: GProntoFrameworkStylingIdentifier,
): GProntoFrameworkStyling {
  if (
    typeof identifier !== "string" ||
    !Object.hasOwn(gProntoFrameworkStylingRegistry, identifier)
  ) {
    throw new Error(
      `The gPronto.Framework styling identifier ${formatStylingIdentifier(identifier)} is not registered.`,
    );
  }

  return gProntoFrameworkStylingRegistry[identifier];
}
