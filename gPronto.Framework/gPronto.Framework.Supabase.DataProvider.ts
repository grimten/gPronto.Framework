import type { DataProvider } from "@refinedev/core";
import { dataProvider } from "@refinedev/supabase";
import { getGProntoFrameworkSupabaseBrowserClient } from "./gPronto.Framework.Supabase.BrowserClient";

export const gProntoFrameworkSupabaseDataProviderName = "supabase" as const;

let supabaseDataProvider: DataProvider | undefined;

export function getGProntoFrameworkSupabaseDataProvider(): DataProvider {
  if (supabaseDataProvider === undefined) {
    supabaseDataProvider = dataProvider(
      getGProntoFrameworkSupabaseBrowserClient(),
    );
  }

  return supabaseDataProvider;
}
