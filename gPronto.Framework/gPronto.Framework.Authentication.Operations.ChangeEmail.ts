import { getGProntoFrameworkAuthenticationCallbackUrl } from "./gPronto.Framework.Authentication.CallbackUrl";
import { getGProntoFrameworkSupabaseBrowserClient } from "./gPronto.Framework.Supabase.BrowserClient";

export function gProntoFrameworkAuthenticationChangeEmail(newEmail: string) {
  return getGProntoFrameworkSupabaseBrowserClient().auth.updateUser(
    { email: newEmail },
    { emailRedirectTo: getGProntoFrameworkAuthenticationCallbackUrl() },
  );
}
