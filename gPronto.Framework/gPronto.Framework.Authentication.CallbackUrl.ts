const authenticationCallbackPath = "/authentication/callback";

export function getGProntoFrameworkAuthenticationCallbackUrl(): string {
  if (typeof window === "undefined") {
    throw new Error(
      "The authentication callback URL is only available in a browser.",
    );
  }

  return `${window.location.origin}${authenticationCallbackPath}`;
}
