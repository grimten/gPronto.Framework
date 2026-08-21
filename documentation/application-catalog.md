# Application catalog

## Status

Draft

## Scope

gPronto.Application:The current application catalog.
gPronto.Framework:The current repository catalog.
gPronto.Application:Excludes application construction, deployment, and behavior requirements.

## Verification

Date: 2026-08-19

## Rules

<rule category="catalog" id="application-catalog-current">

The catalog **MUST** contain every current **gPronto.Application** and every current gPronto repository, and **MUST NOT** contain an application or repository that is not current.

Every catalog value **MUST** match its authoritative hosted service or current repository.

</rule>

<rule category="catalog" id="application-catalog-overview">

This document **MUST** describe only the current application and repository inventory. It **MUST NOT** define how an application or repository is created, structured, or implemented.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-application-catalog">

The **Agent** **MUST** validate this catalog against the hosted Backstage prototype records, the current local repository set, and current GitHub repository settings. The **Agent** has approval to update only this document when a catalog entry is missing, extra, or stale.

</instructions>

## Applications

| Application Name | Path Identifier                   | Type                              | Prototype ID                                               |
| ---------------- | --------------------------------- | --------------------------------- | ---------------------------------------------------------- |
| gBackstage       | `gPronto.Application.Backstage`   | **gPronto.Application.Backstage** | -                                                          |
| gPrototype2      | `gPronto.Application.gPrototype2` | **gPronto.Application.Prototype** | `gPronto.Framework:.env variable:[GPRONTO_GPROTOTYPE2_ID]` |
| gPrototype3      | `gPronto.Application.gPrototype3` | **gPronto.Application.Prototype** | `gPronto.Framework:.env variable:[GPRONTO_GPROTOTYPE3_ID]` |
| gPrototype4      | `gPronto.Application.gPrototype4` | **gPronto.Application.Prototype** | `gPronto.Framework:.env variable:[GPRONTO_GPROTOTYPE4_ID]` |

## Repositories

| Application Name | Path Identifier                   | GitHub Repository                         | Visibility | Type                              |
| ---------------- | --------------------------------- | ----------------------------------------- | ---------- | --------------------------------- |
| N/A              | `gPronto.Framework`               | `grimten/gPronto.Framework`               | Public     | **gPronto.Framework**             |
| N/A              | `gPronto.Services`                | `grimten/gPronto.Services`                | Private    | **gPronto.Services**              |
| N/A              | `gPronto.Tools`                   | `grimten/gPronto.Tools`                   | Private    | **gPronto.Tools**                 |
| gBackstage       | `gPronto.Application.Backstage`   | `grimten/gPronto.Application.gBackstage`  | Private    | **gPronto.Application.Backstage** |
| gPrototype2      | `gPronto.Application.gPrototype2` | `grimten/gPronto.Application.gPrototype2` | Private    | **gPronto.Application.Prototype** |
| gPrototype3      | `gPronto.Application.gPrototype3` | `grimten/gPronto.Application.gPrototype3` | Private    | **gPronto.Application.Prototype** |
| gPrototype4      | `gPronto.Application.gPrototype4` | `grimten/gPronto.Application.gPrototype4` | Private    | **gPronto.Application.Prototype** |

