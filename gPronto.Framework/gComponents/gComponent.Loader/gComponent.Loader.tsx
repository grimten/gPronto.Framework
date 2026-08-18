import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";
import {
  createGProntoFrameworkNotificationDeduplicationKey,
  notifyGProntoFramework,
} from "../../gPronto.Framework.ApplicationRoot.NotificationCreation";

const loaderSizes = {
  xs: 16,
  sm: 22,
  md: 28,
  lg: 36,
  xl: 44,
} as const;

function resolveLoaderColor(
  color: string | undefined,
): "error" | "info" | "primary" | "success" {
  switch (color) {
    case "red":
      return "error";
    case "green":
      return "success";
    case "blue":
      return "info";
    default:
      return "primary";
  }
}

export type GComponentLoaderProps = Readonly<{
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  label?: string;
}>;
export function GComponentLoader({
  size = "md",
  color,
  label = "Loading",
}: GComponentLoaderProps) {
  const normalizedLabel = label.trim();
  const resolvedColor = resolveLoaderColor(color);

  useEffect(() => {
    if (normalizedLabel.length === 0) {
      return;
    }

    notifyGProntoFramework({
      type: "info",
      title: "Loading",
      message: label,
      deduplicationKey: createGProntoFrameworkNotificationDeduplicationKey(
        "loader",
        normalizedLabel,
      ),
    });
  }, [label, normalizedLabel]);

  return (
    <CircularProgress
      size={loaderSizes[size]}
      color={resolvedColor}
      aria-label={label}
      className={`gcomponent-loader gcomponent-loader--${resolvedColor}`}
    />
  );
}
