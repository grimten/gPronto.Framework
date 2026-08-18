import type { GProntoFrameworkNotificationRequest } from "./gPronto.Framework.ApplicationRoot.NotificationContract";
import { enqueueGProntoFrameworkDirectNotification } from "./gPronto.Framework.ApplicationRoot.NotificationStore";

export function createGProntoFrameworkNotificationDeduplicationKey(
  scope: string,
  ...parts: readonly string[]
): string {
  return JSON.stringify([scope, ...parts]);
}

export function notifyGProntoFramework(
  request: GProntoFrameworkNotificationRequest,
): void {
  if (request.message.trim().length === 0) {
    return;
  }

  const title =
    request.title === undefined || request.title.trim().length === 0
      ? undefined
      : request.title;
  const deduplicationKey =
    request.deduplicationKey === undefined ||
    request.deduplicationKey.trim().length === 0
      ? createGProntoFrameworkNotificationDeduplicationKey(
          "direct",
          request.type,
          title?.trim() ?? "",
          request.message.trim(),
        )
      : request.deduplicationKey;

  enqueueGProntoFrameworkDirectNotification({
    type: request.type,
    message: request.message,
    ...(title === undefined ? {} : { title }),
    deduplicationKey,
  });
}
