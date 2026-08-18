# gPostgresDataContracts

## Status

Draft

## Scope

gPronto.Framework:File structure, naming, exports, and version numbering for **gPostgresDataContracts**.
gPronto.Framework:The top-level PostgreSQL data-contract schema and its column entries.
gPronto.Framework:Column validation and array-item metadata.
gPronto.Framework:Insert and update permissions, defaults, selectors, and validators.
gPronto.Framework:Data-table visibility, sorting, filtering, formatting, and defaults.
gPronto.Framework:Format-key compatibility with the framework format catalog.
gPronto.Framework:Registry membership and public identifier exposure.
gPronto.Framework:Schema-version applicability and released-version immutability.
gPronto.Framework:Excludes data-provider registration, resource execution, and database enforcement.

## Verification

Date: 2026-08-18

## Rules

<rule category="structure-and-naming" id="one-file-per-version">

Every version of a **gPostgresDataContract** **MUST** live in exactly one file, directly under `gPronto.Framework:gPronto.Framework/gPostgresDataContracts`.

</rule>

<rule category="structure-and-naming" id="file-name">

The name of every file directly under `gPronto.Framework:gPronto.Framework/gPostgresDataContracts` **MUST** match `^gPostgresDataContract\.([A-Z][a-z0-9]+)+_v[1-9][0-9]*\.ts$`.

Every exported name in a **gPostgresDataContract** file **MUST** be derived from the file name `gPronto.Framework:gPronto.Framework/gPostgresDataContracts/gPostgresDataContract.<Name>_v<N>.ts`:

- `<Name>` is the part between `gPostgresDataContract.` and `_v<N>`;
- `<N>` is the version number;
- `<Singular>` is `<Name>` with its final `s` removed.

`<Name>` **MUST** end with `s`.

</rule>

<rule category="exports" id="two-exports">

Every **gPostgresDataContract** file **MUST** export exactly two names — `Postgres<Name>_v<N>` and `<Singular>PostgresDataContractSchema_v<N>` — and **MUST NOT** use a default export or an import declaration.

`Postgres<Name>_v<N>` **MUST** be a string constant whose value is `postgres_<snake_name>_v<N>`, where `<snake_name>` is `<Name>` with every uppercase letter that is not the first character replaced by `_` followed by its lowercase form, and the first character lowercased.

</rule>

<rule category="schema" id="described-source">

Every **gPostgresDataContract** **MUST** describe exactly one PostgreSQL table. A view **MUST NOT** be described by a **gPostgresDataContract**.

For each `<Name>`, the first **gPostgresDataContract** version **MUST** use `<N>` equal to `1`. Every later version **MUST** use `<N>` equal to the highest `<N>` already used for that `<Name>` plus `1`.

The keys of `<Singular>PostgresDataContractSchema_v<N>` **MUST** be exactly `gPostgresDataContract_Schema_Version`, `title`, `description`, `columns`, in that order.

`gPostgresDataContract_Schema_Version` **MUST** be `1`.

`title` **MUST** be a string containing at least one non-whitespace character.

Every `description` and every `short_description` **MUST** be `null` or a string containing at least one non-whitespace character.

</rule>

<rule category="columns" id="array-column-keys">

When `postgres_datatype` ends with `[]`, the keys of the column **MUST** be exactly `description`, `postgres_datatype`, `validation`, `items`, `insert`, `update`, `datatable`, `references`, `isIdColumn`, in that order.

</rule>

<rule category="columns" id="non-array-column-keys">

When `postgres_datatype` does not end with `[]`, the keys of the column **MUST** be exactly `description`, `postgres_datatype`, `validation`, `insert`, `update`, `datatable`, `references`, `isIdColumn`, in that order.

</rule>

<rule category="validation" id="validation-keys">

The keys of every column `validation` object **MUST** be exactly `allow_null`, `validate_enum`, `validate_regex`, `validate_string_min_length`, `validate_string_max_length`, `validate_number_min`, `validate_number_max`, `validate_number_precision`, `validate_number_scale`, in that order, optionally followed by `validators` as the only additional key.

When present, `validators` **MUST** be a readonly array whose items satisfy `GProntoFrameworkValidationDescriptor`.

`validate_enum` and `validate_regex` **MUST** be `null` unless `postgres_datatype` is `text` or `extensions.citext`. `validate_string_min_length` and `validate_string_max_length` **MUST** be `null` unless `postgres_datatype` is `uuid`, `text`, or `extensions.citext`. `validate_number_min`, `validate_number_max`, `validate_number_precision`, and `validate_number_scale` **MUST** be `null` unless `postgres_datatype` is `integer` or begins with `numeric`.

A column whose `postgres_datatype` is `uuid` **MUST** declare `validate_string_min_length: 36` and `validate_string_max_length: 36`.

A column whose `postgres_datatype` is `timestamp with time zone` or `date` **MUST** declare `validate_enum`, `validate_regex`, `validate_string_min_length`, `validate_string_max_length`, `validate_number_min`, `validate_number_max`, `validate_number_precision`, and `validate_number_scale` as `null`.

A column whose `postgres_datatype` is `boolean` **MUST** declare `validate_enum`, `validate_regex`, `validate_string_min_length`, `validate_string_max_length`, `validate_number_min`, `validate_number_max`, `validate_number_precision`, and `validate_number_scale` as `null`.

A column whose `postgres_datatype` is `integer` **MUST** declare `validate_number_min: -2147483648`, `validate_number_max: 2147483647`, and `null` for `validate_number_precision` and `validate_number_scale`.

A column whose `postgres_datatype` is `numeric(p,s)` **MUST** declare `validate_number_precision` equal to `p`.

A column whose `postgres_datatype` is `numeric(p,s)` **MUST** declare `validate_number_scale` equal to `s`.

A column whose `postgres_datatype` is `numeric(p,s)` **MUST** declare `validate_number_max` equal to `10^(p - s) - 10^(-s)`, where `^` means mathematical exponentiation.

A column whose `postgres_datatype` is `numeric(p,s)` **MUST** declare `validate_number_min` equal to `0 - validate_number_max`.

A column whose `postgres_datatype` is `text` or `extensions.citext` **MUST** declare `validate_string_min_length: 0` when `allow_null` is `true` and `validate_string_min_length: 1` when `allow_null` is `false`, and **MUST** declare a `validate_string_max_length` of exactly `255`, `320`, `2048`, or `65535`.

A non-null `validate_regex` **MUST** be exactly `^[^\s@]+@[^\s@]+\.[^\s@]+$` or exactly `^https?://.+$`. The first **MUST** pair with `validate_string_max_length: 320`; the second **MUST** pair with `validate_string_max_length: 2048`.

A column whose `postgres_datatype` is `jsonb` or ends with `[]` **MUST** declare `validate_enum`, `validate_regex`, `validate_string_min_length`, `validate_string_max_length`, `validate_number_min`, `validate_number_max`, `validate_number_precision`, and `validate_number_scale` as `null`.

Every `items` object **MUST** contain exactly one key, `validation`.

The keys of every `items.validation` object **MUST** be exactly `allow_null`, `validate_enum`, `validate_regex`, `validate_string_min_length`, `validate_string_max_length`, `validate_number_min`, `validate_number_max`, `validate_number_precision`, `validate_number_scale`, in that order.

An `items.validation` object **MUST NOT** contain `validators`.

</rule>

<rule category="write-contexts" id="context-keys">

The keys of every `insert` and every `update` object **MUST** be exactly `label`, `short_description`, `format`, `allowed`, `required`, `default`, `default_expression`, `gcomponent`, in that order.

Every `label` **MUST** be a string containing at least one non-whitespace character.

When `insert.required` is `true`, `insert.allowed` **MUST** be `true`.

`update.required` **MUST** be `false`.

At most one of `default` and `default_expression` **MUST** be non-null. A non-null `default_expression` **MUST** be a string containing at least one non-whitespace character.

When a block's `allowed` value is `false`, its `gcomponent` value **MUST** be `null`.

When a block's `allowed` value is `true`, its `gcomponent` value **MUST** be a string matching `^GComponent([A-Z][a-z0-9]+)+$`.

A non-null `gcomponent` value **MUST NOT** require a public **gComponent**, public export, or source folder with the same name.

</rule>

<rule category="datatable" id="datatable-keys">

The keys of every `datatable` object **MUST** be exactly `label`, `short_description`, `format`, `can_be_visible_in_table`, `default_visible_in_table`, `sortable`, `filterable`, `default_sort`, in that order.

When `default_visible_in_table` is `true`, `can_be_visible_in_table` **MUST** be `true`.

`default_sort` **MUST** be `null`, `"asc"`, or `"desc"`.

At most one column per PostgreSQL data-contract schema **MUST** have a non-null `default_sort`, and that column's `sortable` **MUST** be `true`.

</rule>

<rule category="formats" id="format-exists">

Every `format` value **MUST** be a key of the `options` of the catalog node whose key equals the column's `postgres_datatype` with a trailing parenthesized precision removed.

</rule>

<rule category="columns" id="id-column">

Exactly one column per PostgreSQL data-contract schema **MUST** have `isIdColumn: true`. That column **MUST** have `postgres_datatype: "uuid"`, `insert.allowed: false`, `update.allowed: false`, and `insert.default_expression: "gen_random_uuid()"`.

</rule>

<rule category="use" id="version-selection">

Any **gPronto.Application** **MAY** select any version.

</rule>

<rule category="registration" id="registry-entry">

Every version of a **gPostgresDataContract** **MUST** be registered exactly once with the **gPronto.Framework** registry.

The registry array **MUST** be named `gProntoFrameworkPostgresDataResources`. The resource-definition creation function **MUST** be named `defineGProntoFrameworkPostgresDataResource`.

The PostgreSQL contract types **MUST** be named `GProntoFrameworkPostgresDataContractSchemaColumn`, `GProntoFrameworkPostgresDataContractSchema`, and `GProntoFrameworkPostgresDataResourceDefinition`.

The registry, definition-creation, and contract modules **MUST** be named `gPronto.Framework:gPronto.Framework/gPronto.Framework.PostgresDataResources.Registry.ts`, `gPronto.Framework:gPronto.Framework/gPronto.Framework.PostgresDataResources.DefinitionCreation.ts`, and `gPronto.Framework:gPronto.Framework/gPronto.Framework.PostgresDataResources.Contract.ts`.

</rule>

<rule category="public-exposure" id="public-exports">

Every version of a **gPostgresDataContract** **MUST** be exposed through `gPronto.Framework:gPronto.Framework/gPronto.Framework.PublicApi.PostgresDataResourceExports.ts` with exactly one export of its identifier. The PostgreSQL data-contract schema **MUST NOT** be exported through any `gPronto.Framework:gPronto.Framework/gPronto.Framework.PublicApi.[PURPOSE].ts` file.

The former unprefixed identifier export name **MUST NOT** be exported. A compatibility alias for a former identifier name **MUST NOT** exist.

</rule>

<rule category="versions" id="schema-version-scope">

Every rule in this document applies to a **gPostgresDataContract** whose `gPostgresDataContract_Schema_Version` is `1`.

</rule>

<rule category="versions" id="release-immutability">

A version of a **gPostgresDataContract** is released when its file first exists on the `main` branch of the **gPronto.Framework** repository.

After release, neither exported value of a **gPostgresDataContract** **MUST** change. Any change to either exported value, including any nested key or value of the PostgreSQL data-contract schema, **MUST** be made in a new version in a new file.

As a one-time exception to the release-immutability rule, the 31 released PostgreSQL contract versions that used the former `gPronto.Framework:gPronto.Framework/gDataResources/gDataResource.<Name>_v<N>.ts` format **MAY** be renamed in place to the structure and names required by this document without incrementing `<N>`.

The exception permits only the coordinated folder name, filename, identifier export name, identifier string value, schema export name, schema-version property name, public export module, registry references, resource-definition references, and `meta.gPronto.postgresDataContractSchema` metadata name required by this document. Every other schema value and the described physical PostgreSQL table **MUST** remain unchanged.

After that coordinated rename, the release-immutability rule applies without exception to the renamed versions.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-gpostgresdatacontracts">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current versioned **gPostgresDataContract** files, schema, exports, validators, and consumers. The **Agent** has approval to inspect and execute those sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify the contract version, schema field, or consumer that fails. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## What is a gPostgresDataContract

A **gPostgresDataContract** is a versioned, immutable description, owned by **gPronto.Framework**, of one source of data that a **gPronto.Application** can read or write, and of how it may be read and written. Every **gPostgresDataContract** describes one PostgreSQL table.

A **gPostgresDataContract** file provides exactly two exports:

- the identifier: one exported string constant that **gPronto.Application** source passes to native Refine hooks;
- the PostgreSQL data-contract schema: one exported plain data object that fully describes the table.

Nothing else lives in the file: no imports, no resource definition, no TypeScript type derivation. The PostgreSQL data-contract schema is read at runtime as data.

**gPronto.Framework** computes everything else from the two exports. The registry builds the Refine resource for every version according to `data.md: variable:[postgres-data-resource-computation]`.

`meta.gPronto.postgresDataContractSchema` is where a **gComponent** reads the PostgreSQL data-contract schema at runtime.

## Versions and applications

`<N>` counts the changes to one **gPostgresDataContract**. Several versions can describe the same physical table, and every **gPronto.Application** chooses the version it wants by passing that version's identifier to a native Refine hook.

The connection between the chosen version and the database of the running **gPronto.Application** is loose, and nothing verifies it. When an application chooses a version whose columns its own table does not have, the operation fails at runtime.

The catalog currently holds two table shapes: the `_v1` versions match the **gPronto.Application.Backstage** tables and the `_v2` versions match the **gPronto.Application.Prototype** tables. [Data](data.md) lists every version.

## What is a PostgreSQL data-contract schema

A PostgreSQL data-contract schema is a self-describing data object with one entry per table column. It carries everything a webpage needs to show, edit, and tabulate the table's data — labels, formats, write rules, defaults, editors, and table behavior — so that a developer creating a webpage does not have to think: the schema file answers every question in one place.

Nothing executes a PostgreSQL data-contract schema. The database enforces the structural truth (types, `NOT NULL`, `numeric` precision); the **gComponents** may read the rest as configuration; a value that violates the passive description simply behaves as the database decides.

## The PostgreSQL data-contract schema top level

| Key                                    | What it is                                                                                                                                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gPostgresDataContract_Schema_Version` | The version of the PostgreSQL data-contract schema format itself, fixed at `1`. When the format changes shape, this number lets old and new schemas coexist and tells a checker which rule set applies. |
| `title`                                | The singular display name of the table, for example `Data example`. The resource `label` is this value followed by `s`.                                                                                 |
| `description`                          | Developer documentation for the table, or `null`.                                                                                                                                                       |
| `columns`                              | One entry per table column, keyed by the column name, in the table's column order.                                                                                                                      |

## The column

| Key                 | What it is                                                                                                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `description`       | Developer documentation for the column — for example trigger behavior — or `null`.                                                                                                                           |
| `postgres_datatype` | The exact data type text from the applicable initial SQL script. The single source of type truth: it determines the value type the browser receives, the applicable validators, and the format catalog node. |
| `validation`        | The passive constraints on a stored value. See the validation chapter.                                                                                                                                       |
| `items`             | Array columns only: the passive constraints on each array element. See the items chapter.                                                                                                                    |
| `insert`            | The insert context: how the column behaves in a create form. See the context chapter.                                                                                                                        |
| `update`            | The update context: how the column behaves in an edit form. See the context chapter.                                                                                                                         |
| `datatable`         | The table context: how the column behaves in a data table. See the datatable chapter.                                                                                                                        |
| `references`        | The foreign key the column holds, as `{ table, column }`, or `null` when the column references nothing.                                                                                                      |
| `isIdColumn`        | Exactly one column per PostgreSQL data-contract schema is `true`. It is the primary key and the source of the Refine `idColumnName`.                                                                         |

## The validation block

Every column `validation` block has the same nine required keys and may have one additional final `validators` key. Every `items.validation` block has exactly the nine required keys. A required key that does not apply to the column's type is the literal `null`, never omitted.

| Key                          | What it describes                                                                                        |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| `allow_null`                 | Whether the column accepts SQL `NULL`. Mirrors the absence of `NOT NULL` in the script.                  |
| `validate_enum`              | The closed list of allowed values, or `null`.                                                            |
| `validate_regex`             | The exact pattern a text value must match, or `null`.                                                    |
| `validate_string_min_length` | Minimum text length: `0` for nullable text, `1` for required text, `36` for `uuid`.                      |
| `validate_string_max_length` | Maximum text length: `36` for `uuid`; from the client profile `255`, `320`, `2048`, or `65535` for text. |
| `validate_number_min`        | Smallest allowed number, from the datatype's storage bounds.                                             |
| `validate_number_max`        | Largest allowed number, from the datatype's storage bounds.                                              |
| `validate_number_precision`  | The `p` of `numeric(p,s)`.                                                                               |
| `validate_number_scale`      | The `s` of `numeric(p,s)`.                                                                               |
| `validators`                 | Optional framework-owned single-value validation descriptors.                                            |

The block is passive. The database enforces `allow_null`, the numeric bounds, and the precision by itself; the text lengths, patterns, and enums are our client profile, which `GComponentInput` may apply as native control configuration, for example a `maxlength` attribute.

## The items block

An array column — `postgres_datatype` ending in `[]` — carries one `items` object holding a `validation` block of the same nine keys, describing each array element. A non-array column has no `items` key.

## The insert and update blocks

The two write contexts have the identical shape:

| Key                  | What it is                                                                                                                                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`              | The display name of the column in this context.                                                                                                                                                                   |
| `short_description`  | **User**-facing help text shown by the form field, or `null`.                                                                                                                                                     |
| `format`             | The format option applied when this context displays the value. See the formats chapter.                                                                                                                          |
| `allowed`            | Whether the context may write the column at all.                                                                                                                                                                  |
| `required`           | Insert: whether a create must supply the column. Update: always `false`; an update is a patch where nothing is mandatory.                                                                                         |
| `default`            | The column's literal database default (`false`, `"web"`, `{}`), or `null`.                                                                                                                                        |
| `default_expression` | The column's database default expression as text (`"gen_random_uuid()"`, `"now()"`), or `null`. In `update`, it documents a trigger-written value. At most one of `default` and `default_expression` is non-null. |
| `gcomponent`         | The immutable configured input selector used to select one `GComponentInput` kind, or `null` when `allowed` is `false`.                                                                                           |

Released **gPostgresDataContracts** retain the selector mapping defined by `gpostgresdatacontracts.md: variable:[configured-input-selector-mapping]`.

<variable id="configured-input-selector-mapping">

| Configured selector       | `GComponentInput` kind |
| ------------------------- | ---------------------- |
| `GComponentInputCheckbox` | `"checkbox"`           |
| `GComponentInputDate`     | `"date"`               |
| `GComponentInputDateTime` | `"date-time"`          |
| `GComponentInputEmail`    | `"email"`              |
| `GComponentInputNumber`   | `"number"`             |
| `GComponentInputText`     | `"text"`               |
| `GComponentInputTextarea` | `"textarea"`           |
| `GComponentInputUrl`      | `"url"`                |

</variable>

A configured selector is compatibility data. It does not require a public **gComponent**, public export, or source folder with the same name.

A `DEFAULT` clause in the initial SQL script is a literal when it is a constant with an optional cast — `false`, `1`, `'web'::text`, `'{}'::jsonb` — and it is recorded in `default` as the value with its quotes and cast removed: `false`, `1`, `"web"`, `{}`. Every other clause is an expression — it contains a function call or an operator, such as `gen_random_uuid()`, `now()`, `auth.uid()`, or `(now() + '30 days'::interval)` — and is recorded verbatim in `default_expression`.

The internal Insert and Edit forms in `GComponentPostgresDataTable` read the compatibility selector from `insert.gcomponent` or `update.gcomponent`, map that selector to one `GComponentInput` kind, and render `GComponentInput`. Both forms use only the applicable context's allowed fields and preserve the PostgreSQL data-contract schema column order, labels, required flags, and literal Insert defaults.

## The datatable block

| Key                        | What it is                                                                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `label`                    | The column header text.                                                                                                      |
| `short_description`        | **User**-facing help text shown by the header, or `null`.                                                                    |
| `format`                   | The format option applied to the cell value. See the formats chapter.                                                        |
| `can_be_visible_in_table`  | Whether the column may appear in a data table at all; `false` removes it from the column picker too.                         |
| `default_visible_in_table` | Whether the column is shown when the table first renders.                                                                    |
| `sortable`                 | Whether the person using the table can sort by the column.                                                                   |
| `filterable`               | Whether the person using the table can filter by the column.                                                                 |
| `default_sort`             | `"asc"` or `"desc"` on at most one column per PostgreSQL data-contract schema — the table's initial sort — otherwise `null`. |

The data table itself is one **gComponent** that reads the PostgreSQL data-contract schema and builds every column. It takes its headers from `label`, its column visibility from `can_be_visible_in_table` and `default_visible_in_table`, its sorting and filtering from `sortable`, `filterable`, and `default_sort`, and its column type from `postgres_datatype`.

Every data-table cell calls `formatGProntoFrameworkValue` with the raw row value and the column's `datatable.format` key, then renders the returned string directly. Date and timestamp sorting and filtering continue to use the Data Grid `Date` value produced by the column's value getter; display formatting does not replace that value.

## Formats

Every `format` value is a namespaced key such as `date.short` or `numeric.decimals_1`. The catalog of format options is hardcoded in **gPronto.Framework**, in the file

`gPronto.Framework:gPronto.Framework/gPronto.Framework.DataResources.TypeFormatDefaults.ts`

and exposed publicly as the frozen facade property `GProntoFrameworkApplicationRootComponent.Formats`, beside `User`, `Organisation`, and `Authentication`.

The catalog is keyed by Postgres datatype. A column's format options come from the node whose key equals the column's `postgres_datatype` with a trailing parenthesized precision removed, so `numeric(12,2)` reads the `numeric` node. Every node names its `default` option.

The catalog values describe the available options and identify one default per datatype. An explicitly selected `insert.format`, `update.format`, or `datatable.format` key is always the format to apply; the datatype default does not replace it.

`GProntoFrameworkApplicationRootComponent.Format(value, format)` and the internal `formatGProntoFrameworkValue(value, format)` reference the same shared string-formatting function. For a recognized key, `null` and `undefined` produce an empty string. An unrecognized key, an incompatible runtime value, or an invalid date or JSON value produces `undefined` without throwing. The function implements every option in the catalog: UUID transformation; local-time timestamp display; calendar-date display; boolean labels; fixed-separator integer and numeric display; Unicode-character text truncation; JSON serialization; and text-array joining.

Every format produces only a string or `undefined`. Email-link and URL-link formats produce text, not clickable links. `jsonb.pretty` and `text[].lines` produce strings containing newline characters; the formatter does not control how a consumer visually lays out those newline characters. The internal Insert and Edit forms in `GComponentPostgresDataTable` place component-native values in `GComponentInput` using the kind mapped from `insert.gcomponent` or `update.gcomponent`; ordinary editable values do not use the context format keys.

