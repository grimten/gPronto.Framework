# Roadmap

## Status

Draft

## Scope

gPronto.Framework:Planned future work for **gPronto.Framework** and its documentation.
gPronto.Framework:Excludes completed work and current behavior.

## Verification

Date: 2026-08-18

## Rules

<rule category="roadmap" id="future-work-coverage">

Every item of work that we want to do in the future **MUST** be recorded in this document.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-roadmap">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against current plans. The **Agent** has approval to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## What to do

This chapter is where we record everything we may want to do in the future. Each item **MUST** have its own level-three heading.

An item's initial content can be an unformatted, uncorrected note. The item is refined here until it is ready to become an issue. After the item has been refined, create an issue from it.

### Authentication external storage clearing

### Authentication global adapter

### Authentication local storage encryption and migration

### Authentication multi-factor authentication

### Authentication Refine integration

### Authentication trusted administrative operations

### Framework export naming

### gDataContract user-specific format overrides

### gDataContract version-selection validation

### Assets

Ensure that we have the correct files in the assets folder (documentation) in a structured way, under application, under framework and so on.

### Create a proper framework

So that there is no need for linking and so on.

### Create an agent role that automatically fixes all user actions

Create a new agent role for this.

### Fix env variables

Subject: gCodex token
Problem: The framework source variable used VITE_GCODEX_API_TOKEN.
Required action or decision: Renamed to GCODEX_API_TOKEN. VITE_GCODEX_API_TOKEN remains only as the deployed frontend target name.
agent message above, dix that

### enhanced scope owner

For the
**gPronto.Framework**
**gPronto.Application**
**gPronto.Application.Prototype**
**gPronto.Application.Backstage**

we need to ensure that we know what each really means, and they should be seen as a person reading the document,

meaning, that **gPronto.Application.Prototype**, should not have to know anything that the**gPronto.Framework** knows.

### Automated testing: rebuilding the journey suite

The previous twelve authentication journeys and their step machinery — sign-up, email flows, password and email changes, negative paths, and the axe accessibility scan — were removed for a clean start. Recreating any of them needs its step actions back and, for the email-based ones, an inbox reader and an email budget; the removed implementations remain in git history. A generic form-fill and click step would let new webpages stay a settings change rather than an engine change.

### Automated testing: a local target

The harness targets the stage or production deployments already online. A full local target would start preview servers instead and point the journeys at the local ports.

### Automated testing: scheduled unattended runs

The exit codes already fit automation. Missing: a schedule on a dedicated machine, a notification channel for failures, and retention of run history. Scheduled journeys double as smoke tests and baseline traffic.

### Automated testing: run history and trends

Each run stands alone in its own folder under the logs folder, and the dashboard currently shows no run results. The server's run, instance, and screenshot endpoints exist unused; a runs page over them, and an index across runs for error counts, durations, and pass rates over time, are open work.

### Automated testing: the admission gate

Enforcing **gPronto.Application.Backstage** Authentication when visiting a **gPronto.Application.Prototype** is a known future requirement of **gPronto.Framework**. When the admission marker lands, the harness needs a gate step before prototype journeys and settings for the gate credentials.

### Automated testing: content assertions

The `go-to-webpage` step can assert an expected title and text per page. Remaining directions: comparing per-webpage screenshots between runs, and a console-clean requirement per webpage.

### Automated testing: test user lifecycle

The test user pool is fixed: the engine does not create users, and users are never deleted automatically. Decide a lifecycle: a creation path when the pool runs short, dormant cleanup, or time-boxed users. The repair tool already removes users that can no longer sign in.

### Automated testing: test user git status

The applications file is tracked in git although it contains test user passwords. Decide whether it should be gitignored like the run output in the logs folder, and what a fresh machine then starts from.

### Automated testing: artifact retention

Every run writes a complete artifact folder. Decide a retention policy — age, count, or size — and whether failed runs are kept longer than passed runs.

### Automated testing: Supabase request rate limits

Supabase enforces per-IP rate limits on its auth endpoints. With many concurrent instances behind one machine's IP these can surface as collected responses with status 429. Possible responses: detecting them explicitly in the report, staggering instances harder, or raising the limits through the Management API.

### Automated testing: browser coverage

Every instance runs Chromium at one desktop viewport. Firefox and WebKit, and mobile viewports, become relevant when mobile stops being later work for **gLayouts**.

### Automated testing: browser state assertions

The authentication steps read the `gPronto.Framework.LocalStorage` envelope for the signed-in identity. Remaining direction: asserting the complete `User` and `Organisation` property set, not only the identity fields.

### Automated testing: cross-tab behavior

The framework publishes identity changes to other tabs through the browser storage event. Every instance uses a single page. A step family that opens a second tab in the same browser context, acts in one tab, and asserts in the other would turn the documented cross-tab behavior into a tested one.

### Automated testing: cross-application isolation

Every **gPronto.Application** has its own Supabase project, so a test user of one application must not be able to sign in to another. A sign-in step that uses another application's test user and expects the native error would assert that separation.

### Automated testing: broader Supabase log pulls

The end-of-run pull fetches the newest 200 auth log rows per project. Possible extensions: postgres and edge function logs, paging past 200 rows, and correlating log rows to journey instances through the tagged test user emails.

### Automated testing: out of scope

These items were considered and decided against. They are recorded so they are not proposed again.

Secondary-domain run — Running the journeys against an application's secondary `pages.dev` domain would exercise the callback allow-list and the return-to-origin behavior on the secondary origin. We have no need for that.

### Add Dataadapters for API - Kalydos & Velmie

Carl to update 2026-08-18

