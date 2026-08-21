# Application Developer

## Create a webpage

A webpage is created entirely inside the current **gPronto.Application** repository.

### Create the webpage folder

Choose a lowercase, hyphen-separated webpage name. Create one folder for it directly under `gPronto.Application:src/webpages`, using this pattern:

`gPronto.Application:src/webpages/<name>.webpage`

### Create the webpage file

Create this file inside the webpage folder:

`gPronto.Application:src/webpages/<name>.webpage/webpage.tsx`

The file contains the webpage component and one exported `webpage` definition. The definition supplies the webpage identifier, route, component, metadata, navigation settings, and visibility settings.

The application bootstrap discovers webpage files through the pattern declared in `gPronto.Application:src/gPronto.Application.Bootstrap.EntryPoint.ts`.

The mandatory webpage-definition and metadata shape comes from the public `GProntoFrameworkRegisteredWebpageDefinition` type exported by `@gpronto.framework`. Declare the exported `webpage` value with `satisfies GProntoFrameworkRegisteredWebpageDefinition` so the application type-check verifies the public contract. The framework performs additional registry validation automatically when the application starts.

#### Information exposed by the webpage-definition contract

The public TypeScript contract exposes this information to the Application Developer:

```ts
import type { ComponentType } from "react";

export type GProntoFrameworkRegisteredWebpageIdentifier = string;

export type GProntoFrameworkRegisteredWebpageRouteDefinition =
  | {
      kind: "path";
      path: string;
    }
  | {
      kind: "not-found";
    };

export type GProntoFrameworkRegisteredWebpageNavigationMetadata = {
  visible: boolean;
  label: string;
  order: number | null;
  parentId: GProntoFrameworkRegisteredWebpageIdentifier | null;
};

export type GProntoFrameworkRegisteredWebpageVisibilityMetadata =
  | {
      mode: "public";
      redirectPath: null;
    }
  | {
      mode: "authenticated";
      redirectPath: string;
    };

export type GProntoFrameworkRegisteredWebpageMetadata = {
  title: string;
  navigation: GProntoFrameworkRegisteredWebpageNavigationMetadata;
  visibility: GProntoFrameworkRegisteredWebpageVisibilityMetadata;
};

export type GProntoFrameworkRegisteredWebpageDefinition = {
  id: GProntoFrameworkRegisteredWebpageIdentifier;
  route: GProntoFrameworkRegisteredWebpageRouteDefinition;
  component: ComponentType;
  metadata: GProntoFrameworkRegisteredWebpageMetadata;
};
```

This contract tells the Application Developer which properties are required, their types, the permitted route variants, the permitted visibility variants, and where navigation metadata belongs.

The type contract does not guarantee registry-wide conditions such as unique identifiers and paths, required non-empty text, or the single not-found webpage. The framework checks those conditions through runtime registry validation.

The generated public declaration artifact planned for **gPronto.Framework** must expose this same public type without requiring access to framework implementation source.

### Choose a gLayout

Choose one public **gLayout** listed by the allow-listed public export contract `gPronto.Framework:gPronto.Framework/gPronto.Framework.PublicApi.gLayoutExports.ts`. The selected **gLayout** is the root of the webpage component and determines where webpage content can be placed.

#### Example: gLayout export contract

One export line in that public contract has this shape:

```ts
export * from "./gLayouts/gLayout.SingleColumn/gLayout.SingleColumn";
```

This makes `GLayoutSingleColumn` and `GLayoutSingleColumnProps` available through `@gpronto.framework` without making the implementation folder part of the Application Developer's permitted reading surface.

Use the public TypeScript surface exported by `@gpronto.framework` to identify the selected **gLayout** and its props. The application type-check consumes those public types automatically; the Application Developer must not inspect the **gLayout** implementation folder.

The generated public declaration artifact must eventually expose the same public **gLayout** exports and props in a readable contract outside the implementation folders.

Import the selected **gLayout** from `@gpronto.framework`.

### Choose gComponents

Choose the public **gComponents** needed by the webpage from the [gComponent catalog](../documentation/gcomponent-catalog.md). The catalog describes the purpose and public inputs of each available **gComponent**.

Import the selected **gComponents** from `@gpronto.framework` and place them in the supported content inputs of the selected **gLayout**.

### Register the webpage

No manual registration step is required. The application automatically discovers every file matching `gPronto.Application:src/webpages/**/webpage.tsx`.

The webpage becomes part of the application when its file is in the required location and exports a valid `webpage` definition.

## Edit a webpage

## Delete a webpage

