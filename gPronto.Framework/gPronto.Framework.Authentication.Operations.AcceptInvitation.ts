import { getGProntoFrameworkSupabaseBrowserClient } from "./gPronto.Framework.Supabase.BrowserClient";

export function gProntoFrameworkAuthenticationAcceptInvitation(
  password: string,
) {
  return getGProntoFrameworkSupabaseBrowserClient().auth.updateUser({
    password,
  });
}
