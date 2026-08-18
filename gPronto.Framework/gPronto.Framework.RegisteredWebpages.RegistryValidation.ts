import type { GProntoFrameworkRegisteredWebpageDefinition } from "./gPronto.Framework.RegisteredWebpages.DefinitionContract";

export function validateRegisteredWebpages(
  webpages: readonly GProntoFrameworkRegisteredWebpageDefinition[],
): void {
  if (webpages.length === 0) {
    throw new Error("At least one webpage must be defined.");
  }

  const notFoundWebpages = webpages.filter(
    (webpage) => webpage.route.kind === "not-found",
  );

  if (notFoundWebpages.length !== 1) {
    throw new Error("Exactly one webpage must declare the not-found route.");
  }

  if (notFoundWebpages.some((webpage) => webpage.id !== "not-found")) {
    throw new Error(
      'The webpage that declares the not-found route must have the id "not-found".',
    );
  }

  const ids = new Set<string>();
  const paths = new Set<string>();

  for (const webpage of webpages) {
    const id = webpage.id.trim();
    const path =
      webpage.route.kind === "not-found" ? "*" : webpage.route.path.trim();

    if (!id) {
      throw new Error("Every webpage must have a non-empty id.");
    }

    if (path !== "*" && !path.startsWith("/")) {
      throw new Error(
        `The webpage "${id}" path must start with "/" or be "*".`,
      );
    }

    if (ids.has(id)) {
      throw new Error(`The webpage id "${id}" is defined more than once.`);
    }

    if (paths.has(path)) {
      throw new Error(`The webpage path "${path}" is defined more than once.`);
    }

    if (!webpage.metadata.title.trim()) {
      throw new Error(`The webpage "${id}" must have a title.`);
    }

    if (
      webpage.metadata.navigation.visible &&
      !webpage.metadata.navigation.label.trim()
    ) {
      throw new Error(
        `The visible webpage "${id}" must have a navigation label.`,
      );
    }

    ids.add(id);
    paths.add(path);
  }
}
