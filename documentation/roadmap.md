# Roadmap

## Status

Draft

## Scope

gPronto.Framework:Planned future work for **gPronto.Framework** and its documentation.
gPronto.Framework:Excludes completed work and current behavior.

## Verification

Date: 2026-08-19

## Rules

This chapter is deliberately left empty.

## Instructions

This chapter is deliberately left empty.

## Roadmap items

This chapter records everything we may want to do in the future and divides the roadmap items into milestones. Every milestone has its own level-three heading and a brief description of its purpose and timeframe. Every roadmap item has its own level-four heading beneath one milestone.

Milestones are listed in their required execution order. Every roadmap item in an earlier milestone must be completed before work begins on the next milestone.

An item's initial content can be an unformatted, uncorrected note. The item is refined here until it is ready to become an issue. After the item has been refined, create an issue from it.

The final milestone is always named `Sometime in the future`. It contains every roadmap item for which a milestone has not yet been decided. When a milestone is decided for one of those items, move the complete item under the applicable milestone.

### Immediate

Deadline: 2026-08-23.

This milestone contains the roadmap items that must be completed immediately by the stated deadline.

#### Navigation

Fix navigation in two ordered phases. First, complete and enhance the existing registered-webpage navigation metadata so it is the authoritative description of how each webpage appears in navigation. The metadata must cover whether the webpage is shown, its navigation label, ordering, parent or group relationship, and any additional icon, placement, or presentation information required by the approved navigation variants. The metadata contract, validation, and metadata for every current webpage must be complete before work begins on the navigation **gComponent**s.

After the webpage metadata is complete, build several framework-owned navigation **gComponent**s that all consume the same metadata rather than maintaining their own route lists or labels. The initial set must include the standard left navigation panel and a horizontal navigation menu. Additional navigation variants must reuse the same metadata and navigation model so a webpage is defined once and is presented consistently by every navigation **gComponent**.

#### Flexible gComponent variants

Add explicit, type-safe variants to framework **gComponent**s that need to cover materially different application use cases. A variant may change the supported presentation, arrangement, content, or optional controls, but every variant of one **gComponent** must continue to share the component's core behavior and public purpose.

Start with `GComponentAuthenticationSignIn`, which currently has one fixed presentation containing email, password, and the sign-in button. Identify the concrete sign-in use cases needed by the applications, then define a documented variant contract that supports those cases without requiring an application to copy or replace the framework component.

Every sign-in variant must use the same public sign-in operation, validation path, running state, success and error handling, and accessibility behavior. Use a finite set of named variants rather than unrelated combinations of optional flags, retain the current presentation as the default, and add future variants without breaking applications that already use the **gComponent**.

#### Validation and Formatting

This work applies to **gPronto.Framework**, **gPronto.Application.Backstage**, and every **gPronto.Application.Prototype**.

##### 1. Stabilize the current implementation

First, audit the existing global formatting and validation implementations, including their public functions, catalogs, descriptors, result contracts, and current **gComponent** usage. Confirm that both systems are complete, deterministic, type-safe, documented, and consistently used. Enhance either system wherever the audit finds missing behavior, conflicting behavior, or an unstable contract before adding the features below.

##### 2. Validation

Every application must provide an administrator-only webpage that lists the complete validation catalog and its rules in read-only form. The webpage must exist in **gPronto.Application.Backstage** and every **gPronto.Application.Prototype**.

Every input **gComponent** must require at least one registered validation rule to be selected, whether the rule is declared directly by the input or supplied through the applicable data contract. The framework must reject an input definition that has no selected validation rule.

Every operation that writes input data, including database inserts and updates, must run the selected validation rules before sending the write request. A failed validation must prevent the request and expose the applicable validation message. Client-side validation must complement, not replace, authoritative database constraints.

##### 3. Formatting

Every application must provide an administrator-only webpage that lists the complete formatting catalog in read-only form. The webpage must exist in **gPronto.Application.Backstage** and every **gPronto.Application.Prototype**.

**Users** must be able to select their preferred formats from the registered formatting options. Those selections must be saved in the settings file. A saved user selection must override the applicable default format in **gPronto.Framework**; when no saved selection exists, the framework default must apply.

Every **gComponent** that displays or edits a formatted value must use the same format-resolution path and honor the saved user selection. A formatting-capable **gComponent** must not hard-code a format or bypass the user-setting and framework-default resolution order.

##### 4. Later administrator control

In a later phase, administrators must be able to control validation and formatting rather than only view them. This includes creating their own validation rules and formats, changing which options are available, and selecting defaults. Before that phase is implemented, define the storage, versioning, permissions, validation, audit history, and fallback behavior for administrator-created rules and formats.

#### Footer

Create the new framework footer by replacing or enhancing the current `GComponentFooter`. In every **gPronto.Application.Prototype**, the footer must display clearly labelled information for both the authenticated real user and the active **Mock user** so the two identities are always distinguishable.

#### Prototype info

Create a family of UI components for use inside **gPronto.Application.Prototype** webpages. These components must push prototype information to and pull prototype information from **gPronto.Application.Backstage** through one defined framework data boundary.

The initial components must include:

- a panel that allows the **Mock user** to capture a screenshot of the current prototype webpage and create a related database record containing the screenshot reference and relevant prototype, webpage, user, and time information;
- information panels that retrieve and display Backstage-managed information associated with a particular prototype webpage, such as explanations or instructions that we want the **Mock user** to see.

#### Prototype Options

Allow clients testing a **gPronto.Application.Prototype** to switch between meaningful alternatives for the current webpage. Small interface differences can materially improve a client's ability to understand and compare a proposed product. For example, one sign-in option may contain email, password, and a sign-in button, while another contains the same controls plus a required terms-and-conditions checkbox.

Every prototype webpage that provides alternatives must have an options panel that opens from the left when the user selects an icon or equivalent control. The panel must list the options available for that webpage, show the current selections, and apply a selection to the webpage so the client can immediately experience the alternative.

**gPronto.Application.Backstage** must maintain an inventory of every webpage in every **gPronto.Application.Prototype** and the option definitions available for each webpage. The system must also persist the options selected by clients, including enough identity to associate each selection with the correct prototype, webpage, option, and selecting user.

The initial persistence design to evaluate is a prototype-owned `pages` table containing its webpage inventory, available options, and selected values. The final design may separate those concerns into multiple tables, but the selected option state must live with the prototype and be mirrored to **gPronto.Application.Backstage**.

#### Documentation enhancement

Reorganize all documentation so it can be read from two clearly separated perspectives: the application developer who uses **gPronto.Framework** to build a **gPronto.Application**, and the framework developer who develops and maintains **gPronto.Framework** itself. Their concerns are different and must not be mixed together without a clear boundary.

The application-developer perspective must explain the public API, supported configuration, integration steps, examples, expected behavior, and application responsibilities without requiring knowledge of framework internals. The framework-developer perspective must explain internal architecture, implementation ownership, source boundaries, maintenance rules, validation, and how the public behavior is produced.

For each documentation subject, decide whether these perspectives require separate documents or clearly separated chapters. Shared definitions and contracts must have one authoritative owner and be linked from both perspectives rather than duplicated.

---

##### Working developer definitions

These are initial working definitions to refine before reorganizing the application-facing and framework-facing documentation.

###### Framework Developer

The Framework Developer can see and work in every gPronto repository. The role has no repository boundary and can inspect and change public contracts and internal implementations in any repository, subject to the governing instructions of the repository and development task.

###### Application Developer

The Application Developer can work only in one **gPronto.Application** repository: the repository in which the development task started.

The Application Developer may list, search, open, read, create, edit, and delete only application-owned files whose fully resolved physical paths remain inside that starting repository. The Application Developer must not work in another repository or use a junction path to inspect or change files whose resolved physical paths are outside the starting repository.

The only exception is read-only access to explicitly allow-listed public **gPronto.Framework** contract artifacts made available through the **Framework link**. Running an application development, type-check, or build command that automatically consumes framework source does not permit the Application Developer to inspect that source.

##### Proposed public contract boundary

The existing public API entry point and public export barrels remain the authoritative lists of public exports. For **gComponents**, the Application Developer may read `gPronto.Framework:gPronto.Framework/gPronto.Framework.PublicApi.gComponentExports.ts` but must not list, search, open, read, create, edit, or delete anything under `gPronto.Framework:gPronto.Framework/gComponents`.

The framework development process must generate a declaration-only public contract from `gPronto.Framework:gPronto.Framework/gPronto.Framework.PublicApi.EntryPoint.ts`. The generated declarations must be rolled into one public `.d.ts` artifact containing the public runtime exports and public types required by a **gPronto.Application**, without implementation bodies, internal-only declarations, declaration maps, source maps, or framework source files.

The generated public contract must be derived from the current public API and must never be maintained manually. Validation must regenerate the artifact and fail when the generated result differs from the stored public contract.

The Application Developer may read the generated public declaration artifact, explicitly allow-listed public export barrels, application-developer documentation, public catalogs, and public examples. Every framework implementation folder remains outside the Application Developer boundary.

The current source **Framework link** may remain temporarily for development, type-checking, and builds. Those tools may consume the source automatically, but the Application Developer may not inspect it. A later packaged framework distribution can replace the source junction and expose only the compiled runtime, public declarations, CSS, and required assets.

The exact generated-artifact location, generator ownership, validation command, allow-list, and packaged-distribution transition remain to be decided while this roadmap item is refined.

---

#### Add data adapters for APIs - Kalydos and Velmie

Develop the initial implementation as easily and quickly as possible. Do not add unit tests, generalized abstractions, optional infrastructure, or other nonessential features.

Use the existing PostgreSQL data connector, data-contract schemas, resource registration, and Refine integration as the behavioral reference. The API data connector must provide the corresponding contract, schema, resource, and data-operation model through Refine.

The required initial result is a working Refine connector that can retrieve collections and individual records, make the retrieved information available for later display in a table, and submit edits that update existing records. Reading and updating records must work end to end against each supported supplier API.

Front-end work is outside the scope of the initial implementation. Do not build a table, edit form, webpage, or other user-interface component. Build only the connector contracts, schemas, registration, runtime, and Refine data operations needed for the connector to work.

Application-level access rights are outside the scope of the initial implementation. Every authenticated account may invoke every operation supported by the connector, without role-based, account-specific, or record-specific restrictions. The connector must still use the supplier authentication required to call the external API. Application-level access controls will be added later.

The API and PostgreSQL data connectors must be completely independent implementations. They must not share any framework-owned function, helper, type, schema, registry, runtime module, component implementation, or generated artifact. Duplicate necessary implementation code instead of creating a shared abstraction, so a bug or change in one connector cannot affect the other connector.

Formatting, validation, and similar enhancements are outside the scope of the initial implementation and can be added later.

Create a standalone API data-adapter system that provides the API equivalent of the existing PostgreSQL data-adapter contracts, schemas, and runtime. Define versioned API contracts for resources and operations, request and response mappings, authentication and secret boundaries, essential error handling, pagination, and generated-output ownership only where required by the initial implementation.

After the generic API adapter system is defined and working, implement separate supplier adapters for the Kalydos API and the Velmie API. Each supplier adapter must use a reviewed allowlist of supported operations, keep supplier credentials outside browser code and generated artifacts, and normalize supplier responses into the API adapter contract.

### Sometime in the future

This is the final milestone. It contains all roadmap items for which no earlier milestone has yet been decided.

#### Authentication external storage clearing

Define and implement one deterministic response when `gPronto.Framework.LocalStorage` is removed or cleared. Currently, a browser storage event in another tab resets the framework `User` and `Organisation` values while the Supabase client can retain its in-memory session, and the tab that performs `localStorage.clear()` receives no storage event and can retain stale in-memory values.

The final behavior must explicitly cover both same-tab and cross-tab clearing. Decide whether the framework rehydrates its public values from the active Supabase session, resets them, or signs the user out, and ensure the public authentication status cannot contradict the resulting identity state. Supabase session-token persistence must remain separate from the **gPronto.Framework** storage envelope.

#### Authentication local storage encryption and migration

Replace the current version-1 `PlainJson`-only storage design with a deliberate encryption and migration design. Define which cached framework values require protection, the security guarantees that browser-side encryption can and cannot provide, who owns the encryption key, and how unreadable data is handled without exposing stale identity state.

Add explicit migrations between supported envelope versions and formats. A migration must preserve valid cached values, reject unsupported data safely, and provide a deterministic fallback when decryption or migration fails. This work applies only to the **gPronto.Framework** storage envelope; Supabase continues to own persistence of its authentication session.

#### Authentication multi-factor authentication

Complete multi-factor authentication support beyond the runtime's current handling of the `MFA_CHALLENGE_VERIFIED` event. Add the public authentication operations and user interfaces required to enroll, list, challenge, verify, and remove authentication factors, together with the recovery behavior needed when a factor is unavailable.

Define how factor state and session assurance are exposed to a **gPronto.Application**, which webpages require an additional assurance level, and how successful verification updates the existing framework authentication state without creating a second session store.

#### Authentication Refine integration

Connect the existing framework authentication runtime to Refine's authentication-provider contract. Refine login, logout, session checking, identity, permission, and authentication-error behavior must delegate to the same public authentication interface and state already owned by **gPronto.Framework**.

Register the provider in the framework's Refine composition and reconcile Refine route protection with the existing registered-webpage visibility behavior. The integration must not introduce a second Supabase client, duplicate session persistence, or a competing authenticated-user state.

#### Authentication trusted administrative operations

Implement the existing create-user, invite-user, update-user, and delete-user shells through a trusted server boundary. The browser-facing functions must call that boundary rather than using a Supabase secret or service-role key in the browser.

Define administrator authorization, request and result contracts, validation, audit recording, error handling, and session revocation where required. Replace the current synchronous `Not implemented` errors only after the trusted operations and their authorization checks are available.

#### Multi-page component

Create a framework-owned **gComponent** for workflows that collect data across several ordered pages or steps, similar to a wizard. A **gPronto.Application** must be able to define the steps, the content and inputs shown in each step, the order in which the steps are visited, and the completed data produced by the workflow.

The **gComponent** must provide progress information, next and previous navigation, per-step validation, retained values when moving between steps, a final review or confirmation step when required, and one defined completion action. It must also define cancellation, submission errors, and whether an unfinished workflow can be saved and resumed.

Before implementation, decide whether a step is a route-backed webpage, an internal view owned by the **gComponent**, or whether both models are supported. Every model must use the existing framework input, validation, formatting, and accessibility behavior rather than introducing separate form rules for wizard workflows.

#### Graph and chart components

Create framework-owned **gComponent**s for displaying graphs, charts, and other data visualisations in a **gPronto.Application**. The initial set of visualisations must be selected from concrete application use cases and may include line, bar, area, pie, comparison, trend, and summary visualisations.

Define one shared data-series contract for labels, values, categories, time ranges, units, and optional comparison data so applications do not need a different data shape for every visualisation. Decide how a visualisation receives direct application data and how it can consume data described by a **gDataContract**.

Every visualisation **gComponent** must use framework formatting and themes, adapt to its available space, and define loading, empty, error, and partial-data states. It must also provide accessible titles, descriptions, legends, values, and a non-visual way to understand the data when the graphic alone is insufficient.

#### Iframe component

Create a framework-owned **gComponent** for displaying approved external or application-owned webpages inside an iframe. The component must provide a clear source contract, a required accessible title, responsive width and height behavior, and defined loading, loaded, blocked, and error states.

Use secure defaults for iframe sandboxing, browser permissions, referrer behavior, and navigation. Define how each **gPronto.Application** supplies or restricts allowed origins, which capabilities can be enabled for a particular iframe, and how unsafe or unapproved sources are rejected.

Before supporting communication between the containing webpage and the iframe, define an explicit `postMessage` contract with origin validation, typed messages, and lifecycle handling. The iframe **gComponent** must not accept unrestricted message events or silently grant additional browser capabilities.

#### Language selector

Add a language selector so each application user can choose their preferred language. The selected language must be saved for that user and applied consistently throughout the application.

#### Mobile

Every **gPronto.Application.Prototype** must support a mobile experience. Before implementation, decide whether the existing webpages will adapt to a mobile presentation or whether mobile will use separate webpages, layouts, or components.

#### Email templates

Populate the existing `email_templates` and `project_prototype_email_templates` database tables with the required email templates. Authentication and every other workflow that sends email must retrieve its subject, body, and required template variables from these database records instead of owning separate hard-coded templates.

Every **gPronto.Application.Prototype** must have its own isolated set of email templates. The administrators of a prototype must be able to view and manage the templates used by that prototype without changing the templates of another prototype.

#### Versioning

After the **gPronto.Framework** base has stabilized and development is primarily adding **gLayout**s and **gComponent**s, framework evolution must be additive. An existing public **gLayout** or **gComponent** must not be deleted, renamed, or changed in a way that breaks its existing contract or behavior.

When an incompatible layout or component change is required, create and publish a new explicit version while retaining the previous version. Existing **gPronto.Application** code must continue to build and behave as before until that application deliberately adopts the newer version.

#### gDataContract version-selection validation

Validate that every **gPronto.Application** selects a **gPostgresDataContract** version compatible with its physical PostgreSQL table before normal data operations begin. The current registry permits all versions and does not verify that the selected version's columns match the database used by the running application.

Define where this validation runs and how it obtains the database schema. A mismatch must stop use of the affected resource and report the application, resource identifier, selected contract version, table, and specific missing or incompatible columns so the problem is found before an insert, update, list, or other operation fails at runtime.

#### Assets

Ensure that we have the correct files in the assets folder (documentation) in a structured way, under application, under framework and so on.

#### Create a proper framework

Turn **gPronto.Framework** into a reusable public framework comparable in distribution and developer experience to MUI or Ant Design. Publish versioned releases on GitHub so any application can install and use the framework without cloning the framework repository, creating a junction, or linking directly to its source. Define the supported public API, package build, release process, versioning policy, compatibility guarantees, installation instructions, and framework documentation required for external use.

#### Enhance services

The current **gPronto.Services** API can create and inspect isolated Git branches and worktrees, start Codex sessions from prompts, inspect session status, and retrieve session results. Use that API as the execution boundary for agent-assisted framework development.

Build an orchestration layer in **gPronto.Application.Backstage** around its issue database. The layer must claim eligible issues, select an appropriate agent, submit the work through the **gPronto.Services** API, track status and results, and write the outcome back to the issue without processing the same issue twice. Define separate workstreams for **gPronto.Application.Backstage**, **gPronto.Framework**, and each **gPronto.Application.Prototype**, with specialized **Agent Role**s for the different stages within each workstream.

#### enhanced scope owner

For the
**gPronto.Framework**
**gPronto.Application**
**gPronto.Application.Prototype**
**gPronto.Application.Backstage**

we need to ensure that we know what each really means, and they should be seen as a person reading the document,

meaning, that **gPronto.Application.Prototype**, should not have to know anything that the**gPronto.Framework** knows.

#### Automated testing: rebuilding the journey suite

The previous twelve authentication journeys and their step machinery — sign-up, email flows, password and email changes, negative paths, and the axe accessibility scan — were removed for a clean start. Recreating any of them needs its step actions back and, for the email-based ones, an inbox reader and an email budget; the removed implementations remain in git history. A generic form-fill and click step would let new webpages stay a settings change rather than an engine change.

#### Automated testing: a local target

The harness targets the stage or production deployments already online. A full local target would start preview servers instead and point the journeys at the local ports.

#### Automated testing: scheduled unattended runs

The exit codes already fit automation. Missing: a schedule on a dedicated machine, a notification channel for failures, and retention of run history. Scheduled journeys double as smoke tests and baseline traffic.

#### Automated testing: run history and trends

Each run stands alone in its own folder under the logs folder, and the dashboard currently shows no run results. The server's run, instance, and screenshot endpoints exist unused; a runs page over them, and an index across runs for error counts, durations, and pass rates over time, are open work.

#### Automated testing: the admission gate

Enforcing **gPronto.Application.Backstage** Authentication when visiting a **gPronto.Application.Prototype** is a known future requirement of **gPronto.Framework**. When the admission marker lands, the harness needs a gate step before prototype journeys and settings for the gate credentials.

#### Automated testing: content assertions

The `go-to-webpage` step can assert an expected title and text per page. Remaining directions: comparing per-webpage screenshots between runs, and a console-clean requirement per webpage.

#### Automated testing: test user lifecycle

The test user pool is fixed: the engine does not create users, and users are never deleted automatically. Decide a lifecycle: a creation path when the pool runs short, dormant cleanup, or time-boxed users. The repair tool already removes users that can no longer sign in.

#### Automated testing: test user git status

The applications file is tracked in git although it contains test user passwords. Decide whether it should be gitignored like the run output in the logs folder, and what a fresh machine then starts from.

#### Automated testing: artifact retention

Every run writes a complete artifact folder. Decide a retention policy — age, count, or size — and whether failed runs are kept longer than passed runs.

#### Automated testing: Supabase request rate limits

Supabase enforces per-IP rate limits on its auth endpoints. With many concurrent instances behind one machine's IP these can surface as collected responses with status 429. Possible responses: detecting them explicitly in the report, staggering instances harder, or raising the limits through the Management API.

#### Automated testing: browser coverage

Every instance runs Chromium at one desktop viewport. Firefox and WebKit, and mobile viewports, become relevant when mobile stops being later work for **gLayouts**.

#### Automated testing: browser state assertions

The authentication steps read the `gPronto.Framework.LocalStorage` envelope for the signed-in identity. Remaining direction: asserting the complete `User` and `Organisation` property set, not only the identity fields.

#### Automated testing: cross-tab behavior

The framework publishes identity changes to other tabs through the browser storage event. Every instance uses a single page. A step family that opens a second tab in the same browser context, acts in one tab, and asserts in the other would turn the documented cross-tab behavior into a tested one.

#### Automated testing: cross-application isolation

Every **gPronto.Application** has its own Supabase project, so a test user of one application must not be able to sign in to another. A sign-in step that uses another application's test user and expects the native error would assert that separation.

#### Automated testing: broader Supabase log pulls

The end-of-run pull fetches the newest 200 auth log rows per project. Possible extensions: postgres and edge function logs, paging past 200 rows, and correlating log rows to journey instances through the tagged test user emails.

#### Automated testing: out of scope

These items were considered and decided against. They are recorded so they are not proposed again.

Secondary-domain run — Running the journeys against an application's secondary `pages.dev` domain would exercise the callback allow-list and the return-to-origin behavior on the secondary origin. We have no need for that.

