import type { GProntoFrameworkRegisteredWebpageNavigationMetadata } from "./gPronto.Framework.RegisteredWebpages.NavigationMetadataContract";
import type { GProntoFrameworkRegisteredWebpageVisibilityMetadata } from "./gPronto.Framework.RegisteredWebpages.VisibilityMetadataContract";

export type GProntoFrameworkRegisteredWebpageMetadata = {
  title: string;
  navigation: GProntoFrameworkRegisteredWebpageNavigationMetadata;
  visibility: GProntoFrameworkRegisteredWebpageVisibilityMetadata;
};
