import { getGProntoFrameworkSupabaseBrowserClient } from "./gPronto.Framework.Supabase.BrowserClient";

export function gProntoFrameworkAuthenticationSignIn(
  email: string,
  password: string,
) {
  return getGProntoFrameworkSupabaseBrowserClient().auth.signInWithPassword({
    email,
    password,
  });
}
