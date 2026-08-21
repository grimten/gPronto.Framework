# Automated test catalog

## Status

Draft

## Scope

gPronto.Tools:The current automated-test runtime, action, and journey catalog.
gPronto.Tools:Excludes test execution procedures and harness implementation requirements.

## Verification

Date: 2026-08-19

## Rules

<rule category="catalog" id="automated-test-catalog-current">

The catalog **MUST** contain every current automated-test runtime entry, supported journey action, and journey file, and **MUST NOT** contain an item that is not current.

</rule>

<rule category="catalog" id="automated-test-catalog-overview">

This document **MUST** describe only the current automated-test inventory. It **MUST NOT** define how the harness, an action, or a journey is built or executed.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-automated-test-catalog">

The **Agent** **MUST** validate this catalog against the current `gPronto.Tools:scripts/tests-*` sources, `gPronto.Tools:test-journeys`, `gPronto.Tools:test-dashboard`, and `gPronto.Tools:settings.json`. The **Agent** has approval to update only this document when a catalog entry is missing, extra, or stale.

</instructions>

## Runtime

| Item          | Current source or location                                   |
| ------------- | ------------------------------------------------------------ |
| Test launcher | `gPronto.Tools:scripts/tests-run.mjs`                        |
| Test pipeline | `gPronto.Tools:scripts/tests-main.ts`                        |
| Dashboard     | `gPronto.Tools:scripts/tests-dashboard.mjs`                  |
| Dashboard API | `gPronto.Tools:scripts/tests-server.mjs`                     |
| Configuration | `gPronto.Tools:scripts/tests-configuration.mjs`              |
| Settings      | `gPronto.Tools:settings.json` under `scripts.automatedTests` |
| Journeys      | `gPronto.Tools:test-journeys`                                |
| Dashboard UI  | `gPronto.Tools:test-dashboard`                               |
| Output        | `gPronto.Tools:logs`                                         |

## Actions

- `go-to-webpage`
- `click`
- `fill`
- `expect-text`
- `expect-signed-in`
- `expect-signed-out`
- `sign-in`
- `sign-out`
- `wait`

## Journeys

- `gPronto.Tools:test-journeys/detailed-usage-gbackstage.json`
- `gPronto.Tools:test-journeys/detailed-usage-gprototype2.json`
- `gPronto.Tools:test-journeys/detailed-usage-gprototype3.json`
- `gPronto.Tools:test-journeys/detailed-usage-gprototype4.json`

