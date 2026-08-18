import Chip from "@mui/material/Chip";

function resolveBadgeColor(
  color: string | undefined,
): "default" | "error" | "primary" | "success" {
  switch (color) {
    case "red":
      return "error";
    case "green":
      return "success";
    case "blue":
      return "primary";
    default:
      return "default";
  }
}

export type GComponentBadgeProps = Readonly<{
  text: string;
  color?: string;
  variant?: "filled" | "light" | "outline";
}>;
export function GComponentBadge({
  text,
  color,
  variant = "light",
}: GComponentBadgeProps) {
  const resolvedColor = resolveBadgeColor(color);

  return (
    <Chip
      label={
        <span className="gcomponent-badge__text gcomponent-badge__text--small">
          {text}
        </span>
      }
      size="small"
      color={resolvedColor}
      variant={variant === "outline" ? "outlined" : "filled"}
      className={`gcomponent-badge gcomponent-badge--${variant} gcomponent-badge--${resolvedColor}`}
    />
  );
}
