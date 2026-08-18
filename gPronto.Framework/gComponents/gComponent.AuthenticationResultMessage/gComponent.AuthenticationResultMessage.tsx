import { useEffect } from "react";
import { notifyGProntoFramework } from "../../gPronto.Framework.ApplicationRoot.NotificationCreation";

export type GComponentAuthenticationResultMessageProps = Readonly<{
  title?: string;
  message?: string;
  type?: "success" | "warning" | "info";
}>;

export function GComponentAuthenticationResultMessage({
  title = "Authentication result",
  message = "The authentication operation has completed.",
  type = "info",
}: GComponentAuthenticationResultMessageProps) {
  useEffect(() => {
    notifyGProntoFramework({
      type,
      title,
      message,
      deduplicationKey: JSON.stringify([
        "GComponentAuthenticationResultMessage",
        type,
        title,
        message,
      ]),
    });
  }, [message, title, type]);

  return null;
}
