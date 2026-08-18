import { getGProntoFrameworkSupabaseBrowserClient } from "./gPronto.Framework.Supabase.BrowserClient";

export function gProntoFrameworkAuthenticationChangePassword(
  currentPassword: string,
  newPassword: string,
) {
  return getGProntoFrameworkSupabaseBrowserClient().auth.updateUser({
    password: newPassword,
    current_password: currentPassword,
  });
}
