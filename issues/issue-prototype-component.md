# Add prototype information to every layout

## User input

This document has drifted and needs to be cleaned up. This is what we want, and nothing else.

1. One new **gComponent**, added to every **gLayout** we have.
2. The **gComponent** only shows text. No styling. Nothing else.
3. The **Fixed slot** needs no CSS. Wrap it in a plain element or whatever is simplest. We do not care where on the webpage it is displayed. We just want this up and working.
4. The **gComponent** shows information about the **gPronto.Application.Prototype**. We get that information from a table. See the SQL file in each **gPronto.Application**.
5. All of this is done in **gPronto.Framework**, so it is called by both a **gPronto.Application.Prototype** and **gPronto.Application.Backstage**.
6. When the application starts, it already sends the parameter that tells **gPronto.Framework** which application type it is. When the application is **gPronto.Application.Backstage**, the **gComponent** shows nothing. When it is a **gPronto.Application.Prototype**, we pull the data from the table and display it in the **gComponent**. Again, no styling, nothing else.
7. Implement this the easiest way possible. No over-engineering. No elaborate verification. No navigation. We do not want anything clever or complex. We just want it to work.
8. When this issue is written, it is to be written in a structured way that shows exactly what will be added.
9. Remove everything else currently in this document, including anything about future work.

For now, display only the prototype id.

No Markdown document is updated by this issue.

## Status

Ready for implementation.

## Result

Every webpage of a **gPronto.Application.Prototype** displays its prototype id. Every webpage of **gPronto.Application.Backstage** displays nothing. No styling is added.

## Decisions

1. The **gComponent** name is `GComponentPrototypeInfo`.
2. The displayed information is the prototype id that the application sends to **gPronto.Framework** at startup. No database table is read.
3. The **gComponent** performs no database access and does not depend on Authentication status.
4. No CSS class token is assigned and no registered styling CSS file is changed.
5. Nothing is displayed when the application is **gPronto.Application.Backstage**.
6. No public property, no local-storage value, and no automated test is added.

## What will be added

### 1. Send the application type and prototype id to the framework

The two values already exist in every application environment file as `gPronto.Application:.env variable:[GPRONTO_PROTOTYPE_ID]` and `gPronto.Application:.env variable:[GPRONTO_APPLICATION_TYPE]`. They are not yet passed to **gPronto.Framework**.

Add one required `prototype` value, containing `PrototypeId` and `ApplicationType`, to the bootstrap request and the application definition:

- `gPronto.Framework:gPronto.Framework/gPronto.Framework.ApplicationRoot.BootstrapContract.ts`
- `gPronto.Framework:gPronto.Framework/gPronto.Framework.ApplicationRoot.ApplicationDefinitionContract.ts`

Validate it in `bootstrapGProntoFrameworkApplication` before the React root is created, and store it with `setGProntoFrameworkPrototypeConfiguration`:

- `gPronto.Framework:gPronto.Framework/gPronto.Framework.ApplicationRoot.BootstrapCreation.tsx`

`PrototypeId` **MUST** be a non-empty string. `ApplicationType` **MUST** be exactly `PROTOTYPE` or `BACKSTAGE`. Anything else throws.

Add the value to the entry point of every **gPronto.Application** and to the canonical asset:

- `gPronto.Application.Backstage:src/gPronto.Application.Bootstrap.EntryPoint.ts`
- `gPronto.Application.gPrototype2:src/gPronto.Application.Bootstrap.EntryPoint.ts`
- `gPronto.Application.gPrototype3:src/gPronto.Application.Bootstrap.EntryPoint.ts`
- `gPronto.Application.gPrototype4:src/gPronto.Application.Bootstrap.EntryPoint.ts`
- `gPronto.Framework:documentation/assets/gpronto.application/src/gPronto.Application.Bootstrap.EntryPoint.ts`

The added value is:

```ts
prototype: {
  PrototypeId: import.meta.env.GPRONTO_PROTOTYPE_ID,
  ApplicationType: import.meta.env.GPRONTO_APPLICATION_TYPE,
},
```

The Vite `envPrefix` already covers `GPRONTO_`, so no configuration changes.

### 2. Add the prototype store

Create one file:

- `gPronto.Framework:gPronto.Framework/gPronto.Framework.ApplicationRoot.PrototypeStore.ts`

It holds the validated bootstrap value in memory so that a **gComponent** can read it without a prop. It exports:

- the type `GProntoFrameworkPrototypeConfiguration`, containing `PrototypeId` and `ApplicationType`;
- `setGProntoFrameworkPrototypeConfiguration`, called once by the bootstrap;
- `getGProntoFrameworkPrototypeConfigurationSnapshot`;
- `subscribeToGProntoFrameworkPrototypeConfiguration`, following the existing snapshot-and-subscribe pattern already used by `gPronto.Framework:gPronto.Framework/gPronto.Framework.ApplicationRoot.PublicPropertiesStore.ts`.

The stored value never changes after the bootstrap sets it.

### 3. Add GComponentPrototypeInfo

Create one file:

- `gPronto.Framework:gPronto.Framework/gComponents/gComponent.PrototypeInfo/gComponent.PrototypeInfo.tsx`

It exports one runtime value named `GComponentPrototypeInfo` and declares no parameter, so it exports no props type.

It reads the stored configuration. When `ApplicationType` is not `PROTOTYPE` it returns `null`. Otherwise it returns one `footer` element containing the `PrototypeId` text and no attribute other than the element itself.

Add exactly one export line to:

- `gPronto.Framework:gPronto.Framework/gPronto.Framework.PublicApi.gComponentExports.ts`

### 4. Render it in every gLayout

Render `GComponentPrototypeInfo` once, as an additional **Fixed slot**, at the end of the returned JSX of each **gLayout**. Keep every existing **Fixed slot** and **Open slot** unchanged.

- `gPronto.Framework:gPronto.Framework/gLayouts/gLayout.CardsModern/gLayout.CardsModern.tsx`
- `gPronto.Framework:gPronto.Framework/gLayouts/gLayout.SingleColumn/gLayout.SingleColumn.tsx`
- `gPronto.Framework:gPronto.Framework/gLayouts/gLayout.TwoColumnNavigation/gLayout.TwoColumnNavigation.tsx`

## Verification

1. Run `npm run build` in all four **gPronto.Application** repositories and confirm every build passes.
2. Open one **gPronto.Application.Prototype** and confirm the prototype id is visible on a webpage of each of the three **gLayouts**.
3. Open **gPronto.Application.Backstage** and confirm no prototype information is visible.
