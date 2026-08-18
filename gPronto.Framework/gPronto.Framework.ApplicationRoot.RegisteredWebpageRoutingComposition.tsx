import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";
import { BrowserRouter } from "react-router";
import { gProntoFrameworkNotificationProvider } from "./gPronto.Framework.ApplicationRoot.NotificationProvider";
import { getGProntoFrameworkSupabaseDataProvider } from "./gPronto.Framework.Supabase.DataProvider";
import {
  gProntoFrameworkPostgresDataResources,
  gProntoFrameworkSupabaseDataProviderName,
} from "./gPronto.Framework.PostgresDataResources.Registry";
import { GRegisteredWebpageDefinitionRegistryProvider } from "./gPronto.Framework.RegisteredWebpages.DefinitionRegistryContext";
import type { GProntoFrameworkRegisteredWebpageDefinitionRegistry } from "./gPronto.Framework.RegisteredWebpages.DefinitionRegistryContract";
import { GRegisteredWebpageReactRouteGeneration } from "./gPronto.Framework.RegisteredWebpages.RouteComposition";

type GApplicationRegisteredWebpageRoutingCompositionProps = {
  webpages: GProntoFrameworkRegisteredWebpageDefinitionRegistry;
};

export function GApplicationRegisteredWebpageRoutingComposition({
  webpages,
}: GApplicationRegisteredWebpageRoutingCompositionProps) {
  const supabaseDataProvider = getGProntoFrameworkSupabaseDataProvider();

  return (
    <BrowserRouter>
      <GRegisteredWebpageDefinitionRegistryProvider webpages={webpages}>
        <Refine
          dataProvider={{
            default: supabaseDataProvider,
            [gProntoFrameworkSupabaseDataProviderName]: supabaseDataProvider,
          }}
          notificationProvider={gProntoFrameworkNotificationProvider}
          resources={gProntoFrameworkPostgresDataResources}
          routerProvider={routerProvider}
          options={{ disableTelemetry: true }}
        >
          <GRegisteredWebpageReactRouteGeneration webpages={webpages} />
        </Refine>
      </GRegisteredWebpageDefinitionRegistryProvider>
    </BrowserRouter>
  );
}
