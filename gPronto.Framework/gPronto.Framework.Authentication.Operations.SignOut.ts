import { getGProntoFrameworkSupabaseBrowserClient } from "./gPronto.Framework.Supabase.BrowserClient";

export function gProntoFrameworkAuthenticationSignOut() {
  return getGProntoFrameworkSupabaseBrowserClient().auth.signOut({
    scope: "local",
  });
}
