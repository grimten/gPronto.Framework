# gComponent catalog

## Status

Draft

## Scope

gPronto.Framework:Public **gComponent** props types and no-props components.
gPronto.Framework:General-purpose public **gComponents** and their props.
gPronto.Framework:Input, textarea, and button component behavior.
gPronto.Framework:Authentication presentation-component props and defaults.
gPronto.Framework:PostgreSQL data-table resource behavior and saved settings.
gPronto.Framework:Navigation component behavior and props.
gPronto.Framework:Excludes the general source-structure requirements for creating a **gComponent**.

## Verification

Date: 2026-08-18

## Rules

<rule category="props">

Each **gComponent** described with props in this catalog **MUST** export a props type whose name equals the component name followed by `Props`. That props type **MUST** declare exactly the required and optional props listed for that **gComponent** in this catalog. Each **gComponent** listed in the public props types chapter as accepting no props **MUST NOT** export a props type.

</rule>

<rule category="inputs">

`GComponentInput` **MUST** render `error` as supporting text when `error !== undefined`. When `error === undefined`, it **MUST** render `helperText` when `helperText !== undefined` and **MUST NOT** render supporting text when `helperText === undefined`.

</rule>

<rule category="textarea">

When `GComponentInput` receives `kind: "textarea"` and a supplied `rows` value is not a positive integer, it **MUST** throw a `TypeError` before rendering with the message `GComponentInput rows must be a positive integer when kind is "textarea".`

</rule>

<rule category="button">

`GComponentButtonVariant` **MUST** contain exactly `"primary"`, `"primary-disabled"`, `"primary-loading"`, `"secondary"`, `"secondary-disabled"`, `"secondary-loading"`, `"danger"`, `"danger-disabled"`, and `"danger-loading"`.

`GComponentButton` **MUST** be disabled when `variant` ends with `-disabled` or `-loading`. It **MUST** render a loader instead of its resolved icon when `variant` ends with `-loading`.

When `icon` is omitted, `GComponentButton` **MUST** use `Save` for a primary variant, `MoreActions` for a secondary variant, and `Delete` for a danger variant. When `icon` is a `GComponentButtonIconName`, it **MUST** use the correspondingly named icon from the framework icon registry. When `icon` is `null`, it **MUST NOT** render an icon.

</rule>

<rule category="postgres-data-table">

`GComponentPostgresDataTable` **MUST** throw an `Error` during resource resolution when `resource` does not equal a registered resource identifier.

Its folder **MUST** be named `gPronto.Framework:gPronto.Framework/gComponents/gComponent.PostgresDataTable`, its source file **MUST** be named `gPronto.Framework:gPronto.Framework/gComponents/gComponent.PostgresDataTable/gComponent.PostgresDataTable.tsx`, and its props type **MUST** be named `GComponentPostgresDataTableProps`.

Every internal type, function, constant, and notification key whose name contains `GComponentDataTable` **MUST** use the equivalent `GComponentPostgresDataTable` name. Every CSS class beginning with `gcomponent-data-table` **MUST** instead begin with `gcomponent-postgres-data-table`. Both registered styling options **MUST** use only the `gcomponent-postgres-data-table` prefix for this **gComponent**.

It **MUST** obtain the selected resource's columns, labels, formatting, validation, defaults, write behavior, and table behavior from `meta.gPronto.postgresDataContractSchema`.

It **MUST** throw an `Error` during resource resolution when an allowed insert or update property has a configured input selector that is not defined by `gpostgresdatacontracts.md: variable:[configured-input-selector-mapping]`.

It **MUST** render each supported selector through `GComponentInput` using the `kind` defined by `gpostgresdatacontracts.md: variable:[configured-input-selector-mapping]` and **MUST NOT** require a public **gComponent**, public export, or source folder named by the selector.

The view frame **MUST** read the selected record and display every permitted property in PostgreSQL data-contract schema order using its configured label and display format.

The delete frame **MUST** require explicit confirmation before deleting the selected record. It **MUST** return to the table after success and **MUST** remain open after failure.

</rule>

<rule category="postgres-data-table-settings">

Every name in `defaults.visibleColumns` **MUST** identify a column whose `datatable.can_be_visible_in_table` value is not `false`. A name **MUST NOT** occur more than once.

When `defaults.sort` is an object, `defaults.sort.field` **MUST** identify a column whose `datatable.sortable` value is `true`.

An invalid default visible-column name **MUST** throw:

```text
The data-table default visible column "<column>" is not available for resource "<resource>".
```

A duplicated default visible-column name **MUST** throw:

```text
The data-table default visible column "<column>" is listed more than once for resource "<resource>".
```

An invalid default sort column **MUST** throw:

```text
The data-table default sort column "<column>" is not sortable for resource "<resource>".
```

`GComponentPostgresDataTable` **MUST** store saved settings only in `gPronto.Framework.PostgresDataTableSettings`.

When `gPronto.Framework.PostgresDataTableSettings` has no valid settings, the saved-settings repository **MUST** read a valid envelope from `gPronto.Framework.DataTableSettings`, convert every resource key from `<snake_name>_v<N>` to `postgres_<snake_name>_v<N>`, and write the converted envelope to `gPronto.Framework.PostgresDataTableSettings`.

The migration **MUST NOT** delete or modify `gPronto.Framework.DataTableSettings`. After the migration attempt, settings reads, writes, subscriptions, and storage-event handling **MUST** use only `gPronto.Framework.PostgresDataTableSettings`.

The saved-settings modules **MUST** be named `gPronto.Framework:gPronto.Framework/gPronto.Framework.PostgresDataResources.PostgresDataTableSettingsContract.ts`, `gPronto.Framework:gPronto.Framework/gPronto.Framework.PostgresDataResources.PostgresDataTableSettingsCodec.ts`, and `gPronto.Framework:gPronto.Framework/gPronto.Framework.PostgresDataResources.PostgresDataTableSettingsRepository.ts`.

The saved-settings types **MUST** be named `GProntoFrameworkPostgresDataTableSavedSort`, `GProntoFrameworkPostgresDataTableSavedResourceSettings`, and `GProntoFrameworkPostgresDataTableSettingsEnvelope`.

The saved-settings functions **MUST** be named `decodeGProntoFrameworkPostgresDataTableSettings`, `encodeGProntoFrameworkPostgresDataTableSettings`, `readGProntoFrameworkPostgresDataTableSavedSettings`, `writeGProntoFrameworkPostgresDataTableSavedSettings`, and `subscribeToGProntoFrameworkPostgresDataTableSavedSettings`.

The storage-key constant **MUST** be named `G_PRONTO_FRAMEWORK_POSTGRES_DATA_TABLE_SETTINGS_STORAGE_KEY`. The read- and write-failure notification keys **MUST** be `GComponentPostgresDataTable.Settings.ReadFailure` and `GComponentPostgresDataTable.Settings.WriteFailure`.

Every saved resource entry **MUST** contain exactly `visibleColumns` and `sort`. Action-column names **MUST NOT** be stored.

A complete resource entry **MUST** be written after column visibility or sorting changes.

A valid saved resource entry **MUST** take precedence over `defaults`. `defaults` **MUST** take precedence over the applicable **gPostgresDataContract** settings.

Malformed storage, an unsupported version or format, an invalid resource entry, an unknown column, a duplicated column, or a non-sortable sort column **MUST** cause that saved resource entry to be ignored.

A storage failure **MUST NOT** prevent the table from rendering. A read failure **MUST** create one deduplicated global error notification whose message is `The saved table settings could not be loaded.` A write failure **MUST** create one deduplicated global error notification whose message is `The table settings could not be saved.`

Saved settings **MUST NOT** be read or written when `User.AuthUserId` is empty or `"-"`.

</rule>

<rule category="navigation">

`GComponentNavigation` **MUST** render exactly one link for every registered route whose `kind` is `path`. The link text and target **MUST** equal that route's `path`. It **MUST NOT** render a link for a route whose `kind` is `not-found`.

`GComponentNavigationProps` **MUST** declare exactly one optional property: `orientation?: "vertical" | "horizontal"`. The default orientation **MUST** be `"vertical"`.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-gcomponent-catalog">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current public **gComponent** export barrel, implementations, and public property types. The **Agent** has approval to inspect those sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify the affected **gComponent**, export, property, or behavior. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Public props types

Every **gComponent** in this catalog that accepts props exports a public props type named by appending `Props` to the component name. For example, `GComponentButton` exports `GComponentButtonProps`.

Every **gComponent** defined by `authentication-interface.md: variable:[authentication-operation-gcomponents]` accepts no props and therefore exports no props type. The other **gComponents** that accept no props and therefore export no props type are:

- `GComponentFooter`
- `GComponentHeader`
- `GComponentNothing`

## General components

| **gComponent**         | Required props                                                            | Optional props and defaults                                                                                              |
| ---------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `GComponentAlert`      | `message: string`                                                         | `title?: string`, `color?: string`, `variant?: "filled"                                                                  | "light"                       | "outline"`with`light` |
| `GComponentBadge`      | `text: string`                                                            | `color?: string`, `variant?: "filled"                                                                                    | "light"                       | "outline"`with`light` |
| `GComponentButton`     | `variant: GComponentButtonVariant`, `text: string`, `onClick: () => void` | `icon?: GComponentButtonIconName` or `null`; omission uses the variant's default icon, `iconOnly?: boolean` with `false` |
| `GComponentFooter`     | None                                                                      | None                                                                                                                     |
| `GComponentFlow`       | `children: ReactNode`, `direction: "horizontal"                           | "vertical"`                                                                                                              | `gap?: "xs"                   | "sm"                  | "md" | "lg"                                                           | "xl"`with`md`; horizontal direction also accepts `justify?: "start" | "center" | "end" | "space-between"`with`start` |
| `GComponentHeader`     | None                                                                      | None                                                                                                                     |
| `GComponentLoader`     | None                                                                      | `size?: "xs"                                                                                                             | "sm"                          | "md"                  | "lg" | "xl"`with`md`, `color?: string`, `label?: string`with`Loading` |
| `GComponentNavigation` | None                                                                      | `orientation?: "vertical"                                                                                                | "horizontal"`with`"vertical"` |
| `GComponentNothing`    | None                                                                      | None                                                                                                                     |
| `GComponentTypography` | `text: string`                                                            | `variant?: "normal"                                                                                                      | "small"                       | "lead"                | "h1" | "h2"                                                           | "h3"                                                                | "h4"     | "h5"  | "h6"`with`normal`           |

`GComponentAlert` maps `red` to error, `green` to success, `yellow` and `orange` to warning, and every other color to info.

`GComponentBadge` maps `red` to error, `green` to success, `blue` to primary, and every other color to default.

`GComponentLoader` maps `red` to error, `green` to success, `blue` to info, and every other color to primary.

`GComponentButton` has primary, secondary, and danger families. Each family has enabled, disabled, and loading variants. Hover, active, and focus-visible presentation is automatic for each enabled variant.

When `iconOnly` is `true`, `GComponentButton` keeps `text` as its accessible name and button-click telemetry text, renders no visible label, centers the resolved icon or loading indicator, and uses a square whose width and minimum width equal `--gpronto-height-control-standard`.

`GComponentHeader` accepts no props. It reactively displays `Organisation.Name` and a horizontal `GComponentNavigation`. An unpopulated organisation name remains the framework default `"-"`.

`GComponentFooter` accepts no props. It reactively displays `Organisation.Name`, `User.FirstName`, `User.LastName`, `User.Email`, and `User.Role` with the labels Organisation, First name, Last name, Email, and Role. Every unpopulated value remains the framework default `"-"`.

`GComponentNothing` renders one hidden `span`.

## Input component

`GComponentInput` is the only public input **gComponent**. It exports exactly one public props type named `GComponentInputProps`.

`GComponentInputProps` is a discriminated union controlled by the required `kind` property.

Every union member has these common props:

| Required props  | Optional props        |
| --------------- | --------------------- |
| `label: string` | `name?: string`       |
|                 | `required?: boolean`  |
|                 | `disabled?: boolean`  |
|                 | `error?: string`      |
|                 | `helperText?: string` |
|                 | `onBlur?: () => void` |

Each `kind` adds exactly these props:

| `kind`        | Required props                                                                                                         | Optional props                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `"text"`      | `value: string`, `onChange: (value: string) => void`                                                                   | `placeholder?: string`, `controlRef?: Ref<HTMLInputElement>`                                   |
| `"email"`     | `value: string`, `onChange: (value: string) => void`                                                                   | `placeholder?: string`, `controlRef?: Ref<HTMLInputElement>`                                   |
| `"password"`  | `value: string`, `onChange: (value: string) => void`                                                                   | `placeholder?: string`, `controlRef?: Ref<HTMLInputElement>`                                   |
| `"search"`    | `value: string`, `onChange: (value: string) => void`                                                                   | `placeholder?: string`, `controlRef?: Ref<HTMLInputElement>`                                   |
| `"telephone"` | `value: string`, `onChange: (value: string) => void`                                                                   | `placeholder?: string`, `controlRef?: Ref<HTMLInputElement>`                                   |
| `"url"`       | `value: string`, `onChange: (value: string) => void`                                                                   | `placeholder?: string`, `controlRef?: Ref<HTMLInputElement>`                                   |
| `"color"`     | `value: string`, `onChange: (value: string) => void`                                                                   | `controlRef?: Ref<HTMLInputElement>`                                                           |
| `"date"`      | `value: string`, `onChange: (value: string) => void`                                                                   | `controlRef?: Ref<HTMLInputElement>`                                                           |
| `"date-time"` | `value: string`, `onChange: (value: string) => void`                                                                   | `controlRef?: Ref<HTMLInputElement>`                                                           |
| `"time"`      | `value: string`, `onChange: (value: string) => void`                                                                   | `controlRef?: Ref<HTMLInputElement>`                                                           |
| `"number"`    | `value: number \| null`, `onChange: (value: number \| null) => void`                                                   | `min?: number`, `max?: number`, `step?: number \| "any"`, `controlRef?: Ref<HTMLInputElement>` |
| `"range"`     | `value: number`, `onChange: (value: number) => void`, `min: number`, `max: number`                                     | `step?: number`, `controlRef?: Ref<HTMLInputElement>`                                          |
| `"file"`      | `onChange: (files: readonly File[]) => void`                                                                           | `accept?: string`, `multiple?: boolean`, `controlRef?: Ref<HTMLInputElement>`                  |
| `"select"`    | `value: string`, `onChange: (value: string) => void`, `options: readonly Readonly<{ value: string; label: string }>[]` | `controlRef?: Ref<HTMLSelectElement>`                                                          |
| `"textarea"`  | `value: string`, `onChange: (value: string) => void`                                                                   | `placeholder?: string`, `rows?: number`, `controlRef?: Ref<HTMLTextAreaElement>`               |
| `"checkbox"`  | `checked: boolean`, `onChange: (checked: boolean) => void`                                                             | `controlRef?: Ref<HTMLInputElement>`                                                           |
| `"radio"`     | `value: string`, `onChange: (value: string) => void`, `options: readonly Readonly<{ value: string; label: string }>[]` | None                                                                                           |

Each union member of `GComponentInputProps` **MUST** declare exactly `kind`, the common properties, and the properties listed for that `kind`.

When `error !== undefined`, `GComponentInput` **MUST** render `error` as supporting text. Otherwise, it **MUST** render `helperText` when `helperText !== undefined`, and **MUST NOT** render supporting text when both values are `undefined`.

An empty `"number"` input produces `null`. Any non-empty `"number"` input produces `Number(inputValue)`. A `"range"` input produces `Number(inputValue)`. A `"file"` input converts its `FileList` to `readonly File[]`.

When `kind` is `"textarea"` and `rows` is supplied, `rows` **MUST** be a positive integer. Any other value **MUST** throw a `TypeError` before rendering with this exact message:

```text
GComponentInput rows must be a positive integer when kind is "textarea".
```

## Authentication components

Every authentication **gComponent** defined by `authentication-interface.md: variable:[authentication-operation-gcomponents]` accepts no props.

The authentication helper **gComponents** have these props:

| **gComponent**                           | Required props                         | Optional props and defaults                                                                                                             |
| ---------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `GComponentAuthenticationCard`           | `title: string`, `children: ReactNode` | None                                                                                                                                    |
| `GComponentAuthenticationLoading`        | None                                   | `message?: string` with `Authentication is loading.`                                                                                    |
| `GComponentAuthenticationOperationError` | None                                   | `title?: string` with `Authentication failed`, `message?: string` with `The authentication operation could not be completed.`           |
| `GComponentAuthenticationResultMessage`  | None                                   | `title?: string` with `Authentication result`, `message?: string` with `The authentication operation has completed.`, `type?: "success" | "warning" | "info"`with`info` |

## PostgreSQL data table

`GComponentPostgresDataTable` accepts one required prop: `resource: string`.

A **gPronto.Application** passes an imported PostgreSQL resource identifier constant through that prop:

```tsx
<GComponentPostgresDataTable resource={PostgresUsers_v2} />
```

It accepts one optional prop:

```ts
defaults?: Readonly<{
  visibleColumns?: readonly string[];
  sort?:
    | Readonly<{
        field: string;
        order: "asc" | "desc";
      }>
    | null;
}>;
```

`visibleColumns` controls which permitted data columns are initially visible. Column order remains the **gPostgresDataContract** order. An empty array hides every data column but does not hide the View, Edit, and Delete action columns.

A `sort` object replaces the **gPostgresDataContract** default sort. `sort: null` starts without a sort. An omitted `sort` uses the **gPostgresDataContract** default sort or the identifier column ascending.

It resolves the resource from the framework data-resource registry. An unknown resource throws an error.

It reads the selected resource's PostgreSQL data-contract schema from `meta.gPronto.postgresDataContractSchema`.

The table frame uses 25-row server pagination. Its initial sort follows this precedence: saved settings, public defaults, then the applicable **gPostgresDataContract** settings. It does not allow row selection. It adds `View`, `Edit`, and `Delete` action columns and an `Insert` button. Each action column is 64 pixels wide and contains a centered icon-only button whose accessible name remains the column label.

`GComponentPostgresDataTable` automatically saves column visibility and sorting after either setting changes. It stores no row data, filters, pagination, column widths, column order, or action-column state.

Saved settings use the browser `localStorage` key:

```text
gPronto.Framework.PostgresDataTableSettings
```

When that key has no valid settings, the framework reads a valid envelope from the former `gPronto.Framework.DataTableSettings` key, prefixes each versioned resource key with `postgres_`, and writes the converted envelope under the new key. It does not delete or modify the former key. After that migration attempt, only the new key participates in settings reads, writes, subscriptions, and storage events.

The stored envelope has this logical shape:

```json
{
  "Version": 1,
  "Format": "PlainJson",
  "Payload": {
    "<AuthUserId>": {
      "<resource>": {
        "visibleColumns": ["column_name"],
        "sort": {
          "field": "column_name",
          "order": "asc"
        }
      }
    }
  }
}
```

`sort` may be `null`. Every saved resource entry contains both `visibleColumns` and `sort`.

Settings are scoped by browser origin, `User.AuthUserId`, and resource identifier. Tables for the same resource and signed-in **User** share saved settings. Settings are not read or written while `User.AuthUserId` is empty or `"-"`.

A valid saved resource entry replaces both public defaults. Public defaults replace the applicable **gPostgresDataContract** defaults. Missing or invalid saved settings fall back to public defaults.

Saved settings are browser-controlled preferences. They are not authoritative data and are not written to Supabase or another server.

The insert and edit frames render only fields explicitly allowed by their respective schema context.

Released **gPostgresDataContracts** retain the configured input selector values defined by `gpostgresdatacontracts.md: variable:[configured-input-selector-mapping]`. `GComponentPostgresDataTable` maps each selector to the `GComponentInput` kind defined by that variable.

These selector strings are compatibility data. They do not require corresponding public **gComponents**, public exports, or source folders.

An unsupported configured selector throws an error.

The view frame reads the selected record and displays every property whose `datatable.can_be_visible_in_table` value is not `false`. It preserves the PostgreSQL data-contract schema order and uses each property's configured label and display format.

The delete frame identifies the selected record and requires explicit confirmation before deletion. It returns to the table after successful deletion and remains open after failure.

## Navigation

`GComponentNavigation` accepts optional `orientation?: "vertical" | "horizontal"`, with `"vertical"` as the default. Vertical orientation renders the existing full-height navigation list. Horizontal orientation renders the same links as a wrapping horizontal navigation bar without the vertical right border or full-height requirement. It renders one link for every registered path route. It does not render a not-found route. Each link label and target are the route path.

