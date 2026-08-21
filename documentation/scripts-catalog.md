# Scripts catalog

## Status

Draft

## Scope

gPronto.Tools:The current direct-child script catalog.
gPronto.Tools:The purpose of each current direct-child script.
gPronto.Tools:Excludes script construction, implementation, configuration, and execution procedures.

## Verification

Date: 2026-08-19

## Rules

<rule category="catalog" id="scripts-catalog-current">

The catalog **MUST** contain every current `.mjs` script directly in `gPronto.Tools:scripts` and **MUST NOT** contain another file.

Every script name and purpose **MUST** match the current source.

</rule>

<rule category="catalog" id="scripts-catalog-overview">

This document **MUST** describe only the current script inventory. It **MUST NOT** define how a script is built, implemented, configured, or run.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-scripts-catalog">

The **Agent** **MUST** validate this catalog against every current `.mjs` script directly in `gPronto.Tools:scripts`. The **Agent** has approval to update only this document when a catalog entry is missing, extra, or stale.

</instructions>

## Catalog

| Script                                                             | Purpose                                                          |
| ------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `gPronto.Tools:scripts/browser-session-collector.mjs`              | Captures browser-session diagnostics for the local launcher.     |
| `gPronto.Tools:scripts/deploy-applications-to-cloudflarepages.mjs` | Builds and deploys selected applications to Cloudflare Pages.    |
| `gPronto.Tools:scripts/format-all-repositories.mjs`                | Formats the configured repositories.                             |
| `gPronto.Tools:scripts/run-all-applications-locally.mjs`           | Runs selected applications and managed browser sessions locally. |
| `gPronto.Tools:scripts/set-supabase-settings.mjs`                  | Validates and applies shared hosted Supabase settings.           |
| `gPronto.Tools:scripts/supabase-auth.mjs`                          | Re-establishes and verifies the Supabase CLI login.              |
| `gPronto.Tools:scripts/supabase-backup.mjs`                        | Backs up the configured hosted Supabase projects.                |
| `gPronto.Tools:scripts/tests-configuration.mjs`                    | Provides shared automated-test settings and environment access.  |
| `gPronto.Tools:scripts/tests-dashboard.mjs`                        | Opens and starts the automated-test dashboard.                   |
| `gPronto.Tools:scripts/tests-run.mjs`                              | Prepares dependencies and starts the automated-test pipeline.    |
| `gPronto.Tools:scripts/tests-server.mjs`                           | Serves the automated-test dashboard and run controls.            |
| `gPronto.Tools:scripts/validate-settings-and-environment.mjs`      | Checks shared settings and environment-reference coverage.       |

