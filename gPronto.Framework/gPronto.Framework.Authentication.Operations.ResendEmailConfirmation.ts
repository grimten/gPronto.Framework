import { getGProntoFrameworkAuthenticationCallbackUrl } from "./gPronto.Framework.Authentication.CallbackUrl";
import { getGProntoFrameworkSupabaseBrowserClient } from "./gPronto.Framework.Supabase.BrowserClient";

export function gProntoFrameworkAuthenticationResendEmailConfirmation(
  email: string,
) {
  return getGProntoFrameworkSupabaseBrowserClient().auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: getGProntoFrameworkAuthenticationCallbackUrl(),
    },
  });
}
