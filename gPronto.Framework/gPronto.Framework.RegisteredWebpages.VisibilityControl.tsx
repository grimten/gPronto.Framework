import { useSyncExternalStore } from "react";
import { Navigate } from "react-router";
import {
  getGProntoFrameworkAuthenticationStateSnapshot,
  subscribeToGProntoFrameworkAuthenticationState,
} from "./gPronto.Framework.Authentication.StateStore";
import type { GProntoFrameworkRegisteredWebpageDefinition } from "./gPronto.Framework.RegisteredWebpages.DefinitionContract";
import { GRegisteredWebpageDocumentTitleSynchronization } from "./gPronto.Framework.RegisteredWebpages.DocumentTitleSynchronization";

type GRegisteredWebpageVisibilityControlProps = {
  webpage: GProntoFrameworkRegisteredWebpageDefinition;
};

export function GRegisteredWebpageVisibilityControl({
  webpage,
}: GRegisteredWebpageVisibilityControlProps) {
  const authenticationState = useSyncExternalStore(
    subscribeToGProntoFrameworkAuthenticationState,
    getGProntoFrameworkAuthenticationStateSnapshot,
  );

  if (
    webpage.metadata.visibility.mode === "public" ||
    authenticationState.Status === "SignedIn"
  ) {
    return <GRegisteredWebpageDocumentTitleSynchronization webpage={webpage} />;
  }

  if (authenticationState.Status === "Initializing") {
    return null;
  }

  return <Navigate to={webpage.metadata.visibility.redirectPath} replace />;
}
