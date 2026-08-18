# Scripts

## Status

Draft

## Scope

gPronto.Tools:Current direct-child `.mjs` scripts in `gPronto.Tools:scripts`.
gPronto.Tools:Script log locations, names, and retention.
gPronto.Tools:Script settings files and settings coverage.
gPronto.Tools:Script environment-file ownership and usage.
gPronto.Tools:Excludes scripts outside `gPronto.Tools:scripts`, files in subfolders, application startup, automated-test behavior, and deployment procedures.

## Verification

Date: 2026-08-18

## Rules

<rule category="none">

Every current `.mjs` script directly within `gPronto.Tools:scripts` **MUST** be directly runnable through `node`.

</rule>

<rule category="none">

Every current `.mjs` script directly within `gPronto.Tools:scripts` **MUST** create a log file.

Every log file created by a current `.mjs` script directly within `gPronto.Tools:scripts` **MUST** be written to the root-level logs folder:

`gPronto.Tools:logs`

A current `.mjs` script directly within `gPronto.Tools:scripts` **MUST NOT** write a log file beneath `gPronto.Tools:scripts` or to another folder.

</rule>

<rule category="none">

When a current `.mjs` script directly within `gPronto.Tools:scripts` requires stored non-secret settings, those settings **MUST** be stored in the single shared settings file:

`gPronto.Tools:settings.json`

A current `.mjs` script directly within `gPronto.Tools:scripts` **MUST NOT** use another settings file.

### Environment file

The shared environment file for the current `.mjs` scripts directly within `gPronto.Tools:scripts` **MUST** be the root-level file:

`gPronto.Tools:.env`

`gPronto.Tools:scripts` **MUST NOT** contain a separate `gPronto.Tools:scripts/.env` file.

### Settings coverage

All settings for the current `.mjs` scripts directly within `gPronto.Tools:scripts` in the shared settings file **MUST** be stored beneath the top-level `scripts` node.

A helper script **MAY** receive settings through command-line arguments from the script that starts it and does not require its own node beneath the `scripts` node.

Each setting **MUST** belong to exactly one current `.mjs` script directly within `gPronto.Tools:scripts` and **MUST NOT** be shared by multiple scripts.

The `scripts` node **MUST NOT** contain a script node that does not have a corresponding current `.mjs` script directly within `gPronto.Tools:scripts`.

Every setting in a current `.mjs` script node **MUST** be read and used by its corresponding script directly within `gPronto.Tools:scripts`.

The shared settings file **MUST** contain every value that can reasonably be configured instead of hardcoded in a current `.mjs` script directly within `gPronto.Tools:scripts`.

This includes paths, repository and application lists, project identifiers, hostnames, URLs, domains, branch names, destinations, exclusions, timeouts, retry counts, and deployment targets when a current `.mjs` script directly within `gPronto.Tools:scripts` uses them as configurable information.

A current `.mjs` script directly within `gPronto.Tools:scripts` that reads stored non-secret settings **MUST** read those values from the shared settings file and **MUST NOT** define them as hardcoded configuration in its source.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-scripts">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against every current direct-child script, `gPronto.Tools:settings.json` node, and environment lookup. The **Agent** has approval to inspect and check those sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify every affected script, setting, or environment reference. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

