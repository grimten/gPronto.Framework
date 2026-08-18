import { createContext, useContext, type ReactNode } from "react";
import type { GProntoFrameworkRegisteredWebpageDefinitionRegistry } from "./gPronto.Framework.RegisteredWebpages.DefinitionRegistryContract";

const GRegisteredWebpageDefinitionRegistryContext =
  createContext<GProntoFrameworkRegisteredWebpageDefinitionRegistry | null>(
    null,
  );

type GRegisteredWebpageDefinitionRegistryProviderProps = {
  webpages: GProntoFrameworkRegisteredWebpageDefinitionRegistry;
  children: ReactNode;
};

export function GRegisteredWebpageDefinitionRegistryProvider({
  webpages,
  children,
}: GRegisteredWebpageDefinitionRegistryProviderProps) {
  return (
    <GRegisteredWebpageDefinitionRegistryContext.Provider value={webpages}>
      {children}
    </GRegisteredWebpageDefinitionRegistryContext.Provider>
  );
}

export function useGRegisteredWebpageDefinitionRegistry(): GProntoFrameworkRegisteredWebpageDefinitionRegistry {
  const webpages = useContext(GRegisteredWebpageDefinitionRegistryContext);

  if (webpages === null) {
    throw new Error(
      "useGRegisteredWebpageDefinitionRegistry must be called inside GRegisteredWebpageDefinitionRegistryProvider.",
    );
  }

  return webpages;
}
