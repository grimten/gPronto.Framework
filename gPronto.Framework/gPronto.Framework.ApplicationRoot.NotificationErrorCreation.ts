import {
  createGProntoFrameworkNotificationDeduplicationKey,
  notifyGProntoFramework,
} from "./gPronto.Framework.ApplicationRoot.NotificationCreation";
import { hasActiveGProntoFrameworkNotificationDeduplicationKey } from "./gPronto.Framework.ApplicationRoot.NotificationStore";

const originalBrowserConsoleError = console.error.bind(console);
const errorObjectDeduplicationKeys = new WeakMap<object, string>();

function readErrorMessage(error: unknown, contextMessage: string): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  return contextMessage;
}

function createErrorDeduplicationKey(
  error: unknown,
  contextMessage: string,
  message: string,
): string {
  const contentKey = createGProntoFrameworkNotificationDeduplicationKey(
    "error",
    contextMessage,
    message,
  );

  if (typeof error !== "object" || error === null) {
    return contentKey;
  }

  const existingKey = errorObjectDeduplicationKeys.get(error);

  if (
    existingKey !== undefined &&
    hasActiveGProntoFrameworkNotificationDeduplicationKey(existingKey)
  ) {
    return existingKey;
  }

  errorObjectDeduplicationKeys.set(error, contentKey);
  return contentKey;
}

export function reportGProntoFrameworkError(
  error: unknown,
  contextMessage: string,
): void {
  const normalizedContextMessage = contextMessage.trim();

  if (normalizedContextMessage.length === 0) {
    throw new TypeError(
      "The gPronto.Framework error context message must be non-empty.",
    );
  }

  originalBrowserConsoleError(normalizedContextMessage, error);

  const message = readErrorMessage(error, normalizedContextMessage);

  notifyGProntoFramework({
    type: "error",
    title: normalizedContextMessage,
    message,
    deduplicationKey: createErrorDeduplicationKey(
      error,
      normalizedContextMessage,
      message,
    ),
  });
}
