import { useSyncExternalStore } from "react";
import {
  getGProntoFrameworkApplicationRootPublicPropertiesSnapshot,
  subscribeToGProntoFrameworkApplicationRootPublicProperties,
} from "../../gPronto.Framework.ApplicationRoot.PublicPropertiesStore";

export function GComponentFooter() {
  const publicProperties = useSyncExternalStore(
    subscribeToGProntoFrameworkApplicationRootPublicProperties,
    getGProntoFrameworkApplicationRootPublicPropertiesSnapshot,
  );
  const values = [
    ["Organisation", publicProperties.Organisation.Name],
    ["First name", publicProperties.User.FirstName],
    ["Last name", publicProperties.User.LastName],
    ["Email", publicProperties.User.Email],
    ["Role", publicProperties.User.Role],
  ] as const;

  return (
    <footer className="gcomponent-footer">
      <dl className="gcomponent-footer__values">
        {values.map(([label, value]) => (
          <div key={label} className="gcomponent-footer__value">
            <dt className="gcomponent-footer__label">{label}</dt>
            <dd className="gcomponent-footer__text">{value}</dd>
          </div>
        ))}
      </dl>
    </footer>
  );
}
