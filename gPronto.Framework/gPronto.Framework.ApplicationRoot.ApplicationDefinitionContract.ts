import type { GProntoFrameworkRegisteredWebpageDefinitionRegistry } from "./gPronto.Framework.RegisteredWebpages.DefinitionRegistryContract";
import type { GProntoFrameworkStylingIdentifier } from "./gPronto.Framework.Styles.StylingContract";
import type { GProntoFrameworkSupabaseConfiguration } from "./gPronto.Framework.Supabase.ConfigurationContract";

export type GProntoFrameworkApplicationDefinition = {
  styling: GProntoFrameworkStylingIdentifier;
  webpages: GProntoFrameworkRegisteredWebpageDefinitionRegistry;
  supabase: GProntoFrameworkSupabaseConfiguration;
};
