import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useEffect } from "react";
import {
  createGProntoFrameworkNotificationDeduplicationKey,
  notifyGProntoFramework,
} from "../../gPronto.Framework.ApplicationRoot.NotificationCreation";

const alertVariants = {
  filled: "filled",
  light: "standard",
  outline: "outlined",
} as const;

function resolveAlertSeverity(
  color: string | undefined,
): "error" | "info" | "success" | "warning" {
  switch (color) {
    case "red":
      return "error";
    case "green":
      return "success";
    case "yellow":
    case "orange":
      return "warning";
    default:
      return "info";
  }
}

export type GComponentAlertProps = Readonly<{
  title?: string;
  message: string;
  color?: string;
  variant?: "filled" | "light" | "outline";
}>;
export function GComponentAlert({
  title,
  message,
  color,
  variant = "light",
}: GComponentAlertProps) {
  const severity = resolveAlertSeverity(color);
  const normalizedTitle =
    title === undefined || title.trim().length === 0 ? undefined : title;
  const normalizedMessage = message.trim();

  useEffect(() => {
    if (normalizedMessage.length === 0) {
      return;
    }

    notifyGProntoFramework({
      type: severity,
      message,
      ...(normalizedTitle === undefined ? {} : { title: normalizedTitle }),
      deduplicationKey: createGProntoFrameworkNotificationDeduplicationKey(
        "alert",
        severity,
        normalizedTitle?.trim() ?? "",
        normalizedMessage,
      ),
    });
  }, [message, normalizedMessage, normalizedTitle, severity]);

  return (
    <Alert
      severity={severity}
      variant={alertVariants[variant]}
      className={`gcomponent-alert gcomponent-alert--${variant} gcomponent-alert--${severity}`}
      slotProps={{
        icon: { className: "gcomponent-alert__icon" },
      }}
    >
      <div className="gcomponent-alert__body">
        {normalizedTitle === undefined ? null : (
          <AlertTitle className="gcomponent-alert__title gcomponent-alert__title--h6">
            {normalizedTitle}
          </AlertTitle>
        )}
        <div className="gcomponent-alert__message gcomponent-alert__message--normal">
          {message}
        </div>
      </div>
    </Alert>
  );
}
