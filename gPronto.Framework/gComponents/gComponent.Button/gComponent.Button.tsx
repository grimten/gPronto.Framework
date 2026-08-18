import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import type { MouseEvent } from "react";
import { useLocation } from "react-router";
import { getGProntoFrameworkApplicationRootPublicPropertiesSnapshot } from "../../gPronto.Framework.ApplicationRoot.PublicPropertiesStore";
import { gProntoFrameworkIconRegistry } from "../../gPronto.Framework.Styles.IconRegistry";
import { recordGProntoFrameworkUserEvent } from "../../gPronto.Framework.UserEvents.Runtime";

export type GComponentButtonVariant =
  | "primary"
  | "primary-disabled"
  | "primary-loading"
  | "secondary"
  | "secondary-disabled"
  | "secondary-loading"
  | "danger"
  | "danger-disabled"
  | "danger-loading";

export type GComponentButtonIconName =
  keyof typeof gProntoFrameworkIconRegistry;

export type GComponentButtonProps = Readonly<{
  variant: GComponentButtonVariant;
  text: string;
  onClick: () => void;
  icon?: GComponentButtonIconName | null;
  iconOnly?: boolean;
}>;

const gComponentButtonDefaultIconNames = Object.freeze({
  primary: "Save",
  "primary-disabled": "Save",
  "primary-loading": "Save",
  secondary: "MoreActions",
  "secondary-disabled": "MoreActions",
  "secondary-loading": "MoreActions",
  danger: "Delete",
  "danger-disabled": "Delete",
  "danger-loading": "Delete",
} satisfies Readonly<
  Record<GComponentButtonVariant, GComponentButtonIconName>
>);

export function GComponentButton({
  variant,
  text,
  onClick,
  icon,
  iconOnly = false,
}: GComponentButtonProps) {
  const location = useLocation();
  const loading = variant.endsWith("-loading");
  const disabled = loading || variant.endsWith("-disabled");
  const resolvedIconName =
    icon === undefined ? gComponentButtonDefaultIconNames[variant] : icon;
  const ResolvedIcon =
    resolvedIconName === null
      ? undefined
      : gProntoFrameworkIconRegistry[resolvedIconName];
  const renderedIcon = loading ? (
    <CircularProgress
      size={16}
      color="inherit"
      className="gcomponent-button__loader"
    />
  ) : ResolvedIcon === undefined ? undefined : (
    <ResolvedIcon fontSize="small" className="gcomponent-button__icon" />
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const publicProperties =
      getGProntoFrameworkApplicationRootPublicPropertiesSnapshot();

    recordGProntoFrameworkUserEvent({
      event_type: "button_click",
      route: location.pathname,
      session_id: publicProperties.Session.SessionId,
      actor_user_id: publicProperties.User.UserId,
      metadata: { text },
    });

    onClick();
  };

  return (
    <Button
      type="submit"
      variant="contained"
      onClick={handleClick}
      disabled={disabled}
      aria-label={iconOnly ? text : undefined}
      className={`gcomponent-button gcomponent-button--${variant}${iconOnly ? " gcomponent-button--icon-only" : ""}`}
      startIcon={iconOnly ? undefined : renderedIcon}
    >
      {iconOnly ? (
        renderedIcon
      ) : (
        <span className="gcomponent-button__label gcomponent-button__label--normal">
          {text}
        </span>
      )}
    </Button>
  );
}
