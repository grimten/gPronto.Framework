# Format catalog

## Status

Draft

## Scope

gPronto.Framework:The current public format catalog.
gPronto.Framework:The default and available format keys for each supported datatype.
gPronto.Framework:Excludes formatter implementation and result requirements.

## Verification

Date: 2026-08-19

## Rules

<rule category="catalog" id="format-catalog-current">

The catalog **MUST** contain every datatype and format key currently registered by **gPronto.Framework**, and **MUST NOT** contain an unregistered datatype or format key.

Every listed default **MUST** match the current registered default.

</rule>

<rule category="catalog" id="format-catalog-overview">

This document **MUST** describe only the current format inventory. It **MUST NOT** define how a formatter is implemented or how a formatted value is rendered.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-format-catalog">

The **Agent** **MUST** validate this catalog against the current framework format registry. The **Agent** has approval to update only this document when a datatype, default, or format key is missing, extra, or stale.

</instructions>

## Formats

| Datatype                   | Default                          | Available format keys                                                                                                                                                                                                                                                                           |
| -------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uuid`                     | `uuid.as_is`                     | `uuid.as_is`, `uuid.short`, `uuid.no_dashes`                                                                                                                                                                                                                                                    |
| `timestamp with time zone` | `timestamp with time zone.short` | `timestamp with time zone.short`, `timestamp with time zone.long`, `timestamp with time zone.date`, `timestamp with time zone.time`                                                                                                                                                             |
| `date`                     | `date.short`                     | `date.short`, `date.long`                                                                                                                                                                                                                                                                       |
| `boolean`                  | `boolean.yes_no`                 | `boolean.yes_no`, `boolean.true_false`                                                                                                                                                                                                                                                          |
| `integer`                  | `integer.thousands`              | `integer.plain`, `integer.thousands`, `integer.european`                                                                                                                                                                                                                                        |
| `numeric`                  | `numeric.thousands`              | `numeric.plain`, `numeric.thousands`, `numeric.european`, `numeric.decimals_0`, `numeric.decimals_1`, `numeric.decimals_2`, `numeric.decimals_3`, `numeric.european_decimals_0`, `numeric.european_decimals_1`, `numeric.european_decimals_2`, `numeric.european_decimals_3`, `numeric.percent` |
| `text`                     | `text.as_is`                     | `text.as_is`, `text.truncated_10`, `text.truncated_20`, `text.truncated_50`, `text.truncated_100`, `text.email_link`, `text.url_link`                                                                                                                                                           |
| `extensions.citext`        | `extensions.citext.as_is`        | `extensions.citext.as_is`, `extensions.citext.truncated_10`, `extensions.citext.truncated_20`, `extensions.citext.truncated_50`, `extensions.citext.truncated_100`, `extensions.citext.email_link`, `extensions.citext.url_link`                                                                |
| `jsonb`                    | `jsonb.pretty`                   | `jsonb.pretty`, `jsonb.compact`                                                                                                                                                                                                                                                                 |
| `text[]`                   | `text[].comma`                   | `text[].comma`, `text[].lines`                                                                                                                                                                                                                                                                  |

