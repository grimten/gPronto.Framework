import type { GProntoFrameworkRegisteredWebpageDefinition } from "./gPronto.Framework.RegisteredWebpages.DefinitionContract";
import type { GProntoFrameworkRegisteredWebpageDefinitionRegistry } from "./gPronto.Framework.RegisteredWebpages.DefinitionRegistryContract";
import { validateRegisteredWebpages } from "./gPronto.Framework.RegisteredWebpages.RegistryValidation";

export function createGProntoFrameworkRegisteredWebpageDefinitionRegistry<
  const TWebpages extends
    readonly GProntoFrameworkRegisteredWebpageDefinition[],
>(
  webpages: TWebpages,
): TWebpages & GProntoFrameworkRegisteredWebpageDefinitionRegistry {
  validateRegisteredWebpages(webpages);

  return webpages as TWebpages &
    GProntoFrameworkRegisteredWebpageDefinitionRegistry;
}
