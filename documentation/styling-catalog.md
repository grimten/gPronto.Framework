# Styling catalog

## Status

Draft

## Scope

gPronto.Framework:The current registered styling catalog.
gPronto.Framework:Excludes styling structure, CSS, naming, and implementation requirements.

## Verification

Date: 2026-08-19

## Rules

<rule category="catalog" id="styling-catalog-current">

The catalog **MUST** contain every styling option currently registered by **gPronto.Framework** and **MUST NOT** contain an unregistered option.

Every identifier and source reference **MUST** match the current styling registry.

</rule>

<rule category="catalog" id="styling-catalog-overview">

This document **MUST** describe only the current styling inventory. It **MUST NOT** define how a styling option or its CSS is built.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-styling-catalog">

The **Agent** **MUST** validate this catalog against the current styling registry and registered CSS files. The **Agent** has approval to update only this document when a catalog entry is missing, extra, or stale.

</instructions>

## Stylings

| Identifier   | CSS source                                                                |
| ------------ | ------------------------------------------------------------------------- |
| `gStyling-1` | `gPronto.Framework:gPronto.Framework/gStylings/gStyling-1/gStyling-1.css` |
| `gStyling-2` | `gPronto.Framework:gPronto.Framework/gStylings/gStyling-2/gStyling-2.css` |

