import { getGProntoFrameworkAuthenticationCallbackUrl } from "./gPronto.Framework.Authentication.CallbackUrl";
import { getGProntoFrameworkSupabaseBrowserClient } from "./gPronto.Framework.Supabase.BrowserClient";

export function gProntoFrameworkAuthenticationSignUp(
  email: string,
  password: string,
) {
  return getGProntoFrameworkSupabaseBrowserClient().auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getGProntoFrameworkAuthenticationCallbackUrl(),
    },
  });
}
