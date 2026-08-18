# Data

## Status

Draft

## Scope

gPronto.Framework:Ownership of the shared PostgreSQL data layer and **gPostgresDataContract** catalog.
gPronto.Framework:Registration and session sharing of the Refine Supabase data provider.
gPronto.Framework:Versioned resource identifiers and their mapping to physical PostgreSQL tables.
gPronto.Framework:Computation of Refine resource definitions from passive **gPostgresDataContract** metadata.
gPronto.Framework:Registration and public exposure of PostgreSQL data resources.
gPronto.Framework:Source organization for generic and PostgreSQL-specific data artifacts.
gPronto.Framework:Current data-layer capabilities and explicit non-capabilities.
gPronto.Framework:Excludes database schemas, SQL migrations, and application webpages.

## Verification

Date: 2026-08-18

## Rules

<rule category="ownership">

**gPronto.Framework** **MUST** own:

- the Refine data-provider registration;
- the complete catalog of **gPostgresDataContracts**;
- every versioned identifier;
- the PostgreSQL data-contract schema of every **gPostgresDataContract** version;
- the computation of every Refine resource from an identifier and a PostgreSQL data-contract schema.

Every **gPronto.Application** **MUST** supply only its Supabase URL and publishable key to the data layer. An application **MUST NOT** create a Supabase client, configure a data provider, or select which **gPostgresDataContract** versions are registered.

</rule>

<rule category="refine-data-provider">

The official `@refinedev/supabase` adapter **MUST** be registered with Refine as both the default provider and the named `supabase` provider.

The adapter **MUST** receive the same singleton Supabase browser client used by Authentication. Refine data hooks **MUST** use the active application's authenticated Supabase session.

**gPronto.Framework** **MUST** set native Refine `meta.dataProviderName` to `supabase` on every registered resource.

</rule>

<rule category="names-and-identifiers">

Every **gPostgresDataContract** version **MUST** have two distinct names:

- `identifier` is the versioned contract name, such as `postgres_audit_events_v1`. It is the only one written in the **gPostgresDataContract** file;
- `name` is the physical PostgreSQL table name, such as `audit_events`. **gPronto.Framework** **MUST** compute it by removing the leading `postgres_` segment and the trailing `_v<N>` segment from the identifier.

Refine hooks and Refine query-cache keys **MUST** use the versioned identifier. The Supabase adapter **MUST** receive the physical name.

</rule>

<rule category="data-operation-interface">

A framework wrapper hook **MUST NOT** be added. `useList`, `useMany`, `useOne`, `useCreate`, `useUpdate`, `useDelete`, and the other native Refine data hooks **MUST** remain the data-operation interface.

</rule>

<rule category="resource-definition">

**gPronto.Framework** **MUST** compute the resource definition of every **gPostgresDataContract** version from its identifier and its PostgreSQL data-contract schema, producing Refine's native resource properties and framework-owned metadata:

```ts
{
  name: "organisations",
  identifier: "postgres_organisations_v1",
  meta: {
    label: "Organisations",
    dataProviderName: "supabase",
    schema: "public",
    idColumnName: "id",
    gPronto: {
      postgresDataContractSchema: {},
    },
  },
}
```

Each value **MUST** be computed according to `data.md: variable:[postgres-data-resource-computation]`.

`meta.schema` and `meta.idColumnName` are native metadata used by the official Supabase provider. `meta.gPronto` is framework-owned JSON-compatible metadata.

The resource-definition type **MUST** be `GProntoFrameworkPostgresDataResourceDefinition`. The creation function **MUST** be `defineGProntoFrameworkPostgresDataResource`. The registered resource array supplied to Refine **MUST** be `gProntoFrameworkPostgresDataResources`.

</rule>

<rule category="passive-metadata">

The PostgreSQL data-contract schema **MUST** remain passive. Refine and **gPronto.Framework** **MUST NOT** execute code stored in it or compile it into a runtime schema.

The database **MUST** remain the authoritative enforcement of data correctness. **gComponents** **MAY** read the PostgreSQL data-contract schema for columns, fields, labels, formatting, defaults, native control configuration, and framework-owned validators listed in `validation.validators`. Client-side validation **MUST NOT** be treated as database enforcement.

</rule>

<rule category="passive-metadata">

A record, create, or update type **MUST NOT** be derived from a PostgreSQL data-contract schema, and a **gPostgresDataContract** version **MUST NOT** publish one. A **gPronto.Application** receives untyped rows from the native Refine hooks.

</rule>

<rule category="catalog">

A **gPostgresDataContract** version that describes a table carrying `is_backstage_mirrored` **MUST** treat that synchronization flag as system-managed: its `insert.allowed` and its `update.allowed` **MUST** be `false`.

</rule>

<rule category="source-organization">

Every **gPostgresDataContract** version module **MUST** be held under:

`gPronto.Framework:gPronto.Framework/gPostgresDataContracts`

The PostgreSQL registry, resource-definition creation, resource contracts, and saved table settings **MUST** be held in the `PostgresDataResources` source area. Generic formatting, validation, and value-codec artifacts **MUST** remain in the `DataResources` source area.

The public identifiers **MUST** be exported through `gPronto.Framework:gPronto.Framework/gPronto.Framework.PublicApi.PostgresDataResourceExports.ts` and the framework public API entry point. A **gPronto.Application** **MUST** import them only from `@gpronto.framework`.

</rule>

<rule category="current-boundaries">

This data layer **MUST NOT** add resource routes, list pages, create pages, edit pages, show pages, live schema discovery, SQL changes, migrations, indexes, constraints, or RLS policies.

Refine **MUST** perform data operations, query caching, mutation invalidation, filtering, sorting, and pagination according to the selected provider.

</rule>

<rule category="current-boundaries">

A table or form **gComponent** **MUST** obtain every available column, field, label, format, write rule, and table behavior from the PostgreSQL data-contract schema of the selected resource.

`GComponentPostgresDataTable` **MAY** accept `defaults.visibleColumns` and `defaults.sort` as **gPronto.Application**-supplied initial preferences. A table or form **gComponent** **MUST NOT** accept any other column list, field list, column definition, field definition, or label from a **gPronto.Application**.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-data">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current PostgreSQL resource registry, Refine data-provider integration, public exports, and current application resource use. The **Agent** has approval to inspect those sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify the resource or provider contract and current evidence. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Ownership

The Supabase-specific browser and Data API responsibilities are documented in [Supabase](supabase.md).

## Refine data provider

## Names and identifiers

Public application code imports the identifier constant:

```ts
import { PostgresAuditEvents_v1 } from "@gpronto.framework";

useList({
  resource: PostgresAuditEvents_v1,
});
```

Versioned identifiers keep Refine query caching and invalidation separate. A mutation through `postgres_audit_events_v2` invalidates queries for that identifier without merging its cache with `postgres_audit_events_v1`.

## Resource definition

A **gPostgresDataContract** file contains no resource definition. **gPronto.Framework** computes one for every version from its two exports.

## Passive metadata

## Catalog

The catalog contains the following versions. How a version is numbered and how a **gPronto.Application** selects one are specified in [gPostgresDataContracts](gpostgresdatacontracts.md).

Nine physical tables have two versions, `_v1` matching the **gPronto.Application.Backstage** table shape and `_v2` matching the **gPronto.Application.Prototype** table shape:

- `audit_events`;
- `data_examples`;
- `email_templates`;
- `logs`;
- `organisations`;
- `settings`;
- `user_events`;
- `user_sessions`;
- `users`.

Each `_v2` version above adds the `is_backstage_mirrored` column, which the **gPronto.Application.Prototype** tables carry and the **gPronto.Application.Backstage** tables do not.

The following physical tables exist only in the **gPronto.Application.Backstage** database and have one version:

- `gatekeeper_sessions`;
- `project_prototype_audit_events`;
- `project_prototype_email_templates`;
- `project_prototype_logs`;
- `project_prototype_organisations`;
- `project_prototypes`;
- `project_prototype_settings`;
- `project_prototype_user_events`;
- `project_prototype_user_sessions`;
- `project_prototype_users`;
- `projects`;
- `project_tasks`;
- `project_user_access_grants`.

The catalog therefore contains 31 **gPostgresDataContract** versions covering 22 physical table names.

## Source organization

Shared provider, registry, resource-computation, and format-catalog source is held under:

`gPronto.Framework:gPronto.Framework`

## Current boundaries

## Variables

<variable id="postgres-data-resource-computation">

| Value                                     | Computation                                                                              |
| ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| `name`                                    | the identifier with its leading `postgres_` segment and trailing `_v<N>` segment removed |
| `identifier`                              | the identifier exported by the **gPostgresDataContract** file                            |
| `meta.label`                              | the PostgreSQL data-contract schema `title` followed by `s`                              |
| `meta.dataProviderName`                   | the constant `supabase`                                                                  |
| `meta.schema`                             | the constant `public`                                                                    |
| `meta.idColumnName`                       | the name of the PostgreSQL data-contract schema column whose `isIdColumn` is `true`      |
| `meta.gPronto.postgresDataContractSchema` | the PostgreSQL data-contract schema exported by the **gPostgresDataContract** file       |

</variable>

