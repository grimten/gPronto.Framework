import type { GProntoFrameworkRegisteredWebpageDefinition } from "./gPronto.Framework.RegisteredWebpages.DefinitionContract";
import type { GProntoFrameworkRegisteredWebpageDefinitionRegistry } from "./gPronto.Framework.RegisteredWebpages.DefinitionRegistryContract";
import { createGProntoFrameworkRegisteredWebpageDefinitionRegistry } from "./gPronto.Framework.RegisteredWebpages.RegistryCreation";

function assertDiscoveredWebpageModule(
  modulePath: string,
  moduleValue: unknown,
): asserts moduleValue is Readonly<{
  webpage: GProntoFrameworkRegisteredWebpageDefinition;
}> {
  if (
    moduleValue === null ||
    typeof moduleValue !== "object" ||
    !Object.hasOwn(moduleValue, "webpage") ||
    !(moduleValue as Readonly<{ webpage?: unknown }>).webpage
  ) {
    throw new Error(
      `The discovered webpage module "${modulePath}" must export "webpage".`,
    );
  }
}

export function createGProntoFrameworkRegisteredWebpageDefinitionRegistryFromModules(
  webpageModules: Readonly<Record<string, unknown>>,
): GProntoFrameworkRegisteredWebpageDefinitionRegistry {
  const sortedModules = Object.entries(webpageModules).sort(
    ([firstPath], [secondPath]) => {
      if (firstPath < secondPath) {
        return -1;
      }

      if (firstPath > secondPath) {
        return 1;
      }

      return 0;
    },
  );
  const webpages = sortedModules.map(([modulePath, moduleValue]) => {
    assertDiscoveredWebpageModule(modulePath, moduleValue);
    return moduleValue.webpage;
  });

  return createGProntoFrameworkRegisteredWebpageDefinitionRegistry(webpages);
}
