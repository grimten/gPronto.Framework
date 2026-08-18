import { getGProntoFrameworkAuthenticationCallbackUrl } from "./gPronto.Framework.Authentication.CallbackUrl";
import { getGProntoFrameworkSupabaseBrowserClient } from "./gPronto.Framework.Supabase.BrowserClient";

export function gProntoFrameworkAuthenticationSendMagicLink(email: string) {
  return getGProntoFrameworkSupabaseBrowserClient().auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: getGProntoFrameworkAuthenticationCallbackUrl(),
    },
  });
}
