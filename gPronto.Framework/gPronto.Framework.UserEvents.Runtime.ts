import type { SupabaseClient } from "@supabase/supabase-js";
import { reportGProntoFrameworkError } from "./gPronto.Framework.ApplicationRoot.NotificationErrorCreation";
import { getGProntoFrameworkAuthenticationStateSnapshot } from "./gPronto.Framework.Authentication.StateStore";

export type GProntoFrameworkUserEventPageVisit = {
  readonly event_type: "page_visit";
  readonly key: string;
  readonly page_id: string;
  readonly route: string;
  readonly session_id: string;
  readonly actor_user_id: string;
};

export type GProntoFrameworkUserEventButtonClick = {
  readonly event_type: "button_click";
  readonly route: string;
  readonly session_id: string;
  readonly actor_user_id: string;
  readonly metadata: { readonly text: string };
};

export type GProntoFrameworkUserEvent =
  GProntoFrameworkUserEventPageVisit | GProntoFrameworkUserEventButtonClick;

type ActiveUserEventRuntime = {
  readonly client: SupabaseClient;
  consumers: number;
};

let activeRuntime: ActiveUserEventRuntime | undefined;
let lastPageVisitKey: string | undefined;
let lastPageVisitPageId: string | undefined;
let failedWriteCount = 0;

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu.test(
    value,
  );
}

function insertUserEventRow(
  client: SupabaseClient,
  row: Record<string, unknown>,
): void {
  void (async () => {
    try {
      const { error } = await client.from("user_events").insert(row);

      if (error !== null) {
        failedWriteCount += 1;
        reportGProntoFrameworkError(
          error,
          "gPronto.Framework could not write a user event.",
        );
      }
    } catch (writeError) {
      failedWriteCount += 1;
      reportGProntoFrameworkError(
        writeError,
        "gPronto.Framework could not write a user event.",
      );
    }
  })();
}

export function getGProntoFrameworkUserEventFailedWriteCount(): number {
  return failedWriteCount;
}

export function recordGProntoFrameworkUserEvent(
  event: GProntoFrameworkUserEvent,
): void {
  if (activeRuntime === undefined) {
    return;
  }

  const authenticationState = getGProntoFrameworkAuthenticationStateSnapshot();

  if (
    authenticationState.Status !== "SignedIn" ||
    !isUuid(event.actor_user_id) ||
    !isUuid(event.session_id)
  ) {
    return;
  }

  if (event.event_type === "page_visit") {
    if (event.key === lastPageVisitKey) {
      return;
    }

    lastPageVisitKey = event.key;
    lastPageVisitPageId = event.page_id;

    insertUserEventRow(activeRuntime.client, {
      event_type: event.event_type,
      page_id: event.page_id,
      route: event.route,
      session_id: event.session_id,
      actor_user_id: event.actor_user_id,
    });
    return;
  }

  insertUserEventRow(activeRuntime.client, {
    event_type: event.event_type,
    page_id: lastPageVisitPageId ?? null,
    route: event.route,
    session_id: event.session_id,
    actor_user_id: event.actor_user_id,
    metadata: event.metadata,
  });
}

export function startGProntoFrameworkUserEventRuntime(
  client: SupabaseClient,
): () => void {
  if (activeRuntime !== undefined) {
    if (activeRuntime.client !== client) {
      throw new Error("A different user event runtime is already active.");
    }

    activeRuntime.consumers += 1;
  } else {
    activeRuntime = {
      client,
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
      activeRuntime = undefined;
      lastPageVisitKey = undefined;
      lastPageVisitPageId = undefined;
    }
  };
}
