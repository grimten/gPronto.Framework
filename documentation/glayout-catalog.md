# gLayout catalog

## Status

Draft

## Scope

gPronto.Framework:The current public **gLayout** catalog.
gPronto.Framework:The purpose, public content inputs, and fixed **gComponents** of each current **gLayout**.
gPronto.Framework:Excludes **gLayout** construction, implementation, styling, and detailed behavior requirements.

## Verification

Date: 2026-08-19

## Rules

<rule category="catalog" id="glayout-catalog-current">

The catalog **MUST** contain every public **gLayout** currently exported by **gPronto.Framework** and **MUST NOT** contain another layout.

Every name, purpose, public content input, and fixed **gComponent** overview **MUST** match the current public source.

</rule>

<rule category="catalog" id="glayout-catalog-overview">

This document **MUST** describe only the current public **gLayout** inventory. It **MUST NOT** define how a **gLayout** is built, implemented, or styled.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-glayout-catalog">

The **Agent** **MUST** validate this catalog against the current public **gLayout** export barrel and layout source. The **Agent** has approval to update only this document when a catalog entry is missing, extra, or stale.

</instructions>

## Catalog

| **gLayout**                  | Purpose                                     | Public content inputs                    | Fixed **gComponents**                  |
| ---------------------------- | ------------------------------------------- | ---------------------------------------- | -------------------------------------- |
| `GLayoutCardsModern`         | Presents header, card, and footer sections. | `openSlotCardHeader`, `openSlotCardBody` | `GComponentHeader`, `GComponentFooter` |
| `GLayoutSingleColumn`        | Presents content in one column.             | `children`                               | None.                                  |
| `GLayoutTwoColumnNavigation` | Presents navigation beside page content.    | `content`                                | `GComponentNavigation`                 |

