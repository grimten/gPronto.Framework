import type {
  AuthChangeEvent,
  Session,
  SupabaseClient,
  Subscription,
} from "@supabase/supabase-js";
import {
  setGProntoFrameworkAuthenticationFailure,
  setGProntoFrameworkAuthenticationStatus,
} from "./gPronto.Framework.Authentication.StateStore";
import {
  createGProntoFrameworkAuthenticationUserAndOrganisationSynchronization,
  type GProntoFrameworkAuthenticationUserAndOrganisationSynchronization,
} from "./gPronto.Framework.Authentication.UserAndOrganisationSynchronization";

type ActiveAuthenticationRuntime = {
  readonly client: SupabaseClient;
  readonly subscription: Subscription;
  readonly synchronization: GProntoFrameworkAuthenticationUserAndOrganisationSynchronization;
  consumers: number;
};

let activeRuntime: ActiveAuthenticationRuntime | undefined;

function handleAuthenticationStateChange(
  synchronization: GProntoFrameworkAuthenticationUserAndOrganisationSynchronization,
  event: AuthChangeEvent,
  session: Session | null,
): void {
  try {
    if (
      event === "SIGNED_OUT" ||
      (event === "INITIAL_SESSION" && session === null)
    ) {
      if (synchronization.clear()) {
        setGProntoFrameworkAuthenticationStatus("SignedOut");
      }

      return;
    }

    if (session === null) {
      return;
    }

    let synchronized = false;

    switch (event) {
      case "INITIAL_SESSION":
        synchronized = synchronization.synchronizeInitialSession(session);
        break;
      case "SIGNED_IN":
        synchronized = synchronization.synchronizeSignedIn(session);
        break;
      case "PASSWORD_RECOVERY":
        synchronized = synchronization.synchronizePasswordRecovery(session);
        break;
      case "TOKEN_REFRESHED":
        synchronized = synchronization.synchronizeTokenRefreshed(session);
        break;
      case "USER_UPDATED":
        synchronized = synchronization.synchronizeUserUpdated(session);
        break;
      case "MFA_CHALLENGE_VERIFIED":
        synchronized = synchronization.synchronizeMfaChallengeVerified(session);
        break;
    }

    if (synchronized) {
      setGProntoFrameworkAuthenticationStatus("SignedIn");
    }
  } catch (error) {
    setGProntoFrameworkAuthenticationFailure(error);
  }
}

export function startGProntoFrameworkAuthenticationRuntime(
  client: SupabaseClient,
): () => void {
  if (activeRuntime !== undefined) {
    if (activeRuntime.client !== client) {
      throw new Error("A different authentication runtime is already active.");
    }

    activeRuntime.consumers += 1;
  } else {
    setGProntoFrameworkAuthenticationStatus("Initializing");

    const synchronization =
      createGProntoFrameworkAuthenticationUserAndOrganisationSynchronization(
        client,
        setGProntoFrameworkAuthenticationFailure,
      );
    const { data } = client.auth.onAuthStateChange((event, session) => {
      handleAuthenticationStateChange(synchronization, event, session);
    });

    activeRuntime = {
      client,
      subscription: data.subscription,
      synchronization,
      consumers: 1,
    };
  }

  let stopped = false;

  return () => {
    if (stopped || activeRuntime === undefined) {
      return;
    }

    stopped = true;
    activeRuntime.consumers -= 1;

    if (activeRuntime.consumers === 0) {
      activeRuntime.synchronization.stop();
      activeRuntime.subscription.unsubscribe();
      activeRuntime = undefined;
    }
  };
}
