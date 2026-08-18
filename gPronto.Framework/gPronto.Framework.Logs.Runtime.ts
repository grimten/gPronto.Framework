import type { SupabaseClient } from "@supabase/supabase-js";
import { reportGProntoFrameworkError } from "./gPronto.Framework.ApplicationRoot.NotificationErrorCreation";
import { getGProntoFrameworkApplicationRootPublicPropertiesSnapshot } from "./gPronto.Framework.ApplicationRoot.PublicPropertiesStore";
import { getGProntoFrameworkAuthenticationStateSnapshot } from "./gPronto.Framework.Authentication.StateStore";

const LOG_CATEGORY = "-";
const LOG_LEVEL = "-";
const LOG_SOURCE = "-";

type LogListenerEventName = "error" | "unhandledrejection";

type CaughtError = {
  readonly message: string;
  readonly name: string;
  readonly stack: string | null;
};

type ActiveLogsRuntime = {
  readonly client: SupabaseClient;
  readonly stop: () => void;
  consumers: number;
};

let activeRuntime: ActiveLogsRuntime | undefined;
let failedWriteCount = 0;

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu.test(
    value,
  );
}

function describeError(value: unknown, fallbackMessage: string): CaughtError {
  if (value instanceof Error) {
    return {
      message: value.message === "" ? fallbackMessage : value.message,
      name: value.name,
      stack: typeof value.stack === "string" ? value.stack : null,
    };
  }

  if (typeof value === "string" && value !== "") {
    return { message: value, name: "-", stack: null };
  }

  return { message: fallbackMessage, name: "-", stack: null };
}

function createLogsRuntime(client: SupabaseClient): () => void {
  let active = true;

  const writeLogRow = (
    eventName: LogListenerEventName,
    caughtError: CaughtError,
  ) => {
    const authenticationState =
      getGProntoFrameworkAuthenticationStateSnapshot();
    const publicProperties =
      getGProntoFrameworkApplicationRootPublicPropertiesSnapshot();
    const authUserId = publicProperties.User.AuthUserId;
    const userId = publicProperties.User.UserId;

    if (authenticationState.Status !== "SignedIn" || !isUuid(authUserId)) {
      reportGProntoFrameworkError(
        caughtError.message,
        "gPronto.Framework did not write a log row because no signed-in user is available.",
      );
      return;
    }

    void (async () => {
      try {
        const { error } = await client.from("logs").insert({
          log_category: LOG_CATEGORY,
          level: LOG_LEVEL,
          source: LOG_SOURCE,
          auth_user_id: authUserId,
          actor_user_id: isUuid(userId) ? userId : null,
          message: caughtError.message,
          error_code: caughtError.name,
          event: eventName,
          metadata: {
            route: window.location.pathname,
            stack: caughtError.stack,
          },
        });

        if (error !== null) {
          failedWriteCount += 1;
          reportGProntoFrameworkError(
            error,
            "gPronto.Framework could not write a log row.",
          );
        }
      } catch (writeError) {
        failedWriteCount += 1;
        reportGProntoFrameworkError(
          writeError,
          "gPronto.Framework could not write a log row.",
        );
      }
    })();
  };

  const handleError = (event: ErrorEvent) => {
    if (!active) {
      return;
    }

    try {
      writeLogRow(
        "error",
        describeError(
          event.error,
          event.message === "" ? "An unhandled error occurred." : event.message,
        ),
      );
    } catch (handlerError) {
      reportGProntoFrameworkError(
        handlerError,
        "gPronto.Framework could not handle an unhandled error.",
      );
    }
  };

  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    if (!active) {
      return;
    }

    try {
      writeLogRow(
        "unhandledrejection",
        describeError(event.reason, "An unhandled promise rejection occurred."),
      );
    } catch (handlerError) {
      reportGProntoFrameworkError(
        handlerError,
        "gPronto.Framework could not handle an unhandled promise rejection.",
      );
    }
  };

  window.addEventListener("error", handleError);
  window.addEventListener("unhandledrejection", handleUnhandledRejection);

  return () => {
    if (!active) {
      return;
    }

    active = false;
    window.removeEventListener("error", handleError);
    window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  };
}

export function getGProntoFrameworkLogsFailedWriteCount(): number {
  return failedWriteCount;
}

export function startGProntoFrameworkLogsRuntime(
  client: SupabaseClient,
): () => void {
  if (activeRuntime !== undefined) {
    if (activeRuntime.client !== client) {
      throw new Error("A different logs runtime is already active.");
    }

    activeRuntime.consumers += 1;
  } else {
    activeRuntime = {
      client,
      stop: createLogsRuntime(client),
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
