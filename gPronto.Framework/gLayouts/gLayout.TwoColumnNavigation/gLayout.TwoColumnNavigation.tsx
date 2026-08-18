import type { ReactNode } from "react";
import { GComponentNavigation } from "../../gPronto.Framework.PublicApi.gComponentExports";

export type GLayoutTwoColumnNavigationProps = Readonly<{
  content: ReactNode;
}>;

export function GLayoutTwoColumnNavigation({
  content,
}: GLayoutTwoColumnNavigationProps) {
  return (
    <main className="glayout-two-column-navigation">
      <div className="glayout-two-column-navigation__navigation">
        <GComponentNavigation />
      </div>
      <div className="glayout-two-column-navigation__content">{content}</div>
    </main>
  );
}
