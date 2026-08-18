import Typography from "@mui/material/Typography";
import {
  gProntoFrameworkTypographyRegistry,
  type GProntoFrameworkTypographyVariant,
} from "../../gPronto.Framework.Styles.TypographyRegistry";

const typographyVariants = {
  normal: { component: "p", muiVariant: "body1" },
  small: { component: "small", muiVariant: "body2" },
  lead: { component: "p", muiVariant: "body1" },
  h1: { component: "h1", muiVariant: "h1" },
  h2: { component: "h2", muiVariant: "h2" },
  h3: { component: "h3", muiVariant: "h3" },
  h4: { component: "h4", muiVariant: "h4" },
  h5: { component: "h5", muiVariant: "h5" },
  h6: { component: "h6", muiVariant: "h6" },
} as const;

export type GComponentTypographyProps = Readonly<{
  text: string;
  variant?: GProntoFrameworkTypographyVariant;
}>;

export function GComponentTypography({
  text,
  variant = "normal",
}: GComponentTypographyProps) {
  const selectedVariant = typographyVariants[variant];

  return (
    <Typography
      component={selectedVariant.component}
      variant={selectedVariant.muiVariant}
      className={`gcomponent-typography ${gProntoFrameworkTypographyRegistry[variant]}`}
      data-typography-variant={variant}
    >
      {text}
    </Typography>
  );
}
