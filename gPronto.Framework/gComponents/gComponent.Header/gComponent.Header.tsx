import { useSyncExternalStore } from "react";
import {
  getGProntoFrameworkApplicationRootPublicPropertiesSnapshot,
  subscribeToGProntoFrameworkApplicationRootPublicProperties,
} from "../../gPronto.Framework.ApplicationRoot.PublicPropertiesStore";
import { GComponentNavigation } from "../gComponent.Navigation/gComponent.Navigation";
import { GComponentTypography } from "../gComponent.Typography/gComponent.Typography";

export function GComponentHeader() {
  const publicProperties = useSyncExternalStore(
    subscribeToGProntoFrameworkApplicationRootPublicProperties,
    getGProntoFrameworkApplicationRootPublicPropertiesSnapshot,
  );

  return (
    <header className="gcomponent-header">
      <GComponentTypography
        text={publicProperties.Organisation.Name}
        variant="h6"
      />
      <GComponentNavigation orientation="horizontal" />
    </header>
  );
}
