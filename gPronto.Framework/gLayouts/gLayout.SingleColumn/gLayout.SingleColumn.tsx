import type { ReactNode } from "react";

export type GLayoutSingleColumnProps = Readonly<{
  children: ReactNode;
}>;

export function GLayoutSingleColumn({ children }: GLayoutSingleColumnProps) {
  return (
    <main className="glayout-single-column">
      <div className="glayout-single-column__content">{children}</div>
    </main>
  );
}
