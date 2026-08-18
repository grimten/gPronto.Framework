import { Route, Routes } from "react-router";
import type { GProntoFrameworkRegisteredWebpageDefinitionRegistry } from "./gPronto.Framework.RegisteredWebpages.DefinitionRegistryContract";
import { GRegisteredWebpageVisibilityControl } from "./gPronto.Framework.RegisteredWebpages.VisibilityControl";

type GRegisteredWebpageReactRouteGenerationProps = {
  webpages: GProntoFrameworkRegisteredWebpageDefinitionRegistry;
};

export function GRegisteredWebpageReactRouteGeneration({
  webpages,
}: GRegisteredWebpageReactRouteGenerationProps) {
  return (
    <Routes>
      {webpages.map((webpage) => (
        <Route
          key={webpage.id}
          path={webpage.route.kind === "not-found" ? "*" : webpage.route.path}
          element={<GRegisteredWebpageVisibilityControl webpage={webpage} />}
        />
      ))}
    </Routes>
  );
}
