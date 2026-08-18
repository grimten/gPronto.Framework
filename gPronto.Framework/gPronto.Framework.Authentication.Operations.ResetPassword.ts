import { getGProntoFrameworkSupabaseBrowserClient } from "./gPronto.Framework.Supabase.BrowserClient";

export function gProntoFrameworkAuthenticationResetPassword(
  newPassword: string,
) {
  return getGProntoFrameworkSupabaseBrowserClient().auth.updateUser({
    password: newPassword,
  });
}
