# Application inventory

## Status

Draft

## Scope

gPronto.Application:The identity, type, path identifier, and prototype identifier of every current application.
gPronto.Framework:The identity, type, path identifier, URL, and visibility of every current repository.
gPronto.Application:The relationship between current prototypes and their hosted Backstage records.
gPronto.Application:Excludes deployments, Supabase projects, source structure, and application behavior.

## Verification

Date: 2026-08-18

## Rules

<rule category="applications" id="application-inventory-rows">

The `Applications` table **MUST** contain exactly one row for **gPronto.Application.Backstage**, exactly one row for every current **gPronto.Application.Prototype**, and no other rows.

A current **gPronto.Application.Prototype** is a row in `public.project_prototypes` in the hosted Backstage database whose `is_deleted` value is `false`.

Every Application Name and Path Identifier **MUST** be unique.

Every Prototype ID other than `-` **MUST** be unique.

</rule>

<rule category="applications" id="application-inventory-values">

The **gPronto.Application.Backstage** row **MUST** contain exactly these values:

- Application Name: `gBackstage`
- Path Identifier: `gPronto.Application.Backstage`
- Type: **gPronto.Application.Backstage**
- Prototype ID: `-`

For every current **gPronto.Application.Prototype**, the row values **MUST** satisfy all of these requirements:

- Application Name **MUST** equal the `name` value in its `public.project_prototypes` row.
- Path Identifier **MUST** be `gPronto.Application.[APPLICATION NAME]` with `[APPLICATION NAME]` replaced by its Application Name.
- Type **MUST** be **gPronto.Application.Prototype**.
- Prototype ID **MUST** equal the `id` value in its `public.project_prototypes` row.

</rule>

<rule category="repositories" id="repository-inventory-rows">

The `Repositories` table **MUST** contain exactly one row for **gPronto.Framework**, exactly one row for **gPronto.Services**, exactly one row for **gPronto.Tools**, exactly one row for every row in the `Applications` table, and no other rows.

The **gPronto.Framework** row **MUST** contain `N/A` as its Application Name, `gPronto.Framework` as its Path Identifier, and **gPronto.Framework** as its Type.

The **gPronto.Services** row **MUST** contain `N/A` as its Application Name, `gPronto.Services` as its Path Identifier, and **gPronto.Services** as its Type.

The **gPronto.Tools** row **MUST** contain `N/A` as its Application Name, `gPronto.Tools` as its Path Identifier, and **gPronto.Tools** as its Type.

Every application row **MUST** contain the same Application Name, Path Identifier, and Type as its row in the `Applications` table.

Every GitHub Repository and GitHub URL **MUST** be unique.

</rule>

<rule category="repositories" id="repository-inventory-values">

For every row in the `Repositories` table, GitHub Repository **MUST** equal the `owner/repository` identity of the repository's configured `origin`, and GitHub URL **MUST** be `https://github.com/[GITHUB REPOSITORY]` with `[GITHUB REPOSITORY]` replaced by that GitHub Repository value.

For every **gPronto.Application.Prototype**, GitHub URL **MUST** also equal the `repository_url` value in its `public.project_prototypes` row.

The **gPronto.Framework** row **MUST** contain `Public` as its Visibility.

Every other row **MUST** contain `Private` as its Visibility.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-application-inventory">

The **Agent** **MUST** validate these **Rules** against the current local repositories, current GitHub repository settings, and the hosted Backstage database:

- `application-inventory.md: rule:[application-inventory-rows]`
- `application-inventory.md: rule:[application-inventory-values]`
- `application-inventory.md: rule:[repository-inventory-rows]`
- `application-inventory.md: rule:[repository-inventory-values]`

The **Agent** **MUST** query the hosted Backstage `public.project_prototypes` table for every row whose `is_deleted` value is `false` and validate its `id`, `name`, and `repository_url` values.

The **Agent** **MUST** inspect the configured `origin` and current GitHub visibility of every repository listed in the `Repositories` table. The **Agent** **MUST NOT** use the existing inventory values as evidence that an inventory value is current.

If the hosted Backstage data, a listed repository's configured `origin`, or a listed repository's current GitHub visibility cannot be inspected, validation fails.

When a validation fails, the **Agent** **MUST** mark the text containing the failed requirement by applying `documentation.md: rule:[documentation-tag-requirements]`. The `agent-error-explanation` **MUST** identify every affected listed repository, inventory field, and reason for failure.

When every validation passes, the **Agent** **MUST** remove obsolete `agent-error` and `agent-error-explanation` tags and **MUST NOT** add a new validation-error tag.

</instructions>

## Applications

| Application Name | Path Identifier                   | Type                              | Prototype ID                                               |
| ---------------- | --------------------------------- | --------------------------------- | ---------------------------------------------------------- |
| gPrototype2      | `gPronto.Application.gPrototype2` | **gPronto.Application.Prototype** | `gPronto.Framework:.env variable:[GPRONTO_GPROTOTYPE2_ID]` |
| gPrototype3      | `gPronto.Application.gPrototype3` | **gPronto.Application.Prototype** | `gPronto.Framework:.env variable:[GPRONTO_GPROTOTYPE3_ID]` |
| gPrototype4      | `gPronto.Application.gPrototype4` | **gPronto.Application.Prototype** | `gPronto.Framework:.env variable:[GPRONTO_GPROTOTYPE4_ID]` |
| gBackstage       | `gPronto.Application.Backstage`   | **gPronto.Application.Backstage** | -                                                          |

## Repositories

| Application Name | Path Identifier                   | GitHub Repository                         | GitHub URL                                                                                                               | Visibility | Type                              |
| ---------------- | --------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------- | --------------------------------- |
| N/A              | `gPronto.Framework`               | `grimten/gPronto.Framework`               | [https://github.com/grimten/gPronto.Framework](https://github.com/grimten/gPronto.Framework)                             | Public     | **gPronto.Framework**             |
| N/A              | `gPronto.Services`                | `grimten/gPronto.Services`                | [https://github.com/grimten/gPronto.Services](https://github.com/grimten/gPronto.Services)                               | Private    | **gPronto.Services**              |
| N/A              | `gPronto.Tools`                   | `grimten/gPronto.Tools`                   | [https://github.com/grimten/gPronto.Tools](https://github.com/grimten/gPronto.Tools)                                     | Private    | **gPronto.Tools**                 |
| gPrototype2      | `gPronto.Application.gPrototype2` | `grimten/gPronto.Application.gPrototype2` | [https://github.com/grimten/gPronto.Application.gPrototype2](https://github.com/grimten/gPronto.Application.gPrototype2) | Private    | **gPronto.Application.Prototype** |
| gPrototype3      | `gPronto.Application.gPrototype3` | `grimten/gPronto.Application.gPrototype3` | [https://github.com/grimten/gPronto.Application.gPrototype3](https://github.com/grimten/gPronto.Application.gPrototype3) | Private    | **gPronto.Application.Prototype** |
| gPrototype4      | `gPronto.Application.gPrototype4` | `grimten/gPronto.Application.gPrototype4` | [https://github.com/grimten/gPronto.Application.gPrototype4](https://github.com/grimten/gPronto.Application.gPrototype4) | Private    | **gPronto.Application.Prototype** |
| gBackstage       | `gPronto.Application.Backstage`   | `grimten/gPronto.Application.gBackstage`  | [https://github.com/grimten/gPronto.Application.gBackstage](https://github.com/grimten/gPronto.Application.gBackstage)   | Private    | **gPronto.Application.Backstage** |

