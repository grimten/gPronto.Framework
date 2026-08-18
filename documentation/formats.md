# Formats

## Status

Draft

## Scope

gPronto.Framework:The public value-formatting function and immutable format catalog.
gPronto.Framework:The formatter result contract for valid, nullish, and incompatible values.
gPronto.Framework:Output contracts for text, number, boolean, date, timestamp, UUID, JSONB, and array formats.
gPronto.Framework:Excludes database column schemas and user-specific formatting overrides.

## Verification

Date: 2026-08-18

## Rules

<rule category="public-interface">

The public formatting function **MUST** be `GProntoFrameworkApplicationRootComponent.Format`.

</rule>

<rule category="public-interface">

The public format catalog **MUST** be `GProntoFrameworkApplicationRootComponent.Formats`.

</rule>

<rule category="catalog">

The format catalog **MUST** contain exactly the format keys listed in the format catalog chapter.

</rule>

<rule category="catalog">

Every datatype node **MUST** contain exactly one `default` value, and that value **MUST** equal one key in that node's `options` object.

</rule>

<rule category="result">

A format key listed in the format catalog chapter applied to `null` or `undefined` **MUST** return the empty string.

</rule>

<rule category="result">

A format key not listed in the format catalog chapter **MUST** return `undefined`.

</rule>

<rule category="timestamp">

A timestamp format **MUST** return `undefined` unless the value is a `Date` whose `getTime()` result is not `NaN`, or a string for which `new Date(value).getTime()` is not `NaN`. A successful timestamp format **MUST** use the browser-local year, month, date, hours, minutes, and seconds.

</rule>

<rule category="date">

A string passed to a date format **MUST** match `yyyy-mm-dd` and **MUST** represent a real calendar date.

</rule>

<rule category="uuid">

A UUID format **MUST** return `undefined` for a non-string value and **MUST NOT** validate the contents of a string value.

</rule>

<rule category="number">

An integer format **MUST** return `undefined` unless `typeof value` is `number`, `Number.isFinite(value)` is `true`, and `Number.isInteger(value)` is `true`. A numeric format **MUST** return `undefined` unless `typeof value` is `number` and `Number.isFinite(value)` is `true`.

</rule>

<rule category="number">

`numeric.percent` **MUST NOT** multiply the value by 100. It **MUST** append ` %` to the plain numeric value.

</rule>

<rule category="text">

`text.as_is`, `text.email_link`, `text.url_link`, `extensions.citext.as_is`, `extensions.citext.email_link`, and `extensions.citext.url_link` **MUST** return the unchanged value when the value is a string and **MUST** return `undefined` when the value is not a string. These formats **MUST NOT** create an HTML element.

</rule>

<rule category="array">

`text[].comma` and `text[].lines` **MUST** return `undefined` unless `Array.isArray(value)` is `true` and `typeof item` is `string` for every item.

</rule>

<rule category="boolean">

`boolean.yes_no` and `boolean.true_false` **MUST** return `undefined` unless `typeof value` is `boolean`.

</rule>

<rule category="jsonb">

`jsonb.pretty` **MUST** return `JSON.stringify(value, undefined, 2)`. `jsonb.compact` **MUST** return `JSON.stringify(value)`. Each format **MUST** return `undefined` when its `JSON.stringify` call throws or returns `undefined`.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-formats">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current format registry, formatter implementations, public interface, and result contract. The **Agent** has approval to inspect and execute those formatters and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify the format, input, expected output, and current result. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Public interface

`GProntoFrameworkApplicationRootComponent.Format(value, format)` accepts an unknown value and one format key. It returns `string | undefined`.

`GProntoFrameworkApplicationRootComponent.Formats` is the immutable catalog of recognized format keys, grouped by PostgreSQL datatype. Every datatype node contains one `default` key and one immutable `options` object.

## Result contract

| Input state                                       | Result           |
| ------------------------------------------------- | ---------------- |
| Recognized format and compatible value            | Formatted string |
| Recognized format and `null` or `undefined` value | Empty string     |
| Unrecognized format                               | `undefined`      |
| Recognized format and incompatible value          | `undefined`      |
| Invalid date, timestamp, or JSON value            | `undefined`      |

## Format catalog

### uuid

Default: `uuid.as_is`

| Format           | Example result                         |
| ---------------- | -------------------------------------- |
| `uuid.as_is`     | `123e4567-e89b-12d3-a456-426614174000` |
| `uuid.short`     | `123e4567`                             |
| `uuid.no_dashes` | `123e4567e89b12d3a456426614174000`     |

### timestamp with time zone

Default: `timestamp with time zone.short`

| Format                           | Shape                 |
| -------------------------------- | --------------------- |
| `timestamp with time zone.short` | `yyyy-mm-dd hh:mm`    |
| `timestamp with time zone.long`  | `yyyy-mm-dd hh:mm:ss` |
| `timestamp with time zone.date`  | `yyyy-mm-dd`          |
| `timestamp with time zone.time`  | `hh:mm`               |

### date

Default: `date.short`

| Format       | Shape                                                 |
| ------------ | ----------------------------------------------------- |
| `date.short` | `yyyy-mm-dd`                                          |
| `date.long`  | `dddd, d mmmm yyyy` using English day and month names |

### boolean

Default: `boolean.yes_no`

| Format               | False   | True   |
| -------------------- | ------- | ------ |
| `boolean.yes_no`     | `No`    | `Yes`  |
| `boolean.true_false` | `False` | `True` |

### integer

Default: `integer.thousands`

| Format              | Example result for `1234` |
| ------------------- | ------------------------- |
| `integer.plain`     | `1234`                    |
| `integer.thousands` | `1,234`                   |
| `integer.european`  | `1.234`                   |

### numeric

Default: `numeric.thousands`

| Format                        | Example result for `1234.56` |
| ----------------------------- | ---------------------------- |
| `numeric.plain`               | `1234.56`                    |
| `numeric.thousands`           | `1,234.56`                   |
| `numeric.european`            | `1.234,56`                   |
| `numeric.decimals_0`          | `1,235`                      |
| `numeric.decimals_1`          | `1,234.6`                    |
| `numeric.decimals_2`          | `1,234.56`                   |
| `numeric.decimals_3`          | `1,234.560`                  |
| `numeric.european_decimals_0` | `1.235`                      |
| `numeric.european_decimals_1` | `1.234,6`                    |
| `numeric.european_decimals_2` | `1.234,56`                   |
| `numeric.european_decimals_3` | `1.234,560`                  |
| `numeric.percent`             | `1234.56 %`                  |

### text

Default: `text.as_is`

| Format               | Result                                                            |
| -------------------- | ----------------------------------------------------------------- |
| `text.as_is`         | Unchanged string                                                  |
| `text.truncated_10`  | First 10 Unicode characters, followed by `.` only when truncated  |
| `text.truncated_20`  | First 20 Unicode characters, followed by `.` only when truncated  |
| `text.truncated_50`  | First 50 Unicode characters, followed by `.` only when truncated  |
| `text.truncated_100` | First 100 Unicode characters, followed by `.` only when truncated |
| `text.email_link`    | Unchanged string                                                  |
| `text.url_link`      | Unchanged string                                                  |

### extensions.citext

Default: `extensions.citext.as_is`

| Format                            | Result                                                            |
| --------------------------------- | ----------------------------------------------------------------- |
| `extensions.citext.as_is`         | Unchanged string                                                  |
| `extensions.citext.truncated_10`  | First 10 Unicode characters, followed by `.` only when truncated  |
| `extensions.citext.truncated_20`  | First 20 Unicode characters, followed by `.` only when truncated  |
| `extensions.citext.truncated_50`  | First 50 Unicode characters, followed by `.` only when truncated  |
| `extensions.citext.truncated_100` | First 100 Unicode characters, followed by `.` only when truncated |
| `extensions.citext.email_link`    | Unchanged string                                                  |
| `extensions.citext.url_link`      | Unchanged string                                                  |

### jsonb

Default: `jsonb.pretty`

| Format          | Result                                          |
| --------------- | ----------------------------------------------- |
| `jsonb.pretty`  | `JSON.stringify` output with a two-space indent |
| `jsonb.compact` | Compact `JSON.stringify` output                 |

### text[]

Default: `text[].comma`

| Format         | Result for `["a", "b", "c"]`                     |
| -------------- | ------------------------------------------------ |
| `text[].comma` | `a, b, c`                                        |
| `text[].lines` | The three values separated by newline characters |

