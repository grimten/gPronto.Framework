import { NavLink } from "react-router";
import { useGRegisteredWebpageDefinitionRegistry } from "../../gPronto.Framework.RegisteredWebpages.DefinitionRegistryContext";

export type GComponentNavigationProps = Readonly<{
  orientation?: "vertical" | "horizontal";
}>;

export function GComponentNavigation({
  orientation = "vertical",
}: GComponentNavigationProps) {
  const webpages = useGRegisteredWebpageDefinitionRegistry();

  return (
    <nav
      className={`gcomponent-navigation gcomponent-navigation--${orientation}`}
      aria-label="Webpages"
    >
      <ul className="gcomponent-navigation__list">
        {webpages.map((webpage) =>
          webpage.route.kind === "path" ? (
            <li key={webpage.id} className="gcomponent-navigation__item">
              <NavLink
                className={({ isActive }) =>
                  `gcomponent-navigation__link gcomponent-navigation__link--normal${isActive ? " gcomponent-navigation__link--active" : ""}`
                }
                to={webpage.route.path}
              >
                {webpage.route.path}
              </NavLink>
            </li>
          ) : null,
        )}
      </ul>
    </nav>
  );
}
