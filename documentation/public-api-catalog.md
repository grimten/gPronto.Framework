# Public API catalog

## Status

Draft

## Scope

gPronto.Framework:The current public API export-group catalog.
gPronto.Framework:Excludes implementation and behavior requirements for exported values and types.

## Verification

Date: 2026-08-19

## Rules

<rule category="catalog" id="public-api-catalog-current">

The catalog **MUST** contain every current public API export group and **MUST NOT** contain a group that is not exported by the public entry point.

Every entry point, export barrel, export count, and owning catalog reference **MUST** match the current public API source.

</rule>

<rule category="catalog" id="public-api-catalog-overview">

This document **MUST** describe only the current public API inventory. It **MUST NOT** define how an exported value or type is implemented or used.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-public-api-catalog">

The **Agent** **MUST** validate this catalog against `gPronto.Framework:gPronto.Framework/gPronto.Framework.PublicApi.EntryPoint.ts` and every export barrel it re-exports. The **Agent** has approval to update only this document when a catalog entry is missing, extra, or stale.

</instructions>

## Entry point

The package entry point is `@gpronto.framework`.

## Export groups

| Group                     | Current overview                                       | Detailed inventory                                                |
| ------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------- |
| Application root          | 2 runtime values and 21 public types                   | [Application root](application-root.md)                           |
| Registered webpages       | 1 runtime value and 7 public types                     | [Webpages](webpages.md)                                           |
| **gComponents**           | 28 public component values and their public prop types | [gComponent catalog](gcomponent-catalog.md)                       |
| **gLayouts**              | 3 public layout values and 3 public prop types         | [gLayout catalog](glayout-catalog.md)                             |
| PostgreSQL data resources | 31 public versioned identifiers                        | [gPostgresDataContract catalog](gpostgresdatacontract-catalog.md) |

