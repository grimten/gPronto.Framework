import { getGProntoFrameworkSupabaseBrowserClient } from "./gPronto.Framework.Supabase.BrowserClient";

export function gProntoFrameworkAuthenticationReauthenticate() {
  return getGProntoFrameworkSupabaseBrowserClient().auth.reauthenticate();
}
