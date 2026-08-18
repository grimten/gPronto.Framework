import type { GProntoFrameworkRegisteredWebpageDefinition } from "./gPronto.Framework.RegisteredWebpages.DefinitionContract";

declare const registeredWebpageDefinitionRegistryBrand: unique symbol;

export type GProntoFrameworkRegisteredWebpageDefinitionRegistry =
  readonly GProntoFrameworkRegisteredWebpageDefinition[] & {
    readonly [registeredWebpageDefinitionRegistryBrand]: true;
  };
