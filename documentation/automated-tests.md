# Automated Tests

## Status

Draft

## Scope

gPronto.Tools:The shared browser-test harness location, vocabulary, and machine prerequisites.
gPronto.Tools:Test-run entry points, launcher chain, dashboard, execution pipeline, and exit codes.
gPronto.Tools:Test-run settings, application registry, environments, and test users.
gPronto.Tools:Journey files, step actions, element addressing, and randomized waits.
gPronto.Tools:Browser error collection, screenshots, traces, videos, and Supabase log collection.
gPronto.Tools:Run output, reports, result interpretation, and harness source files.
gPronto.Tools:Future automated-test work recorded in the harness roadmap.
gPronto.Tools:Excludes application implementation, deployment procedures, and framework unit tests.

## Verification

Date: 2026-08-18

## Rules

<rule category="test-harness-location" id="test-harness-location">

The automated-test harness **MUST** remain self-contained under `gPronto.Tools:automated-tests`, and application repositories **MUST NOT** contain the shared harness implementation.

</rule>

<rule category="test-actions" id="test-action-catalog">

The supported action names **MUST** be exactly `go-to-webpage`, `click`, `fill`, `expect-text`, `expect-signed-in`, `expect-signed-out`, `sign-in`, `sign-out`, and `wait`. A journey action **MUST** satisfy its documented input and runtime contract.

</rule>

<rule category="test-pipeline" id="test-pipeline-order">

Each test run **MUST** load and validate settings and journeys before browser execution, execute the selected journeys and applications, collect errors, write the documented run output, and produce the documented exit code. Validation failure **MUST** stop execution before a browser starts.

</rule>

<rule category="test-settings" id="test-settings-source">

Test Run settings, application definitions, journeys, test users, waits, and runtime limits **MUST** be read from the current settings and journey files described in this document; the harness **MUST NOT** invent missing values.

</rule>

<rule category="test-results" id="test-result-contract">

A successful run **MUST** exit with code `0`; a run with a validation, launch, journey, assertion, browser, or collection failure **MUST** exit nonzero. Each run **MUST** preserve the current report, error, and browser-log artifacts described in this document.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-automated-tests">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current `gPronto.Tools:automated-tests` source, settings, journeys, and a current validation run. The **Agent** has approval to inspect and run that harness and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify the source file, setting, action, or output that disproves it. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Overview

The end-to-end test harness is one self-contained pipeline that, with no user interaction, exercises every **gPronto.Application** that an included journey targets through realistic, concurrent browser journeys — collecting every error, log, and screenshot it can along the way.

The journeys run against the deployments already online in the selected environment. Building and deploying the applications is handled outside the harness.

The engine is the code that executes a test run. Everything that changes often lives in settings files, never in code: the run behavior, the applications, and the journeys with their steps. The engine therefore changes only when the harness itself is developed, never in daily test work.

The following chapters describe the engine, the settings files, how to build a journey, and the test users.

## Placement and self-containment

Everything is contained within one folder:

`gPronto.Tools:automated-tests`

the engine code (`gPronto.Tools:automated-tests/src`), the entry scripts, the dashboard, the Test Run settings, the applications file with its test users, and the journey files. Everything a run produces — logs, screenshots, traces, reports — is written into the root-level logs folder, one folder per run:

`gPronto.Tools:logs`

Outside these two places the harness reads exactly one thing: values from the repository environment file

`gPronto.Tools:.env`

The harness restates the application data it needs — environment URLs and the environment-variable names for Supabase project references — in its own applications file. This duplication is deliberate and buys isolation; the authoritative application inventory remains [Application inventory](application-inventory.md).

## Vocabulary

| Term              | Meaning                                                                                                                                                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Test run          | One complete unattended execution of the pipeline, from load to report                                                                                                                                                                 |
| Journey           | A browser scenario for one **gPronto.Application**, defined in its own file as one settings section and one ordered list of self-contained steps; the settings decide whether it is included in a test run and with how many instances |
| Journey instance  | One concurrent execution of one journey against its **gPronto.Application** in one browser context; the journey's settings decide whether it runs and with how many instances                                                          |
| Test user         | A Supabase Auth user held in the applications file; each journey instance signs in as the test user selected by its instance index                                                                                                     |
| Test Run settings | The settings file that defines the run-wide behavior                                                                                                                                                                                   |
| Applications file | The settings file that defines each **gPronto.Application**: name, Supabase project, environment URLs, and test users                                                                                                                  |

## Machine prerequisites

| Requirement                                                     | Why                                             |
| --------------------------------------------------------------- | ----------------------------------------------- |
| Node.js 22 or newer                                             | Every harness script is a Node.js `.mjs` script |
| `gPronto.Tools:.env variable:[SUPABASE_GBACKSTAGE_PROJECTREF]`  | Required when loading the application settings  |
| `gPronto.Tools:.env variable:[SUPABASE_GPROTOTYPE2_PROJECTREF]` | Required when loading the application settings  |
| `gPronto.Tools:.env variable:[SUPABASE_GPROTOTYPE3_PROJECTREF]` | Required when loading the application settings  |
| `gPronto.Tools:.env variable:[SUPABASE_GPROTOTYPE4_PROJECTREF]` | Required when loading the application settings  |
| `gPronto.Tools:.env variable:[SUPABASE_TOKEN]`                  | Optional: the end-of-run Supabase auth log pull |

A run requires the configured Supabase project-reference variables. A missing `gPronto.Tools:.env variable:[SUPABASE_TOKEN]` only skips the Supabase log pull.

The entry installs the harness dependencies and the Playwright Chromium browser when they are missing.

## Starting a test run

From the **gPronto.Tools** repository root, use one of these examples.

Windows PowerShell:

```powershell
Set-Location ".\automated-tests"
node ".\test-run.mjs"
```

Unix shell:

```sh
cd "./automated-tests"
node "./test-run.mjs"
```

The following command is an equivalent entry from the harness folder.

Windows PowerShell:

```powershell
npm run test-run
```

Unix shell:

```sh
npm run test-run
```

## The launcher chain

Behind the command, in order:

1. `gPronto.Tools:automated-tests/test-run.mjs` verifies npm, installs the harness dependencies when any is missing, and ensures the Playwright Chromium browser is installed.
2. It starts the pipeline.

The launcher runs the following pipeline command from the harness folder.

Windows PowerShell:

```powershell
npx tsx src/main.ts
```

Unix shell:

```sh
npx tsx src/main.ts
```

## The dashboard

The harness has a local dashboard that shows and controls the harness from a browser.

From the **gPronto.Tools** repository root, use one of these examples.

Windows PowerShell:

```powershell
Set-Location ".\automated-tests"
node ".\test-dashboard.mjs"
```

Unix shell:

```sh
cd "./automated-tests"
node "./test-dashboard.mjs"
```

The following command is an equivalent entry from the harness folder.

Windows PowerShell:

```powershell
npm run dashboard
```

Unix shell:

```sh
npm run dashboard
```

The dashboard runs at `http://127.0.0.1:8799` and answers only on the local machine.

The dashboard shows the run settings, the journeys, and the live output of a run it started.

The dashboard edits the settings and the journeys: it composes which journeys are included in the next test run, edits the run settings, and views and edits journey files. A journey's behavior and instance count are edited inside its journey file, on the journey's own page. Every change is loaded once with the engine; a change whose load crashes is rolled back and reported instead of kept. It starts a test run by starting `gPronto.Tools:automated-tests/test-run.mjs` and can stop a run it started itself. It adds no dependency.

Creating a journey is the creation of its journey file.

## The pipeline

A test run executes these stages in order. When a stage fails, the run stops immediately, reports the error, and exits with exit code 1; later stages do not run. A failing journey instance never stops other instances or the pipeline; it changes the exit code, not the flow. An unexpected error thrown outside the pipeline's own flow is written to the run log and does not stop the process, so a run always ends with a written report.

1. Load. Reads the Test Run settings, the applications file, and every journey file exactly as they are. Reads the optional `gPronto.Tools:.env variable:[SUPABASE_TOKEN]`, chooses the base seed, and writes the run header to the run log.
2. Journeys. Starts every included journey's instances. The instances are interleaved round-robin across the included journeys — one instance of each journey in turn, and a journey with fewer instances drops out of the rotation — so every journey, and therefore every **gPronto.Application** it targets, is exercised from the start of the run rather than one journey occupying every worker until its instances are consumed. Instances run concurrently up to the configured worker count, each in its own browser context at 1440 by 900, each with its own seeded random waits, screenshots, and error capture.
3. Report. Aggregates everything into the run report, pulls the newest 200 Supabase auth log rows of the run's time window for every project when `SUPABASE_TOKEN` is present (best effort; a failed pull is reported, never fatal), and exits.

The engine validates nothing and has no fallback values. A missing file, malformed JSON, or a wrong value crashes the run — or the journey instance — at the point where the value is used, with the raw error.

The journeys run against the deployments already online in the selected environment. Building and deploying the applications is handled outside the harness.

## Exit codes

| Code | Meaning                                                           |
| ---- | ----------------------------------------------------------------- |
| 0    | Every stage passed and every journey instance ended Passed        |
| 1    | A pipeline stage failed; the report names the stage               |
| 2    | Every stage passed but at least one journey instance ended Failed |

## Test Run settings

The Test Run settings file is

`gPronto.Tools:automated-tests/test-runs-settings.json`

It has a top-level `formatVersion` and the run block:

| Setting       | Meaning                                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| `environment` | Exactly `stage` or `production`; selects which entry of each application's `environments` the journeys use |
| `headless`    | `false` shows the browsers while the journeys run                                                          |
| `workers`     | How many journey instances run at the same time                                                            |
| `seed`        | The base seed every instance's timing derives from; `null` means a fresh random base seed per run          |

## Applications

The applications file is

`gPronto.Tools:automated-tests/applications.json`

Every journey names its application, and the name resolves against this file. It has a top-level `formatVersion` and one entry per **gPronto.Application**:

| Setting                                | Meaning                                                                             |
| -------------------------------------- | ----------------------------------------------------------------------------------- |
| `name`                                 | The application name used in journeys, logs, reports, and the registry              |
| `supabaseProjectRefEnvironmentKeyName` | The name of the framework `.env` variable containing the Supabase project reference |
| `environments`                         | One `url` for `stage` and one for `production`                                      |
| `testUsers`                            | The application's test users: `email` and `password` pairs                          |

## Building a journey

Each journey is one file named `gPronto.Tools:automated-tests/<journey-name>.json` directly in the harness folder, beside the settings files. The file name is the journey's name. A journey can not use a reserved file name: `test-runs-settings`, `applications`, `package`, `package-lock`, or `tsconfig`.

A journey has exactly two sections: `settings` and `steps`. `settings` names the journey's **gPronto.Application** and defines how its instances run. `steps` is the ordered list the run walks, one step at a time; each step carries every browser detail it needs — path, element roles and names, values, and expected conditions. Nothing about a journey lives anywhere else.

```json
{
  "settings": {
    "application": "gPrototype2",
    "included": true,
    "instances": 50,
    "video": false
  },
  "steps": [
    {
      "description": "Sign in with the test user and wait until the browser storage shows the signed-in user.",
      "action": "sign-in",
      "path": "/authentication/sign-in",
      "emailField": { "role": "textbox", "name": "Email" },
      "passwordField": { "role": "textbox", "name": "Password" },
      "submitButton": { "role": "button", "name": "Sign in" },
      "screenshot": true,
      "waitSeconds": { "start": 0, "stop": 4 }
    },
    {
      "description": "Open the home webpage.",
      "action": "go-to-webpage",
      "path": "/",
      "screenshot": true,
      "waitSeconds": { "start": 0, "stop": 4 }
    },
    {
      "description": "Open the users webpage by clicking its navigation link.",
      "action": "click",
      "role": "link",
      "name": "/users",
      "title": "Users",
      "screenshot": true,
      "waitSeconds": { "start": 0, "stop": 4 }
    },
    {
      "description": "Pause for about 1 minute.",
      "action": "wait",
      "screenshot": false,
      "waitSeconds": { "start": 50, "stop": 70 }
    }
  ]
}
```

A new journey is created by adding its `gPronto.Tools:automated-tests/<journey-name>.json` file in the harness folder; the dashboard opens each journey's page for viewing and editing.

### Journey settings

Every journey file carries one complete `settings` object. Nothing fills in defaults: the values in the file are the values the run uses. A new journey can start from these values:

| Setting       | Starting value | Meaning                                              |
| ------------- | -------------- | ---------------------------------------------------- |
| `application` | —              | The name of one configured **gPronto.Application**   |
| `included`    | `false`        | `true` includes this journey in the next test run    |
| `instances`   | `1`            | How many instances of this journey a test run starts |
| `video`       | `false`        | `true` records a video per instance of this journey  |

### Step vocabulary

Every `action` in a journey file is one of the following. Every browser detail a step needs — path, selectors, values, expected conditions — comes from the step itself, never from code or another section. Every expected-condition wait uses Playwright's default timeout. The list is complete: adding an action is an engine change and updates this document first. A step with an action outside this list crashes its instance when the step executes.

Every step can also carry three keys beyond its action's own:

- `description` — free text that explains the step to the reader; the engine ignores it;
- `screenshot` — `true` takes one numbered screenshot after the step's work is done, for a navigation step after the webpage has loaded; a failed step always gets a failure screenshot;
- `waitSeconds` — an object with `start` and `stop` in seconds; after the work and the screenshot, the instance pauses a random time in that range, drawn from its seeded generator.

The order inside a step is always: work, screenshot, wait.

| Action              | Step keys                                             | What it does                                                                                                                                                                                                                                                             |
| ------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `go-to-webpage`     | `path`, `title` (optional), `text` (optional)         | Navigates to the path, waits for the load event, asserts the document title exactly when `title` is present, and asserts the text is visible when `text` is present                                                                                                      |
| `click`             | `role`, `name`, `title` (optional), `text` (optional) | Clicks the element with that role and name, asserts the document title exactly when `title` is present, and asserts the text is visible when `text` is present                                                                                                           |
| `fill`              | `role`, `name`, `value`                               | Fills the value into the element with that role and name                                                                                                                                                                                                                 |
| `expect-text`       | `text`                                                | Without navigating, waits until the text is visible                                                                                                                                                                                                                      |
| `expect-signed-in`  | —                                                     | Without navigating, waits until the framework localStorage envelope holds the instance's test user                                                                                                                                                                       |
| `expect-signed-out` | —                                                     | Without navigating, waits until the framework localStorage envelope shows no signed-in user                                                                                                                                                                              |
| `sign-in`           | `path`, `emailField`, `passwordField`, `submitButton` | Opens the path, fills the instance's test user's email and password into the email and password fields, clicks the submit button, waits for the Supabase sign-in request to answer 200, then waits until the framework localStorage envelope holds the test user's email |
| `sign-out`          | `path`, `submitButton`                                | Opens the path, clicks the sign-out button, and waits until the framework localStorage envelope returns to the signed-out state                                                                                                                                          |
| `wait`              | —                                                     | Does nothing itself; the step's `waitSeconds` provides the pause                                                                                                                                                                                                         |

Every step addresses an element by its ARIA role and its accessible name — the name a screen reader announces, which for a button is its visible text, for an input its label, and for a data table column header the column title. `click` and `fill` carry `role` and `name` directly; `sign-in` and `sign-out` carry one object per element, each with a `role` and a `name`:

```json
"emailField": { "role": "textbox", "name": "Email" }
```

There is no other way to address an element. A CSS selector, an element id, and a position are all absent by design, because a class or an index can shift to a different element and act on it silently, while a role and name that no longer exist fail the step and are reported. The name is matched exactly, and a role and name that match more than one element fail the step rather than choosing one.

An element with no accessible name cannot be reached by a journey. That is deliberate: such an element is unreachable by a screen reader too, so it is an accessibility gap in **gPronto.Framework** rather than a gap in the harness.

The framework localStorage envelope is the key `gPronto.Framework.LocalStorage`, where **gPronto.Framework** keeps the signed-in user's identity. The authentication steps read it instead of matching text on the page, so a wording change can never break them.

## Test users

Every test user lives in the applications file, inside its application's `testUsers` array:

```json
{
  "name": "gBackstage",
  "testUsers": [
    {
      "email": "larssoncj+20260807153821201@gmail.com",
      "password": "..."
    }
  ]
}
```

A test user belongs to exactly one application. The test users are existing Supabase Auth users, created by earlier versions of the harness through each application's real sign-up flow; the engine does not create users. A journey instance signs in as one of its application's test users: instance `N` uses the test user at position `(N - 1)` modulo the count, so concurrent instances use distinct users while the pool is large enough. The assigned test user appears in the run log's Starting line and in the report. The applications file is tracked in git; the logs folder and `node_modules` are gitignored.

The repair tool probes every test user against its Supabase project and reports, or with `--apply` removes, the ones that cannot sign in. From the **gPronto.Tools** repository root, run one of these commands.

Windows PowerShell:

```powershell
node ".\automated-tests\repair-test-user-registry.mjs"
```

Unix shell:

```sh
node "./automated-tests/repair-test-user-registry.mjs"
```

## Random waits

Every instance draws its pauses from a seeded random generator: after each step's work and screenshot, the instance pauses a random time inside that step's `waitSeconds` range.

The base seed is chosen at run start — `run.seed` when set, otherwise random — and printed in the run log and the report. Each instance derives its own seed from the base seed and its instance name, and the instance seeds appear in the report. Setting `seed` in the Test Run settings reproduces the exact timing of a previous run: a race condition found by randomness is replayable.

## Error collection

Per journey instance, from browser start to browser close, the engine collects:

1. every console error and warning;
2. every uncaught page error;
3. every failed network request (aborted requests excepted) and every response with status 400 or higher, with the step during which it happened — this inherently captures every Supabase error the application triggers;
4. a numbered screenshot after every step whose `screenshot` is `true`, and always a screenshot on a failed step;
5. a Playwright trace, saved as `trace.zip` only when the instance fails;
6. a video of the instance when the journey's `video` setting is on.

Collected errors are reported. An instance fails when a step fails.

## Run output

Each test run writes to its own folder, named with the run timestamp, under

`gPronto.Tools:logs`

| Artifact                                                                           | Content                                                                                                                                          |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `run.log`                                                                          | The pipeline narrative: every stage, decision, and instance start and end                                                                        |
| `gPronto.Tools:logs/<run>/instances/<application>-<journey>-<two-digit instance>/` | That instance's step log, screenshots, trace on failure, and video when enabled                                                                  |
| `gPronto.Tools:logs/<run>/supabase-auth-logs.json`                                 | The pulled auth log rows per project, when pulled                                                                                                |
| `gPronto.Tools:logs/<run>/report.json`, `gPronto.Tools:logs/<run>/report.md`       | The aggregated result: stage outcomes, every instance's outcome, seed, and test user, every collected error, log pull results, and the exit code |

## Reading the results

Start with `gPronto.Tools:logs/<run>/report.md` in the run's folder under the logs folder, then `gPronto.Tools:logs/<run>/run.log` for the narrative. For a failed instance, open its folder under `gPronto.Tools:logs/<run>/instances`: `gPronto.Tools:logs/<run>/instances/<instance>/steps.log`, the numbered screenshots, and `gPronto.Tools:logs/<run>/instances/<instance>/trace.zip`.

Open a trace with one of these examples.

Windows PowerShell:

```powershell
npx playwright show-trace <path-to-trace.zip>
```

Unix shell:

```sh
npx playwright show-trace <path-to-trace.zip>
```

## Source files

Every harness file lives in

`gPronto.Tools:automated-tests`

| File                                                          | Responsibility                                                                                                               |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `gPronto.Tools:automated-tests/test-run.mjs`                  | The test run entry: verifies npm, installs dependencies and the Playwright Chromium browser, starts the pipeline             |
| `gPronto.Tools:automated-tests/test-dashboard.mjs`            | The dashboard entry: opens the browser and starts the server                                                                 |
| `gPronto.Tools:automated-tests/server.mjs`                    | The dashboard server: reads settings, applications, journeys, and runs; writes settings and journeys; starts and stops runs  |
| `gPronto.Tools:automated-tests/dashboard.html`                | The dashboard page                                                                                                           |
| `gPronto.Tools:automated-tests/journey.html`                  | The journey page: one journey's definition, opened from the dashboard's journey list                                         |
| `gPronto.Tools:automated-tests/repair-test-user-registry.mjs` | Probes every test user in the applications file against its Supabase project; `--apply` removes the ones that cannot sign in |
| `gPronto.Tools:automated-tests/package.json`                  | The harness dependencies and the `test-run`, `dashboard`, and `check` scripts                                                |
| `gPronto.Tools:automated-tests/package-lock.json`             | The locked dependency versions the entry installs                                                                            |
| `gPronto.Tools:automated-tests/tsconfig.json`                 | The configuration for the harness type check                                                                                 |
| `gPronto.Tools:automated-tests/src/main.ts`                   | The pipeline: stages, exit codes, report hand-off                                                                            |
| `gPronto.Tools:automated-tests/src/settings.ts`               | Loads the Test Run settings, the applications file, and the journeys; reads `gPronto.Tools:.env` values                      |
| `gPronto.Tools:automated-tests/src/journeys.ts`               | Instance planning, concurrency, and the per-instance lifecycle                                                               |
| `gPronto.Tools:automated-tests/src/steps.ts`                  | The implementation of every step action                                                                                      |
| `gPronto.Tools:automated-tests/src/jitter.ts`                 | The seeded random generator and waits                                                                                        |
| `gPronto.Tools:automated-tests/src/collect.ts`                | Per-instance error collection, screenshots, and instance artifacts                                                           |
| `gPronto.Tools:automated-tests/src/log.ts`                    | The run and file loggers                                                                                                     |
| `gPronto.Tools:automated-tests/src/report.ts`                 | Writes `gPronto.Tools:logs/<run>/report.json` and `gPronto.Tools:logs/<run>/report.md`                                       |
| `gPronto.Tools:automated-tests/src/supabase-logs.ts`          | The end-of-run Supabase auth log pull                                                                                        |

From the **gPronto.Tools** repository root, use one of these commands to type-check the source without running anything.

Windows PowerShell:

```powershell
Set-Location ".\automated-tests"
npm run check
```

Unix shell:

```sh
cd "./automated-tests"
npm run check
```

