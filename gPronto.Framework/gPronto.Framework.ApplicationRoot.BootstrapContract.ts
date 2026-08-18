import type { GProntoFrameworkApplicationDefinition } from "./gPronto.Framework.ApplicationRoot.ApplicationDefinitionContract";
import type { GProntoFrameworkSupabaseConfiguration } from "./gPronto.Framework.Supabase.ConfigurationContract";

export type GProntoFrameworkApplicationBootstrapRequest = Readonly<{
  styling: GProntoFrameworkApplicationDefinition["styling"];
  supabase: GProntoFrameworkSupabaseConfiguration;
  webpageModules: Readonly<Record<string, unknown>>;
}>;
