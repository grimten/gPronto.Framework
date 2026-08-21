# Filenames

## Status

Draft

## Scope

gPronto.Framework:The naming pattern for files directly inside the framework source folder.
gPronto.Framework:Permitted source areas and subareas.
gPronto.Framework:Permitted filename suffixes and their meanings.
gPronto.Framework:Excludes filenames inside **gComponent**, **gLayout**, and **gPostgresDataContract** folders.

## Verification

Date: 2026-08-18

## Rules

<rule category="filenames">

Every filename **MUST** follow one grammar:

```text
gPronto.Framework:gPronto.Framework/gPronto.Framework.<Area>.<Purpose>.<ext>
gPronto.Framework:gPronto.Framework/gPronto.Framework.<Area>.<SubArea>.<Purpose>.<ext>
```

A file with a SubArea **MUST** be one member of a family, and the SubArea **MUST** state the family, so its Purpose **MAY** omit a suffix. A file without a SubArea **MUST** state its kind through the last word of its Purpose: a suffix from the Suffixes table.

The name of every file directly in `gPronto.Framework:gPronto.Framework` **MUST** be `gPronto.Framework:gPronto.Framework/gPronto.Framework.<Area>.<Purpose>.<ext>` or `gPronto.Framework:gPronto.Framework/gPronto.Framework.<Area>.<SubArea>.<Purpose>.<ext>`, where `<ext>` is `ts` or `tsx` — except one stylesheet named exactly `gPronto.Framework:gPronto.Framework/gPronto.Framework.Styles.css`.

`<Area>` **MUST** be a value in the Areas table.

`<SubArea>` **MUST** be a value in the SubAreas column of its `<Area>` row.

`<SubArea>` and `<Purpose>` **MUST** match `^([A-Z][a-z0-9]+)+$`, except the Purposes `gComponentExports` and `gLayoutExports` in the PublicApi area.

The `<Purpose>` of a file without a `<SubArea>` **MUST** end with a suffix from the Suffixes table.

A file whose `<Purpose>` ends with `Contract` **MUST NOT** export a runtime value.

A file whose exports are all types **MUST** have a `<Purpose>` ending with `Contract`.

A file **MUST** have the extension `tsx` if and only if it contains JSX.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-filenames">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against every current direct-child source filename in the documented framework source family. The **Agent** has approval to inspect those filenames and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify each nonconforming or undocumented filename. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## The pattern

Two examples:

- `gPronto.Framework:gPronto.Framework/gPronto.Framework.Supabase.BrowserClient.ts` — Area `Supabase`, Purpose `BrowserClient`;
- `gPronto.Framework:gPronto.Framework/gPronto.Framework.Authentication.Operations.SignIn.ts` — Area `Authentication`, SubArea `Operations`, Purpose `SignIn`.

## Areas

| Area                  | SubAreas                       | Meaning                                                                                                          |
| --------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| ApplicationRoot       | LocalStorage, PublicProperties | The shared root component, the application definition, and the public **User**, Organisation, and Session state. |
| Authentication        | Administration, Operations     | The Authentication runtime, its operations, state, and public interface.                                         |
| DataResources         | None                           | Generic data formatting, validation, and value-codec contracts and runtimes.                                     |
| Logs                  | None                           | The browser logging runtime.                                                                                     |
| PostgresDataResources | None                           | The PostgreSQL resource registry, resource-definition creation, resource contracts, and saved table settings.    |
| PublicApi             | None                           | The export barrels that form the public API.                                                                     |
| RegisteredWebpages    | None                           | Webpage definition contracts, registry, routing, and visibility.                                                 |
| Styles                | None                           | The framework stylesheet.                                                                                        |
| Supabase              | None                           | The Supabase browser client, configuration, and data provider.                                                   |
| UserEvents            | None                           | The **User**-event runtime that records page visits and button clicks.                                           |
| UserSessionHeartbeat  | None                           | The **User**-session heartbeat runtime.                                                                          |

## Suffixes

| Suffix          | Meaning                                                    |
| --------------- | ---------------------------------------------------------- |
| Client          | Creates or holds a third-party client instance.            |
| Codec           | Encodes and decodes one storage or wire format.            |
| Component       | A React component.                                         |
| Composition     | A React component that only assembles other components.    |
| Context         | A React context with its provider and hook.                |
| Contract        | Exported types only; no runtime value.                     |
| Control         | A React component that decides between rendering outcomes. |
| Creation        | A function that validates input and returns a new value.   |
| Defaults        | Default values and their factory functions.                |
| EntryPoint      | The single entry file of a runtime area.                   |
| Exports         | Re-export lines only; no declarations.                     |
| Interface       | A frozen runtime object exposed through the public API.    |
| Provider        | A Refine or React provider instance.                       |
| Registry        | A validated collection instance.                           |
| Repository      | Reads and writes browser or external storage.              |
| Runtime         | A consumer-counted process with start and stop.            |
| Store           | In-memory state with snapshot and subscribe.               |
| Synchronization | Keeps two states aligned.                                  |
| Url             | Builds one URL.                                            |
| Validation      | Validation functions.                                      |
