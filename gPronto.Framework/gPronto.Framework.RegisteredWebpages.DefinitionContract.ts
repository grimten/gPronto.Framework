import type { ComponentType } from "react";
import type { GProntoFrameworkRegisteredWebpageIdentifier } from "./gPronto.Framework.RegisteredWebpages.IdentifierContract";
import type { GProntoFrameworkRegisteredWebpageMetadata } from "./gPronto.Framework.RegisteredWebpages.MetadataContract";
import type { GProntoFrameworkRegisteredWebpageRouteDefinition } from "./gPronto.Framework.RegisteredWebpages.RouteDefinitionContract";

export type GProntoFrameworkRegisteredWebpageDefinition = {
  id: GProntoFrameworkRegisteredWebpageIdentifier;
  route: GProntoFrameworkRegisteredWebpageRouteDefinition;
  component: ComponentType;
  metadata: GProntoFrameworkRegisteredWebpageMetadata;
};
