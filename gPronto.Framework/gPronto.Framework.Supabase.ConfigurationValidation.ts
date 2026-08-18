import type { GProntoFrameworkSupabaseConfiguration } from "./gPronto.Framework.Supabase.ConfigurationContract";

function requireNonEmptyConfigurationValue(
  value: string,
  name: string,
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Supabase configuration ${name} must be a non-empty string.`,
    );
  }

  return value.trim();
}

export function validateGProntoFrameworkSupabaseConfiguration(
  configuration: GProntoFrameworkSupabaseConfiguration,
): GProntoFrameworkSupabaseConfiguration {
  if (configuration === null || typeof configuration !== "object") {
    throw new Error(
      "Supabase configuration must be supplied by the application.",
    );
  }

  const SupabaseUrl = requireNonEmptyConfigurationValue(
    configuration.SupabaseUrl,
    "SupabaseUrl",
  );
  const SupabasePublishableKey = requireNonEmptyConfigurationValue(
    configuration.SupabasePublishableKey,
    "SupabasePublishableKey",
  );

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(SupabaseUrl);
  } catch {
    throw new Error("Supabase configuration SupabaseUrl must be a valid URL.");
  }

  if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
    throw new Error(
      "Supabase configuration SupabaseUrl must use HTTP or HTTPS.",
    );
  }

  return Object.freeze({ SupabaseUrl, SupabasePublishableKey });
}
