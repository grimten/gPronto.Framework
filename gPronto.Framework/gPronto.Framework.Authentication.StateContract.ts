export type GProntoFrameworkAuthenticationStatus =
  "Initializing" | "SignedOut" | "SignedIn" | "Failure";

export type GProntoFrameworkAuthenticationState = {
  readonly Status: GProntoFrameworkAuthenticationStatus;
  readonly ErrorMessage: string;
};
