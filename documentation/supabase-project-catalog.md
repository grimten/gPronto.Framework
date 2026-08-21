# Supabase project catalog

## Status

Draft

## Scope

gPronto.Application:The current hosted Supabase project catalog.
gPronto.Application:The current project identity, environment references, platform overview, and Authentication redirect coverage.
gPronto.Application:Excludes Supabase integration, database, and CLI requirements.

## Verification

Date: 2026-08-19

## Rules

<rule category="catalog" id="supabase-project-catalog-current">

The catalog **MUST** contain exactly one current hosted Supabase project for every current **gPronto.Application** and **MUST NOT** contain another project.

Every project identity, environment reference, platform value, and Authentication redirect summary **MUST** match the current hosted project and shared Supabase settings.

</rule>

<rule category="catalog" id="supabase-project-catalog-overview">

This document **MUST** describe only the current hosted-project inventory. It **MUST NOT** define how a project, database, Authentication flow, or application integration is built.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-supabase-project-catalog">

The **Agent** **MUST** validate this catalog against the authenticated hosted Supabase projects and `gPronto.Tools:settings.json` without exposing a secret. The **Agent** has approval to update only this document when a catalog entry is missing, extra, or stale.

</instructions>

## Projects

| Application | Project name        | Project reference                                                   | URL reference                                                | Region    | Size  | Postgres   | Site URL                     |
| ----------- | ------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------ | --------- | ----- | ---------- | ---------------------------- |
| gBackstage  | supabase-backstage  | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_PROJECTREF]`  | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_URL]`  | eu-west-1 | Micro | 17.6.1.155 | `https://grimten.com`        |
| gPrototype2 | supabase-prototype2 | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE2_PROJECTREF]` | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE2_URL]` | eu-west-1 | Micro | 17.6.1.155 | `https://proto2.grimten.com` |
| gPrototype3 | supabase-prototype3 | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE3_PROJECTREF]` | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE3_URL]` | eu-west-1 | Micro | 17.6.1.155 | `https://proto3.grimten.com` |
| gPrototype4 | supabase-prototype4 | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE4_PROJECTREF]` | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE4_URL]` | eu-west-1 | Micro | 17.6.1.155 | `https://proto4.grimten.com` |

## Authentication redirect coverage

Each project currently allows its production, production-secondary, stage, stage-secondary, local-development, and local-preview Authentication callback origins. The shared settings contain 12 redirect entries per project, including the primary hosted origins and their callback paths.

