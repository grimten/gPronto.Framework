import type { ReactNode } from "react";
import {
  GComponentFooter,
  GComponentHeader,
} from "../../gPronto.Framework.PublicApi.gComponentExports";

export type GLayoutCardsModernProps = Readonly<{
  openSlotCardHeader: ReactNode;
  openSlotCardBody: ReactNode;
}>;

export function GLayoutCardsModern({
  openSlotCardHeader,
  openSlotCardBody,
}: GLayoutCardsModernProps) {
  return (
    <main className="glayout-cards-modern">
      <div className="glayout-cards-modern__header-section">
        <GComponentHeader />
      </div>
      <div className="glayout-cards-modern__body-section">
        <div className="glayout-cards-modern__card">
          <div className="glayout-cards-modern__card-header">
            {openSlotCardHeader}
          </div>
          <div className="glayout-cards-modern__card-body">
            {openSlotCardBody}
          </div>
        </div>
      </div>
      <div className="glayout-cards-modern__footer-section">
        <GComponentFooter />
      </div>
    </main>
  );
}
