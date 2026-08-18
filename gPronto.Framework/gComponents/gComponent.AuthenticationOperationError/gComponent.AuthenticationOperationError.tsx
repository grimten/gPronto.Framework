import { useEffect } from "react";
import { notifyGProntoFramework } from "../../gPronto.Framework.ApplicationRoot.NotificationCreation";

export type GComponentAuthenticationOperationErrorProps = Readonly<{
  title?: string;
  message?: string;
}>;

export function GComponentAuthenticationOperationError({
  title = "Authentication failed",
  message = "The authentication operation could not be completed.",
}: GComponentAuthenticationOperationErrorProps) {
  useEffect(() => {
    notifyGProntoFramework({
      type: "error",
      title,
      message,
      deduplicationKey: JSON.stringify([
        "GComponentAuthenticationOperationError",
        title,
        message,
      ]),
    });
  }, [message, title]);

  return null;
}
