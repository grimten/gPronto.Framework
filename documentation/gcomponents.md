# gComponents

## Status

Draft

## Scope

gPronto.Framework:The definition and purpose of a **gComponent**.
gPronto.Framework:Source-folder, source-file, component, and props-type naming.
gPronto.Framework:Public export and application import requirements.
gPronto.Framework:Styling ownership and application-use restrictions.
gPronto.Framework:Framework replacements for common HTML controls.
gPronto.Framework:Excludes the props and behavior of individual **gComponents**.

## Verification

Date: 2026-08-18

## Rules

<rule category="common-html-control-replacements">

A **gComponent** **MUST NOT** display any button control other than `GComponentButton`, whether the button is rendered directly or by a third-party React component. The only exception is button controls rendered internally by MUI Data Grid inside `GComponentPostgresDataTable`: column-menu buttons, sorting icon buttons, filter-panel buttons, column-management controls, and pagination controls.

</rule>

<rule category="structure-and-naming">

Every **gComponent** **MUST** live in its own direct-child folder under `gPronto.Framework:gPronto.Framework/gComponents`.

Every **gComponent** folder name **MUST** match `^gComponent\.([A-Z][a-z0-9]+)+$`.

Every **gComponent** folder **MUST** contain exactly one file, named `gPronto.Framework:gPronto.Framework/gComponents/gComponent.<Name>/gComponent.<Name>.tsx`.

`gPronto.Framework:gPronto.Framework/gComponents/gComponent.<Name>/gComponent.<Name>.tsx` **MUST** export exactly one runtime value, named `GComponent<Name>`.

The exported `GComponent<Name>` function **MUST** declare zero or one parameter.

When the exported `GComponent<Name>` function declares one parameter, that parameter **MUST** have the type `GComponent<Name>Props`, and `gPronto.Framework:gPronto.Framework/gComponents/gComponent.<Name>/gComponent.<Name>.tsx` **MUST** export exactly one props type named `GComponent<Name>Props`, declared with `Readonly`.

When the exported `GComponent<Name>` function declares no parameter, `gPronto.Framework:gPronto.Framework/gComponents/gComponent.<Name>/gComponent.<Name>.tsx` **MUST NOT** export a type named `GComponent<Name>Props`.

Every type exported from `gPronto.Framework:gPronto.Framework/gComponents/gComponent.<Name>/gComponent.<Name>.tsx` **MUST** have a name that begins with `GComponent<Name>`.

A **gComponent** **MUST NOT** use a default export.

</rule>

<rule category="naming-the-name">

`<Name>` **MUST NOT** contain `gPronto`, `Framework`, or `Component`.

</rule>

<rule category="public-exposure">

Every **gComponent** **MUST** be exposed through exactly one export line in `gPronto.Framework:gPronto.Framework/gPronto.Framework.PublicApi.gComponentExports.ts`.

</rule>

<rule category="styling" id="framework-authored-styling-source">

Every **gComponent** **MUST** express every CSS declaration authored by **gPronto.Framework** through CSS classes defined in the registered styling CSS files.

A **gComponent** **MUST NOT**:

- use or pass a property named `style`, `sx`, `styles`, `styleOverrides`, or `css` at any nesting level;
- use `styled`, `createStyles`, a CSS tagged template, a theme override, or a `<style>` element;
- import a CSS file directly.

A **gComponent** **MAY** pass normal properties declared by the installed public type of an HTML, MUI, MUI X, or Refine component or configuration object. This permission includes properties such as `variant`, `color`, `size`, `direction`, `severity`, `rows`, and DataGrid column `width`.

Styling generated internally by HTML, MUI, MUI X, or Refine in response to an allowed property is not a CSS declaration authored by **gPronto.Framework**.

A **gComponent** **MAY** use `className`, `classes`, or `classNames` only to assign CSS class tokens that comply with the styling documentation.

</rule>

<rule category="use">

A **gPronto.Application** **MUST** import **gComponents** only from `@gpronto.framework`.

</rule>

<rule category="common-html-control-replacements">

**gPronto.Framework** **MUST** provide the replacement **gComponent** named in every row of the table in the chapter `Common HTML control replacements`.

</rule>

<rule category="common-html-control-replacements">

`GComponentButtonProps` **MUST** declare exactly these properties: required `variant: GComponentButtonVariant`, required `text: string`, required `onClick: () => void`, optional `icon?: GComponentButtonIconName | null`, and optional `iconOnly?: boolean`.

`GComponentButton` **MUST** pass `"submit"` to the underlying button control's `type` property. When the underlying button is activated, `GComponentButton` **MUST** prevent its native default action before it invokes `onClick`.

`iconOnly` **MUST** default to `false`. When it is `true`, `GComponentButton` **MUST** retain `text` as the accessible name and telemetry text, render only the resolved icon or loading indicator, and use a compact square control.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-gcomponents">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current **gComponent** source structure, naming, exports, imports, and application use. The **Agent** has approval to inspect those sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify every affected **gComponent** and file. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## What is a gComponent

A **gComponent** is a component created in **gPronto.Framework** and then used by the **gPronto.Application**.
A **gComponent** can consist of other **gComponents**.
A **gComponent** can consist of other React Components.

## Why have gComponents

We have **gComponents** so that we can limit the number of options the **gPronto.Applications** have.

Limiting the number of options enables rapid development of **gPronto.Application**.

## Names

`<Name>` is the **gComponent** folder name with the leading `gComponent.` removed. For the folder `gComponent.InputEmail`, `<Name>` is `InputEmail`.

A good `<Name>` describes what the **gComponent** does for the person using the webpage, never how it is built. The replacement **gComponents** in the table in the chapter `Common HTML control replacements` are a deliberate exception: they are named after the HTML control they replace.

## Common HTML control replacements

| HTML control                    | Replacement **gComponent** |
| ------------------------------- | -------------------------- |
| `<button>`                      | `GComponentButton`         |
| `<input type="text">`           | `GComponentInput`          |
| `<input type="email">`          | `GComponentInput`          |
| `<input type="password">`       | `GComponentInput`          |
| `<input type="number">`         | `GComponentInput`          |
| `<input type="tel">`            | `GComponentInput`          |
| `<input type="url">`            | `GComponentInput`          |
| `<input type="search">`         | `GComponentInput`          |
| `<input type="checkbox">`       | `GComponentInput`          |
| `<input type="radio">`          | `GComponentInput`          |
| `<input type="date">`           | `GComponentInput`          |
| `<input type="datetime-local">` | `GComponentInput`          |
| `<input type="time">`           | `GComponentInput`          |
| `<input type="file">`           | `GComponentInput`          |
| `<input type="range">`          | `GComponentInput`          |
| `<input type="color">`          | `GComponentInput`          |
| `<select>`                      | `GComponentInput`          |
| `<textarea>`                    | `GComponentInput`          |

