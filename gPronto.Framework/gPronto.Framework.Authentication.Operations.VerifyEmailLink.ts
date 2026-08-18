import type { GProntoFrameworkAuthenticationEmailLinkType } from "./gPronto.Framework.Authentication.EmailLinkTypeContract";
import { getGProntoFrameworkSupabaseBrowserClient } from "./gPronto.Framework.Supabase.BrowserClient";

export function gProntoFrameworkAuthenticationVerifyEmailLink(
  tokenHash: string,
  type: GProntoFrameworkAuthenticationEmailLinkType,
) {
  return getGProntoFrameworkSupabaseBrowserClient().auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });
}
