import type { GProntoFrameworkRegisteredWebpageIdentifier } from "./gPronto.Framework.RegisteredWebpages.IdentifierContract";

export type GProntoFrameworkRegisteredWebpageNavigationMetadata = {
  visible: boolean;
  label: string;
  order: number | null;
  parentId: GProntoFrameworkRegisteredWebpageIdentifier | null;
};
