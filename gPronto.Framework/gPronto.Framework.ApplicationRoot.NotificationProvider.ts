import type {
  NotificationProvider,
  OpenNotificationParams,
} from "@refinedev/core";
import {
  closeGProntoFrameworkRefineNotification,
  openGProntoFrameworkRefineNotification,
} from "./gPronto.Framework.ApplicationRoot.NotificationStore";

function normalizeRefineDescription(
  description: string | undefined,
): string | undefined {
  return description === undefined || description.trim().length === 0
    ? undefined
    : description;
}

function normalizeProgressDuration(undoableTimeout: unknown): number {
  return typeof undoableTimeout === "number" &&
    Number.isFinite(undoableTimeout) &&
    undoableTimeout >= 0
    ? undoableTimeout
    : 0;
}

function openNotification(params: OpenNotificationParams): void {
  const progress = params.type === "progress";
  const title = normalizeRefineDescription(params.description);
  const undoableTimeoutSeconds = progress
    ? normalizeProgressDuration(params.undoableTimeout)
    : params.undoableTimeout;

  openGProntoFrameworkRefineNotification({
    type: params.type === "progress" ? "info" : params.type,
    message: params.message,
    ...(title === undefined ? {} : { title }),
    ...(params.key === undefined ? {} : { key: params.key }),
    progress,
    ...(params.cancelMutation === undefined
      ? {}
      : { cancelMutation: params.cancelMutation }),
    ...(undoableTimeoutSeconds === undefined ? {} : { undoableTimeoutSeconds }),
  });
}

export const gProntoFrameworkNotificationProvider: NotificationProvider =
  Object.freeze({
    open: openNotification,
    close: closeGProntoFrameworkRefineNotification,
  });
