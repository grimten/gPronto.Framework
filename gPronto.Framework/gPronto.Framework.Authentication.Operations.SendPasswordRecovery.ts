import { getGProntoFrameworkAuthenticationCallbackUrl } from "./gPronto.Framework.Authentication.CallbackUrl";
import { getGProntoFrameworkSupabaseBrowserClient } from "./gPronto.Framework.Supabase.BrowserClient";

export function gProntoFrameworkAuthenticationSendPasswordRecovery(
  email: string,
) {
  return getGProntoFrameworkSupabaseBrowserClient().auth.resetPasswordForEmail(
    email,
    {
      redirectTo: getGProntoFrameworkAuthenticationCallbackUrl(),
    },
  );
}
