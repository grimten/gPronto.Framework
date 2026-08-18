import type { SupabaseClient } from "@supabase/supabase-js";
import { getGProntoFrameworkApplicationRootPublicPropertiesSnapshot } from "./gPronto.Framework.ApplicationRoot.PublicPropertiesStore";
import { getGProntoFrameworkAuthenticationStateSnapshot } from "./gPronto.Framework.Authentication.StateStore";

const HEARTBEAT_INTERVAL_MILLISECONDS = 30_000;
const activityEventNames = [
  "pointerdown",
  "keydown",
  "scroll",
  "touchstart",
] as const;

type ActiveHeartbeatRuntime = {
  readonly client: SupabaseClient;
  readonly stop: () => void;
  consumers: number;
};

let activeRuntime: ActiveHeartbeatRuntime | undefined;

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu.test(
    value,
  );
}

function createHeartbeatRuntime(client: SupabaseClient): () => void {
  let active = true;
  let activityGeneration = 0;
  let hadActivity = false;
  let requestInFlight = false;

  const recordActivity = () => {
    activityGeneration += 1;
    hadActivity = true;
  };

  for (const eventName of activityEventNames) {
    window.addEventListener(eventName, recordActivity, { passive: true });
  }

  const intervalId = window.setInterval(() => {
    if (!active || requestInFlight || !hadActivity) {
      return;
    }

    const authenticationState =
      getGProntoFrameworkAuthenticationStateSnapshot();
    const publicProperties =
      getGProntoFrameworkApplicationRootPublicPropertiesSnapshot();
    const userId = publicProperties.User.UserId;
    const sessionId = publicProperties.Session.SessionId;

    if (
      authenticationState.Status !== "SignedIn" ||
      !isUuid(userId) ||
      !isUuid(sessionId)
    ) {
      return;
    }

    const requestActivityGeneration = activityGeneration;
    requestInFlight = true;

    void (async () => {
      try {
        const { error } = await client.from("user_sessions").upsert(
          {
            user_id: userId,
            session_id: sessionId,
            last_seen_at: new Date().toISOString(),
            is_visible: document.visibilityState === "visible",
            is_deleted: false,
          },
          {
            onConflict: "user_id,session_id",
          },
        );

        if (error !== null) {
          hadActivity = true;
          return;
        }

        if (activityGeneration === requestActivityGeneration) {
          hadActivity = false;
        }
      } catch {
        hadActivity = true;
      } finally {
        requestInFlight = false;
      }
    })();
  }, HEARTBEAT_INTERVAL_MILLISECONDS);

  return () => {
    if (!active) {
      return;
    }

    active = false;
    window.clearInterval(intervalId);

    for (const eventName of activityEventNames) {
      window.removeEventListener(eventName, recordActivity);
    }
  };
}

export function startGProntoFrameworkUserSessionHeartbeatRuntime(
  client: SupabaseClient,
): () => void {
  if (activeRuntime !== undefined) {
    if (activeRuntime.client !== client) {
      throw new Error("A different heartbeat runtime is already active.");
    }

    activeRuntime.consumers += 1;
  } else {
    activeRuntime = {
      client,
      stop: createHeartbeatRuntime(client),
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
      activeRuntime.stop();
      activeRuntime = undefined;
    }
  };
}
