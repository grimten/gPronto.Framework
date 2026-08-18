# Supabase projects

## Status

Draft

## Scope

gPronto.Application:Hosted Supabase project identities, endpoints, platform settings, Postgres versions, and secret references.
gPronto.Application:Mapping of application browser environment variables to project URLs and publishable keys.
gPronto.Application:Allowed Authentication callback URLs for every current project and environment.
gPronto.Application:Excludes browser integration, CLI procedures, database access, naming, and Edge Function requirements.

## Verification

Date: 2026-08-18

## Rules

<rule category="supabase-project-inventory" id="supabase-project-values">

The `Supabase` table **MUST** contain exactly one row for every current **gPronto.Application**, no other rows, and the current hosted value for every project identifier, endpoint, platform setting, Postgres version, and secret-variable reference.

</rule>

<rule category="supabase-project-inventory" id="supabase-secret-references">

A secret cell **MUST** use `documentation.md: rule:[environment-variable-reference-format]`; a secret value **MUST NOT** appear in this document. `VITE_SUPABASE_URL` **MUST** equal URL, and `VITE_SUPABASE_PUBLISHABLE_KEY` **MUST** equal Publishable Key for the same application.

</rule>

<rule category="supabase-auth-callbacks" id="supabase-callback-values">

The `Supabase callback URLs` table **MUST** contain every callback URL allowed by each current hosted Supabase Auth project and **MUST NOT** contain an unallowed callback URL.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-supabase-projects">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the authenticated hosted Supabase projects and current application endpoints without exposing a secret. The **Agent** has approval to perform read-only hosted inspection and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** state the affected application, field, and current evidence. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Supabase

Cells shown as `gPronto.Framework:.env variable:[LIKE_THIS]` identify variables whose values live in `gPronto.Framework:.env`.

Note that: VITE_SUPABASE_URL is the same as URL in the table below. VITE_SUPABASE_PUBLISHABLE_KEY is the same as Publishable Key in the table below.

| Application Name | Organization id                                              | Project Name        | Project id                                                          | Project Dashboard                                                   | URL                                                          | Publishable Key                                                         | ANON                                                          | Region    | Size  | Pooler host                         | Database host                                                         | Postgres version | Password                                                          | Enable Data API | Automatically expose new tables | Enable automatic RLS | Email limit |
| ---------------- | ------------------------------------------------------------ | ------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------- | --------- | ----- | ----------------------------------- | --------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------- | --------------- | ------------------------------- | -------------------- | ----------- |
| gBackstage       | `gPronto.Framework:.env variable:[SUPABASE_ORGANIZATION_ID]` | supabase-backstage  | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_PROJECTREF]`  | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_PROJECTREF]`  | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_URL]`  | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_PUBLISHABLEKEY]`  | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_ANON]`  | eu-west-1 | Micro | aws-0-eu-west-1.pooler.supabase.com | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_DATABASEHOST]`  | 17.6.1.155       | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_PASSWORD]`  | Enabled         | Disabled                        | Enabled              | 100         |
| gPrototype2      | `gPronto.Framework:.env variable:[SUPABASE_ORGANIZATION_ID]` | supabase-prototype2 | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE2_PROJECTREF]` | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE2_PROJECTREF]` | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE2_URL]` | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE2_PUBLISHABLEKEY]` | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE2_ANON]` | eu-west-1 | Micro | aws-0-eu-west-1.pooler.supabase.com | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE2_DATABASEHOST]` | 17.6.1.155       | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE2_PASSWORD]` | Enabled         | Disabled                        | Enabled              | 100         |
| gPrototype3      | `gPronto.Framework:.env variable:[SUPABASE_ORGANIZATION_ID]` | supabase-prototype3 | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE3_PROJECTREF]` | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE3_PROJECTREF]` | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE3_URL]` | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE3_PUBLISHABLEKEY]` | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE3_ANON]` | eu-west-1 | Micro | aws-0-eu-west-1.pooler.supabase.com | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE3_DATABASEHOST]` | 17.6.1.155       | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE3_PASSWORD]` | Enabled         | Disabled                        | Enabled              | 100         |
| gPrototype4      | `gPronto.Framework:.env variable:[SUPABASE_ORGANIZATION_ID]` | supabase-prototype4 | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE4_PROJECTREF]` | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE4_PROJECTREF]` | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE4_URL]` | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE4_PUBLISHABLEKEY]` | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE4_ANON]` | eu-west-1 | Micro | aws-0-eu-west-1.pooler.supabase.com | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE4_DATABASEHOST]` | 17.6.1.155       | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE4_PASSWORD]` | Enabled         | Disabled                        | Enabled              | 100         |

## Supabase callback URLs

| Application Name | Environment          | URL                                                        |
| ---------------- | -------------------- | ---------------------------------------------------------- |
| gBackstage       | Production           | `https://grimten.com/authentication/callback`              |
| gBackstage       | Production secondary | `https://backstage-3oh.pages.dev/authentication/callback`  |
| gBackstage       | Stage                | `https://stage.grimten.com/authentication/callback`        |
| gBackstage       | Stage secondary      | `https://backstagestage.pages.dev/authentication/callback` |
| gBackstage       | Local development    | `http://localhost:5179/authentication/callback`            |
| gBackstage       | Local development    | `http://127.0.0.1:5179/authentication/callback`            |
| gBackstage       | Local preview        | `http://localhost:4179/authentication/callback`            |
| gBackstage       | Local preview        | `http://127.0.0.1:4179/authentication/callback`            |
| gPrototype2      | Production           | `https://proto2.grimten.com/authentication/callback`       |
| gPrototype2      | Production secondary | `https://proto2-81t.pages.dev/authentication/callback`     |
| gPrototype2      | Stage                | `https://stageproto2.grimten.com/authentication/callback`  |
| gPrototype2      | Stage secondary      | `https://stageproto2.pages.dev/authentication/callback`    |
| gPrototype2      | Local development    | `http://localhost:5176/authentication/callback`            |
| gPrototype2      | Local development    | `http://127.0.0.1:5176/authentication/callback`            |
| gPrototype2      | Local preview        | `http://localhost:4176/authentication/callback`            |
| gPrototype2      | Local preview        | `http://127.0.0.1:4176/authentication/callback`            |
| gPrototype3      | Production           | `https://proto3.grimten.com/authentication/callback`       |
| gPrototype3      | Production secondary | `https://proto3-1kx.pages.dev/authentication/callback`     |
| gPrototype3      | Stage                | `https://stageproto3.grimten.com/authentication/callback`  |
| gPrototype3      | Stage secondary      | `https://stageproto3.pages.dev/authentication/callback`    |
| gPrototype3      | Local development    | `http://localhost:5177/authentication/callback`            |
| gPrototype3      | Local development    | `http://127.0.0.1:5177/authentication/callback`            |
| gPrototype3      | Local preview        | `http://localhost:4177/authentication/callback`            |
| gPrototype3      | Local preview        | `http://127.0.0.1:4177/authentication/callback`            |
| gPrototype4      | Production           | `https://proto4.grimten.com/authentication/callback`       |
| gPrototype4      | Production secondary | `https://proto4.pages.dev/authentication/callback`         |
| gPrototype4      | Stage primary        | `https://stageproto4.grimten.com/authentication/callback`  |
| gPrototype4      | Stage secondary      | `https://stageproto4.pages.dev/authentication/callback`    |
| gPrototype4      | Local                | `http://localhost:5178/authentication/callback`            |
| gPrototype4      | Local                | `http://127.0.0.1:5178/authentication/callback`            |
| gPrototype4      | Local preview        | `http://localhost:4178/authentication/callback`            |
| gPrototype4      | Local preview        | `http://127.0.0.1:4178/authentication/callback`            |

