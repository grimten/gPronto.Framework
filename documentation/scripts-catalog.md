# Scripts catalog

## Status

Draft

## Scope

gPronto.Tools:The purpose, prerequisites, effects, and invocation of every current direct-child script in `gPronto.Tools:scripts`.
gPronto.Tools:The supported command-line arguments of every current direct-child script in `gPronto.Tools:scripts`.
gPronto.Tools:Excludes script governance, shared-settings requirements, and log-retention requirements owned by `gPronto.Framework:documentation/scripts.md`.

## Verification

Date: 2026-08-18

## Rules

<rule category="catalog" id="scripts-catalog-coverage">

The catalog **MUST** contain exactly one entry for every `.mjs` file directly in `gPronto.Tools:scripts` and **MUST NOT** contain an entry for another file.

Each entry **MUST** identify the script by its repository-rooted file reference and **MUST** describe its purpose, prerequisites, effects, supported invocation, and supported command-line arguments.

</rule>

<rule category="execution" id="scripts-catalog-commands">

Every catalog command **MUST** be run from the **gPronto.Tools** repository root unless its entry explicitly states otherwise.

The catalog **MUST NOT** present an internal helper script as a directly operated script when another script owns and supplies its invocation.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-scripts-catalog">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against every current direct-child `.mjs` file in `gPronto.Tools:scripts`, the settings each script reads from `gPronto.Tools:settings.json`, and every command, file, service, or subprocess used by those scripts. The **Agent** has approval to inspect and syntax-check those sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify the affected script, setting, argument, prerequisite, effect, or command. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Catalog

Run every command in this catalog from:

`gPronto.Tools:.`

The scripts read their non-secret configuration from:

`gPronto.Tools:settings.json`

Scripts that require credentials or application environment values read them from:

`gPronto.Tools:.env`

### Browser session collector

`gPronto.Tools:scripts/browser-session-collector.mjs`

Purpose: This internal helper attaches to a Chromium DevTools endpoint and captures browser-session metadata, console messages, runtime errors, HTTP traffic in HAR format, failed requests, WebSocket activity, and collector diagnostics. It applies targeted redaction to known credential headers, token fields, password fields, and authentication query parameters.

Prerequisites: The local-application launcher supplies a running Chromium endpoint, managed profile paths, output paths, application identity, capture limits, and lifecycle files. The collector is not an independent interactive command.

Effects: The collector writes browser evidence beneath the configured browser-log run folder in `gPronto.Tools:logs`. It navigates the attached browser to the application URL and continues until the launcher requests shutdown or the DevTools connection fails.

How to run: Run the local-application launcher. It constructs and starts the collector with all required internal arguments.

```powershell
node ".\scripts\run-all-applications-locally.mjs"
```

Supported arguments: The collector requires the complete internal argument set supplied by the launcher. These arguments are an implementation contract between the two scripts and are not intended for manual use.

### Deploy applications to Cloudflare Pages

`gPronto.Tools:scripts/deploy-applications-to-cloudflarepages.mjs`

Purpose: This interactive script selects Production or Stage and one configured application or all configured applications. For every selected application, it records a repository snapshot, builds the application, uploads mapped environment values as Cloudflare Pages secrets, deploys the build output to the configured Pages project and branch, and lists the resulting deployments.

Prerequisites:

- Node.js and npm **MUST** be available.
- Dependencies **MUST** be installed in `gPronto.Tools:.` so the locally pinned Wrangler executable exists.
- Wrangler **MUST** be authenticated for the configured Cloudflare account and Pages projects.
- Every selected application repository and its installed build dependencies **MUST** be available at the locations configured in `gPronto.Tools:settings.json`.
- Every mapped application environment value **MUST** exist in `gPronto.Tools:.env`.

Effects: This script builds selected applications, overwrites the matching secrets in the selected Cloudflare Pages projects, and creates new Pages deployments. It writes its log beneath `gPronto.Tools:logs` and removes its temporary secret files after the run.

How to run:

```powershell
node ".\scripts\deploy-applications-to-cloudflarepages.mjs"
```

Supported arguments: None. The script prompts for the environment, deployment targets, and final confirmation. `--help` or `-h` prints its usage without deploying.

### Format all repositories

`gPronto.Tools:scripts/format-all-repositories.mjs`

Purpose: This script processes every repository configured in `gPronto.Tools:settings.json`. Its full mode runs the configured exact Prettier version and then normalizes spacing around supported documentation tags outside fenced code blocks. Its Markdown-tag-only mode skips Prettier.

Prerequisites: Node.js, npm, and npx **MUST** be available. Every configured repository, `gPronto.Tools:.prettierrc.json`, and `gPronto.Tools:.prettierignore` **MUST** exist. Full mode may require network access when npx does not already have the configured Prettier version.

Effects: Without `--check`, the script writes formatting changes to every configured repository. With `--check`, it reports differences and exits with code `1` when formatting changes are required. Full mode writes a log beneath `gPronto.Tools:logs`; Markdown-tag-only mode does not create a log.

Run the full formatter and write changes:

```powershell
node ".\scripts\format-all-repositories.mjs"
```

Check full formatting without writing changes:

```powershell
node ".\scripts\format-all-repositories.mjs" --check
```

Normalize only documentation-tag spacing:

```powershell
node ".\scripts\format-all-repositories.mjs" --markdown-tags-only
```

Check only documentation-tag spacing without writing changes:

```powershell
node ".\scripts\format-all-repositories.mjs" --markdown-tags-only --check
```

Supported arguments:

| Argument               | Effect                                                          |
| ---------------------- | --------------------------------------------------------------- |
| `--check` or `-Check`  | Checks formatting without writing changes.                      |
| `--markdown-tags-only` | Processes supported documentation-tag spacing without Prettier. |

### Run all applications locally

`gPronto.Tools:scripts/run-all-applications-locally.mjs`

Purpose: This interactive launcher runs selected applications in Development or Production Preview mode. It can install dependencies, builds the selected applications, starts one Vite server and one managed Chromium profile per application, and starts the browser-session collector for each profile.

Prerequisites:

- Node.js and npm **MUST** be available.
- The configured application repositories **MUST** exist.
- Every mapped application environment value **MUST** exist in `gPronto.Tools:.env`.
- A Chromium-compatible browser **MUST** be installed or its executable **MUST** be supplied through the `CHROMIUM_EXECUTABLE` process environment variable.
- Application dependencies **MUST** already be installed, or the npm-install prompt **MUST** be accepted. Accepting that prompt runs `npm ci` for every configured application, not only the selected applications.

Effects: The script builds selected applications, starts local Vite servers, opens isolated managed browser profiles beneath `gPronto.Tools:browserprofiles`, and writes server and browser evidence beneath `gPronto.Tools:logs`. Closing one managed Chromium window finalizes its capture and stops its corresponding Vite server.

Run and select the mode interactively:

```powershell
node ".\scripts\run-all-applications-locally.mjs"
```

Select Development mode before the interactive application prompt:

```powershell
node ".\scripts\run-all-applications-locally.mjs" --mode development
```

Select Production Preview mode before the interactive application prompt:

```powershell
node ".\scripts\run-all-applications-locally.mjs" --mode preview
```

Supported arguments:

| Argument             | Effect                                     |
| -------------------- | ------------------------------------------ |
| `--mode development` | Selects Development mode.                  |
| `--mode preview`     | Selects Production Preview mode.           |
| `-Mode development`  | PowerShell-style Development mode alias.   |
| `-Mode preview`      | PowerShell-style Production Preview alias. |
| `--help` or `-h`     | Prints usage and exits.                    |

### Set Supabase settings

`gPronto.Tools:scripts/set-supabase-settings.mjs`

Purpose: This script validates the configured Supabase projects, authentication URLs, email settings, SMTP settings, rate limit, and Edge Function secret mappings. In update mode, it pushes the generated Auth and SMTP configuration to every configured project, uploads mapped Edge Function secrets, and verifies that each expected secret name exists.

Prerequisites: Node.js and the Supabase CLI **MUST** be available. The required settings and secret values **MUST** exist in `gPronto.Tools:settings.json` and `gPronto.Tools:.env`. Update mode requires a stored interactive Supabase CLI login with access to every configured project.

Effects: Dry-run mode validates local configuration and reports intended project updates without changing a hosted project. Update mode changes Auth, SMTP, rate-limit, and Edge Function secret settings in every configured hosted Supabase project. Secret values are redacted from script output and its log beneath `gPronto.Tools:logs`.

Preview without changing hosted projects:

```powershell
node ".\scripts\set-supabase-settings.mjs" --dry-run
```

Apply and verify the configured settings:

```powershell
node ".\scripts\set-supabase-settings.mjs"
```

Supported arguments:

| Argument                               | Effect                                        |
| -------------------------------------- | --------------------------------------------- |
| `--dry-run`, `--what-if`, or `-WhatIf` | Validates and previews without remote writes. |
| `--help` or `-h`                       | Prints usage and exits.                       |

### Supabase authentication

`gPronto.Tools:scripts/supabase-auth.mjs`

Purpose: This interactive script resets the Supabase CLI login. It checks the CLI version, logs out the current CLI session, starts browser-based login, and verifies the new session by listing accessible projects as JSON.

Prerequisites: Node.js and the Supabase CLI **MUST** be available. The operator **MUST** be able to complete the browser login and the resulting account **MUST** have access to at least one Supabase project.

Effects: This script removes the current stored Supabase CLI login before creating and verifying a new one. It deliberately ignores token values inherited from the process environment. It replaces its prior log beneath `gPronto.Tools:logs`.

How to run:

```powershell
node ".\scripts\supabase-auth.mjs"
```

Supported arguments: None. `--help` or `-h` prints its usage without changing the CLI login.

### Supabase backup

`gPronto.Tools:scripts/supabase-backup.mjs`

Purpose: This script creates a maximum-coverage backup for every configured Supabase project or selected projects. It creates a custom-format database archive, readable schema SQL, roles and memberships without password hashes, a database inventory, deployed Edge Function sources, Edge Function secret metadata without secret values, Storage objects, per-project summaries, a run summary, and SHA-256 checksums.

Prerequisites:

- Node.js, `pg_dump`, `pg_dumpall`, `pg_restore`, and `psql` **MUST** be available in `PATH`.
- The Supabase CLI **MUST** be available and authenticated unless both Edge Functions and Storage are skipped.
- Every selected project's reference, database user, and database password **MUST** be available through the configured values in `gPronto.Tools:.env`.
- The operator **MUST** protect the backup output because database archives and downloaded Storage objects can contain sensitive data.

Effects: A backup run reads hosted database, Edge Function, secret-metadata, and Storage state. It writes timestamped backup data beneath `gPronto.Tools:scripts/supabase-backups` and detailed command logs beneath `gPronto.Tools:logs`. It exits with code `1` when any requested component is failed or partial.

Back up every configured project and component:

```powershell
node ".\scripts\supabase-backup.mjs"
```

Validate local configuration, required values, and command availability without creating a backup:

```powershell
node ".\scripts\supabase-backup.mjs" --validate-only
```

Back up selected configured projects:

```powershell
node ".\scripts\supabase-backup.mjs" --project backstage,proto2
```

Skip selected non-database components:

```powershell
node ".\scripts\supabase-backup.mjs" --skip-functions --skip-storage
```

Supported arguments:

| Argument                | Effect                                                      |
| ----------------------- | ----------------------------------------------------------- |
| `--project name[,name]` | Selects configured project labels; omission selects all.    |
| `--skip-functions`      | Skips Edge Function sources and secret metadata.            |
| `--skip-storage`        | Skips Storage-object downloads.                             |
| `--validate-only`       | Validates local inputs and tools without creating a backup. |
| `--help` or `-h`        | Prints usage and exits.                                     |

The configured project labels are `backstage`, `proto2`, `proto3`, and `proto4`.

