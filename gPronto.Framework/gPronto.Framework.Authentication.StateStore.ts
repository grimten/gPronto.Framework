import type {
  GProntoFrameworkAuthenticationState,
  GProntoFrameworkAuthenticationStatus,
} from "./gPronto.Framework.Authentication.StateContract";

type AuthenticationStateListener = () => void;

const listeners = new Set<AuthenticationStateListener>();

let authenticationState: GProntoFrameworkAuthenticationState = Object.freeze({
  Status: "Initializing",
  ErrorMessage: "-",
});

function publishAuthenticationState(
  nextState: GProntoFrameworkAuthenticationState,
): void {
  authenticationState = Object.freeze(nextState);
  listeners.forEach((listener) => listener());
}

export function getGProntoFrameworkAuthenticationStateSnapshot(): GProntoFrameworkAuthenticationState {
  return authenticationState;
}

export function subscribeToGProntoFrameworkAuthenticationState(
  listener: AuthenticationStateListener,
): () => void {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

export function setGProntoFrameworkAuthenticationStatus(
  Status: Exclude<GProntoFrameworkAuthenticationStatus, "Failure">,
): void {
  publishAuthenticationState({ Status, ErrorMessage: "-" });
}

export function setGProntoFrameworkAuthenticationFailure(error: unknown): void {
  const ErrorMessage =
    error instanceof Error && error.message.length > 0
      ? error.message
      : "Authentication failed.";

  publishAuthenticationState({ Status: "Failure", ErrorMessage });
}
