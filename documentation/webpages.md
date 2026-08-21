# Webpages

## Status

Draft

## Scope

gPronto.Application:Ownership, folder structure, file naming, and exported naming of application webpages.
gPronto.Application:The required not-found webpage and catch-all route.
gPronto.Application:Webpage composition with one public **gLayout** and public **gComponents**.
gPronto.Application:Prohibition of application-owned webpage styling.
gPronto.Application:Webpage registration, route identity, metadata, navigation, and visibility requirements.
gPronto.Application:Framework import and usage requirements for webpage source.
gPronto.Application:Excludes the internal implementation of routing, **gLayouts**, and **gComponents**.

## Verification

Date: 2026-08-18

## Rules

<rule category="ownership-and-composition">

A webpage **MUST** be created in the **gPronto.Application**, not in **gPronto.Framework**.

</rule>

<rule category="not-found-webpage" id="folder">

The 404 webpage **MUST** live in the folder `gPronto.Application:src/webpages/not-found.webpage` under `gPronto.Application:src/webpages`.

</rule>

<rule category="not-found-webpage" id="single">

A **gPronto.Application** **MUST** contain exactly one 404 webpage.

</rule>

<rule category="not-found-webpage" id="identifier">

The 404 webpage identifier **MUST** be `not-found`.

</rule>

<rule category="not-found-webpage" id="route">

The 404 webpage route **MUST** be `{ kind: "not-found" }`.

</rule>

<rule category="not-found-webpage" id="catch-all">

**gPronto.Framework** **MUST** render the 404 webpage as the catch-all route.

</rule>

<rule category="structure-and-naming">

A webpage **MUST** consist of two parts held in one `gPronto.Application:src/webpages/<name>.webpage/webpage.tsx` file:

- the webpage component: the React component that renders the selected **gLayout** with its **gComponents**;
- the webpage definition: one GProntoFrameworkRegisteredWebpageDefinition that gives the webpage its identity, its route, its component, and its metadata.

The webpage definition's `component` property **MUST** reference the webpage component declared in the same `gPronto.Application:src/webpages/<name>.webpage/webpage.tsx` file.

Every webpage **MUST** live in its own direct-child folder under `gPronto.Application:src/webpages`.

Every webpage folder name **MUST** match `^[a-z][a-z0-9]*(?:-[a-z0-9]+)*\.webpage$`.

`<name>` **MUST** be the webpage folder name with the trailing `.webpage` removed.

Every webpage folder **MUST** contain exactly one file, named `gPronto.Application:src/webpages/<name>.webpage/webpage.tsx`.

That file **MUST** export exactly one value: a `const` named `webpage`, declared with `satisfies GProntoFrameworkRegisteredWebpageDefinition`.

A webpage **MUST NOT** export any value or type other than the `const` named `webpage`.

A webpage **MUST NOT** use a default export.

</rule>

<rule category="naming-the-name">

`<name>` **MUST NOT** contain `gpronto`, `framework`, `webpage`, `gcomponent`, or `glayout`.

</rule>

<rule category="composition">

Every webpage component **MUST** render exactly one **gLayout**, and that **gLayout** **MUST** be the root JSX element.

</rule>

<rule category="composition">

Every property of the rendered **gLayout** whose name matches `^openSlot([A-Z][a-z0-9]+)+$` **MUST** be assigned directly to exactly one **gComponent** JSX element.

</rule>

<rule category="composition">

The identifier of every JSX element in `gPronto.Application:src/webpages/<name>.webpage/webpage.tsx` **MUST** match `^GLayout([A-Z][a-z0-9]+)+$` or `^GComponent([A-Z][a-z0-9]+)+$`. An imported **gLayout** or **gComponent** **MUST NOT** be renamed.

</rule>

<rule category="composition">

A webpage **MUST NOT** render anything outside its selected **gLayout**.

</rule>

<rule category="composition">

`gPronto.Application:src/webpages/<name>.webpage/webpage.tsx` **MUST NOT** contain a `style`, `className`, or `sx` JSX attribute. It **MUST NOT** import a file whose name ends in `.css`, `.scss`, `.sass`, or `.less`.

</rule>

<rule category="registration">

The definition's `id` **MUST** be `<name>`.

Every webpage definition's `route` **MUST** be exactly one of:

- `{ kind: "path"; path: string }`
- `{ kind: "not-found" }`

When `route.kind` is `path`, `route.path` **MUST** begin with `/`.

Every webpage `id` **MUST** be unique within the webpage registry.

Every `route.path` **MUST** be unique within the webpage registry.

Every webpage definition **MUST** contain `metadata` with exactly this structure:

```ts
{
  title: string;
  navigation: {
    visible: boolean;
    label: string;
    order: number | null;
    parentId: GProntoFrameworkRegisteredWebpageIdentifier | null;
  };
  visibility:
    | {
        mode: "public";
        redirectPath: null;
      }
    | {
        mode: "authenticated";
        redirectPath: string;
      };
}
```

`metadata.title` **MUST** contain at least one non-whitespace character.

When `metadata.navigation.visible` is `true`, `metadata.navigation.label` **MUST** contain at least one non-whitespace character.

Non-null `metadata.navigation.order` values **MUST** be unique among webpages with the same `metadata.navigation.parentId`.

When `metadata.navigation.parentId` is not `null`, it **MUST** equal the `id` of another webpage in the same webpage registry.

The parent relationships defined by `metadata.navigation.parentId` **MUST NOT** contain a cycle.

`metadata.visibility.mode` **MUST** be exactly `public` or `authenticated`.

When `metadata.visibility.mode` is `public`, `metadata.visibility.redirectPath` **MUST** be `null`.

When `metadata.visibility.mode` is `authenticated`, `metadata.visibility.redirectPath` **MUST** equal the `route.path` of a webpage in the same webpage registry whose `metadata.visibility.mode` is `public`.

</rule>

<rule category="use">

Every import declaration in `gPronto.Application:src/webpages/<name>.webpage/webpage.tsx` **MUST** use the module specifier `@gpronto.framework`. The identifier of every runtime import **MUST** match `^GLayout([A-Z][a-z0-9]+)+$` or `^GComponent([A-Z][a-z0-9]+)+$`. Every other import **MUST** use the TypeScript `type` modifier.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-webpages">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against current webpage discovery, registry, validation, routing, visibility, metadata, layout, and application webpage sources. The **Agent** has approval to inspect and type-check those sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify every affected webpage, path, metadata field, or runtime behavior. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## What is a webpage

A webpage is one page that a person can open in a **gPronto.Application**.

A **gPronto.Application** discovers its webpages automatically. There is no central list to maintain by hand.

## The 404 webpage

The 404 webpage is the webpage a **gPronto.Application** renders when the address in the browser matches no other webpage.

Every **gPronto.Application** has exactly one. It is not reached by a path of its own: it declares the not-found route, and **gPronto.Framework** renders it as the catch-all route.

## How to add a webpage

### 1. Create the webpage folder

Choose the webpage `<name>`.

#### Example: webpage folder

For an example webpage named `home`, create this folder in the **gPronto.Application**:

`gPronto.Application:src/webpages/home.webpage`

The reusable folder pattern is:

`gPronto.Application:src/webpages/<name>.webpage`

### 2. Create the webpage file

Inside the webpage folder, create the file `gPronto.Application:src/webpages/<name>.webpage/webpage.tsx`.

#### Example: webpage file

For the example webpage named `home`, the complete file path is:

`gPronto.Application:src/webpages/home.webpage/webpage.tsx`

### 3. Add the imports to `gPronto.Application:src/webpages/<name>.webpage/webpage.tsx`

Import the selected **gLayout**, the required **gComponents**, and the webpage definition type from `@gpronto.framework`.

#### Example: imports

```tsx
import {
  GComponentTypography,
  GLayoutTwoColumnNavigation,
  type GProntoFrameworkRegisteredWebpageDefinition,
} from "@gpronto.framework";
```

### 4. Add the webpage component to `gPronto.Application:src/webpages/<name>.webpage/webpage.tsx`

The webpage component is a React function that returns the selected **gLayout**.

#### Example: webpage component

```tsx
function HomeWebpage() {
  return (
    <GLayoutTwoColumnNavigation
      openSlotContent={<GComponentTypography text="Home" variant="h1" />}
    />
  );
}
```

### 5. Add the exported webpage definition to `gPronto.Application:src/webpages/<name>.webpage/webpage.tsx`

The webpage definition connects the webpage component to its identity, route, and metadata.

Add these values to every metadata field:

| Field                              | Value to add                                                                                                                            |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `metadata.title`                   | Text containing at least one non-whitespace character, used as the webpage's browser title.                                             |
| `metadata.navigation.visible`      | `true` when navigation displays the webpage; otherwise `false`.                                                                         |
| `metadata.navigation.label`        | The text navigation displays for the webpage.                                                                                           |
| `metadata.navigation.order`        | A unique number defining the webpage's position among webpages with the same parent, or `null`.                                         |
| `metadata.navigation.parentId`     | The `id` of another webpage in the same registry, or `null` when the webpage has no parent; parent relationships cannot contain cycles. |
| `metadata.visibility.mode`         | `public` for access without signing in, or `authenticated` for access after signing in.                                                 |
| `metadata.visibility.redirectPath` | `null` for a public webpage, or the absolute path of a public webpage for an authenticated webpage.                                     |

The navigation values describe the intended navigation behavior, including values that the current implementation does not yet use.

#### Example: exported webpage definition

```tsx
export const webpage = {
  id: "home",
  route: {
    kind: "path",
    path: "/",
  },
  component: HomeWebpage,
  metadata: {
    title: "Home",
    navigation: {
      visible: true,
      label: "Home",
      order: 1,
      parentId: null,
    },
    visibility: {
      mode: "public",
      redirectPath: null,
    },
  },
} satisfies GProntoFrameworkRegisteredWebpageDefinition;
```

In this example, `gPronto.Application:src/webpages/home.webpage/webpage.tsx` contains the imports first, the webpage component second, and the exported webpage definition last.

