# Formats

## Status

Draft

## Scope

gPronto.Framework:The public value-formatting interface.
gPronto.Framework:The result contract for valid, nullish, incompatible, and invalid values.
gPronto.Framework:Excludes the current format inventory and user-specific formatting overrides.

## Verification

Date: 2026-08-19

## Rules

<rule category="public-interface" id="format-public-interface">

The public formatting function **MUST** be `GProntoFrameworkApplicationRootComponent.Format`.

The public format catalog **MUST** be `GProntoFrameworkApplicationRootComponent.Formats`.

</rule>

<rule category="result" id="format-result-contract">

A registered format applied to a compatible value **MUST** return a string.

A registered format applied to `null` or `undefined` **MUST** return the empty string.

An unregistered format, incompatible value, invalid date, invalid timestamp, or unserializable JSON value **MUST** return `undefined`.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-formats">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current public formatting interface and formatter implementation. The **Agent** has approval to add, update, or remove only validation-error tags in this document.

</instructions>

## Public interface

`GProntoFrameworkApplicationRootComponent.Format(value, format)` accepts an unknown value and one registered format key. It returns `string | undefined`.

`GProntoFrameworkApplicationRootComponent.Formats` exposes the immutable registered catalog described by [Format catalog](format-catalog.md).

## Result overview

| Input state                            | Result           |
| -------------------------------------- | ---------------- |
| Registered format and compatible value | Formatted string |
| Registered format and nullish value    | Empty string     |
| Unregistered or incompatible input     | `undefined`      |

