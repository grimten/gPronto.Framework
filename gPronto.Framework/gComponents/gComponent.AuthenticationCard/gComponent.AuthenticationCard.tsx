import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import type { ReactNode } from "react";

import { GComponentTypography } from "../gComponent.Typography/gComponent.Typography";

export type GComponentAuthenticationCardProps = Readonly<{
  title: string;
  children: ReactNode;
}>;

export function GComponentAuthenticationCard({
  title,
  children,
}: GComponentAuthenticationCardProps) {
  return (
    <Card variant="outlined" className="gcomponent-authentication-card">
      <CardHeader
        className="gcomponent-authentication-card__header"
        title={<GComponentTypography text={title} variant="h1" />}
        disableTypography
      />
      <CardContent className="gcomponent-authentication-card__content">
        {children}
      </CardContent>
    </Card>
  );
}
