import type { GProntoFrameworkApplicationRootComponentProps } from "./gPronto.Framework.ApplicationRoot.ComponentPropsContract";
import { GApplicationRegisteredWebpageRoutingComposition } from "./gPronto.Framework.ApplicationRoot.RegisteredWebpageRoutingComposition";
import { GApplicationSharedProviderComposition } from "./gPronto.Framework.ApplicationRoot.SharedProviderComposition";
import { resolveGProntoFrameworkStyling } from "./gPronto.Framework.Styles.StylingRegistry";

export function GProntoFrameworkApplicationRootComponent({
  application,
}: GProntoFrameworkApplicationRootComponentProps) {
  const styling = resolveGProntoFrameworkStyling(application.styling);

  return (
    <GApplicationSharedProviderComposition styling={styling}>
      <GApplicationRegisteredWebpageRoutingComposition
        webpages={application.webpages}
      />
    </GApplicationSharedProviderComposition>
  );
}
