import type { GProntoFrameworkAuthenticationEmailLinkType } from "./gPronto.Framework.Authentication.EmailLinkTypeContract";

const authenticationEmailLinkTypes = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
] as const satisfies readonly GProntoFrameworkAuthenticationEmailLinkType[];

export function isGProntoFrameworkAuthenticationEmailLinkType(
  value: string | null,
): value is GProntoFrameworkAuthenticationEmailLinkType {
  return (
    value !== null &&
    (authenticationEmailLinkTypes as readonly string[]).includes(value)
  );
}
