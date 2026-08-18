import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { GProntoFrameworkSupabaseConfiguration } from "./gPronto.Framework.Supabase.ConfigurationContract";
import { validateGProntoFrameworkSupabaseConfiguration } from "./gPronto.Framework.Supabase.ConfigurationValidation";

let browserClient: SupabaseClient | undefined;
let browserClientConfiguration:
  GProntoFrameworkSupabaseConfiguration | undefined;

export function initializeGProntoFrameworkSupabaseBrowserClient(
  configuration: GProntoFrameworkSupabaseConfiguration,
): SupabaseClient {
  const validatedConfiguration =
    validateGProntoFrameworkSupabaseConfiguration(configuration);

  if (browserClient !== undefined) {
    if (
      browserClientConfiguration?.SupabaseUrl !==
        validatedConfiguration.SupabaseUrl ||
      browserClientConfiguration.SupabasePublishableKey !==
        validatedConfiguration.SupabasePublishableKey
    ) {
      throw new Error(
        "The Supabase browser client has already been initialized with different configuration.",
      );
    }

    return browserClient;
  }

  browserClient = createClient(
    validatedConfiguration.SupabaseUrl,
    validatedConfiguration.SupabasePublishableKey,
    {
      auth: {
        flowType: "implicit",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );
  browserClientConfiguration = validatedConfiguration;

  return browserClient;
}

export function getGProntoFrameworkSupabaseBrowserClient(): SupabaseClient {
  if (browserClient === undefined) {
    throw new Error("The Supabase browser client has not been initialized.");
  }

  return browserClient;
}
