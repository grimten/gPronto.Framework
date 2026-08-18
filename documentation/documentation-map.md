# Documentation map

## Status

Draft

## Scope

gPronto.Framework:The complete catalog of direct-child documentation files.
gPronto.Framework:The title, scope, and link recorded for every cataloged document.
gPronto.Framework:Excludes the detailed requirements owned by the cataloged documents.

## Verification

Date: 2026-08-18

## Rules

<rule category="documentation-catalog" id="documentation-catalog-completeness">

The `Documents` catalog **MUST** contain exactly one entry for every Markdown document directly in `gPronto.Framework:documentation` and **MUST NOT** contain an entry for another file.

Every entry **MUST** contain a level-three heading equal to the document title, the complete content of the document's `Scope` chapter, and one relative Markdown link to the document.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-documentation-map">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current direct-child Markdown files and each document's title and `Scope` chapter. The **Agent** has approval to inspect those documents and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify every missing, duplicate, misplaced, or stale entry. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Documents

The catalog below lists every document. Each document has a level-three heading containing its name, followed by the complete content of its `Scope` chapter and a link to the document.

### Application bootstrap

gPronto.Application:The application HTML entry.
gPronto.Application:The application TypeScript configuration.
gPronto.Application:The application Vite configuration.
gPronto.Application:The single browser source entry point.
gPronto.Application:Browser environment variables and the request passed to the framework bootstrap.
gPronto.Application:Webpage-module discovery and required bootstrap webpages.
gPronto.Application:Excludes repository structure and dependency versions.
gPronto.Application:Excludes the internal implementation of framework initialization.

[Application bootstrap](application-bootstrap.md)

### Application dependencies

gPronto.Application:The canonical package manifest, dependency versions, and package scripts.
gPronto.Application:The canonical lockfile and generated dependency resolution.
gPronto.Application:Excludes repository structure, TypeScript configuration, Vite configuration, and browser startup.

[Application dependencies](application-dependencies.md)

### Application inventory

gPronto.Application:The identity, type, path identifier, and prototype identifier of every current application.
gPronto.Framework:The identity, type, path identifier, and URL of every current repository.
gPronto.Application:The relationship between current prototypes and their hosted Backstage records.
gPronto.Application:Excludes deployments, Supabase projects, source structure, and application behavior.

[Application inventory](application-inventory.md)

### Application repository

gPronto.Application:Required repository-root entries.
gPronto.Application:The **Framework link**, its target, and its Git treatment.
gPronto.Application:The application source-folder shape.
gPronto.Application:The application public-assets shape.
gPronto.Application:The module specifier used for framework imports.
gPronto.Application:Excludes dependency state and browser bootstrap configuration.

[Application repository](application-repository.md)

### Application-root state

gPronto.Framework:The public `User`, `Organisation`, and `Session` fields, defaults, and mutability.
gPronto.Framework:Direct assignment of public `User` and `Organisation` fields.
gPronto.Framework:Persistence and publication of Authentication-owned public values.
gPronto.Framework:Cross-tab replacement of persisted public values.
gPronto.Framework:Synchronization and trust characteristics of `Session.SessionId`.
gPronto.Framework:Excludes the complete application-root API.
gPronto.Framework:Excludes public Authentication operations and Authentication event sequencing.

[Application-root state](application-root-state.md)

### Application root

gPronto.Framework:The public application-root component name, props, and application definition.
gPronto.Framework:The public properties exposed through the application-root component.
gPronto.Framework:The public `User`, `Organisation`, and `Session` property shapes.
gPronto.Framework:The public Authentication status and error-message values.
gPronto.Framework:The public Authentication function tree.
gPronto.Framework:Excludes application bootstrap files and Authentication state synchronization.
gPronto.Framework:Excludes the internal behavior of subsystems exposed through the component.

[Application root](application-root.md)

### Authentication interface

gPronto.Framework:Public Authentication **gComponents** and their user-interface behavior.
gPronto.Framework:Required application Authentication webpages and their visibility behavior.
gPronto.Framework:Public administrative-operation shells and their interim manual process.
gPronto.Framework:Authentication callback routing, verification, and result presentation.
gPronto.Framework:Excludes Authentication runtime storage and synchronization.
gPronto.Framework:Excludes public Authentication operation implementation and hosted Supabase project settings.

[Authentication interface](authentication-interface.md)

### Authentication operations

gPronto.Framework:The immutable public Authentication operation object.
gPronto.Framework:The input, Supabase call, and result contract of each public Authentication function.
gPronto.Framework:Excludes Authentication runtime-state synchronization.
gPronto.Framework:Excludes user-interface composition and hosted Supabase configuration.

[Authentication operations](authentication-operations.md)

### Authentication runtime

gPronto.Framework:Browser storage of Authentication-owned public state.
gPronto.Framework:Cross-tab synchronization of stored Authentication state.
gPronto.Framework:Supabase session observation and Authentication event handling.
gPronto.Framework:Database hydration of the current user and organisation.
gPronto.Framework:Authentication status transitions and error-message publication.
gPronto.Framework:Runtime subscription, scheduling, retry, and cleanup ownership.
gPronto.Framework:Excludes public Authentication operations and user interfaces.
gPronto.Framework:Excludes hosted Supabase project settings.

[Authentication runtime](authentication-runtime.md)

### Authentication

gPronto.Framework:The end-to-end Authentication model and implementation status.
gPronto.Framework:Framework and application Authentication ownership.
gPronto.Framework:Authentication source organization and application webpage families.
gPronto.Framework:The documents that own runtime, operation, interface, and application-root-state contracts.
gPronto.Framework:Excludes the detailed requirements owned by those focused contracts.
gPronto.Framework:Excludes Supabase platform configuration.

[Authentication](authentication.md)

### Automated Tests

gPronto.Tools:The shared browser-test harness location, vocabulary, and machine prerequisites.
gPronto.Tools:Test-run entry points, launcher chain, dashboard, execution pipeline, and exit codes.
gPronto.Tools:Test-run settings, application registry, environments, and test users.
gPronto.Tools:Journey files, step actions, element addressing, and randomized waits.
gPronto.Tools:Browser error collection, screenshots, traces, videos, and Supabase log collection.
gPronto.Tools:Run output, reports, result interpretation, and harness source files.
gPronto.Tools:Future automated-test work recorded in the harness roadmap.
gPronto.Tools:Excludes application implementation, deployment procedures, and framework unit tests.

[Automated Tests](automated-tests.md)

### Browser logs

gPronto.Tools:The filesystem location of captured browser logs.
gPronto.Tools:The grouping of browser logs by launcher run and application.
gPronto.Tools:Excludes browser logging runtime behavior and telemetry records.

[Browser logs](browser-logs.md)

### Data

gPronto.Framework:Ownership of the shared PostgreSQL data layer and **gPostgresDataContract** catalog.
gPronto.Framework:Registration and session sharing of the Refine Supabase data provider.
gPronto.Framework:Versioned resource identifiers and their mapping to physical PostgreSQL tables.
gPronto.Framework:Computation of Refine resource definitions from passive **gPostgresDataContract** metadata.
gPronto.Framework:Registration and public exposure of PostgreSQL data resources.
gPronto.Framework:Source organization for generic and PostgreSQL-specific data artifacts.
gPronto.Framework:Current data-layer capabilities and explicit non-capabilities.
gPronto.Framework:Excludes database schemas, SQL migrations, and application webpages.

[Data](data.md)

### Database access

gPronto.Application:Data API schema exposure and automatic table exposure.
gPronto.Application:Baseline table privileges for authenticated and anonymous roles.
gPronto.Application:Initial SQL script ownership of tables, privileges, policies, functions, and role data.
gPronto.Application:The Authentication property-hydration database function and its permissions.
gPronto.Application:Application roles and the access granted to each role.
gPronto.Application:Role use in RLS policies and role-field consistency requirements.
gPronto.Application:Excludes database naming, browser-client configuration, CLI procedures, and Edge Function structure.

[Database access](database-access.md)

### Database naming

gPronto.Application:Naming requirements for database tables and views.
gPronto.Application:Naming requirements for columns.
gPronto.Application:Naming requirements for constraints and indexes.
gPronto.Application:Naming requirements for triggers and policies.
gPronto.Application:Naming requirements for sequences and types.
gPronto.Application:Excludes access permissions, RLS behavior, SQL procedures, and Edge Functions.

[Database naming](database-naming.md)

### Deployments

gPronto.Application:Local development and preview ports for current applications.
gPronto.Application:Production and stage Cloudflare Pages projects and domains.
gPronto.Application:Cloudflare Pages environment-variable names, targets, value references, and types.
gPronto.Application:Excludes repository identity, Supabase project configuration, and deployment procedures.

[Deployments](deployments.md)

### Documentation map

gPronto.Framework:The complete catalog of direct-child documentation files.
gPronto.Framework:The title, scope, and link recorded for every cataloged document.
gPronto.Framework:Excludes the detailed requirements owned by the cataloged documents.

[Documentation map](documentation-map.md)

### Documentation

gPronto.Framework:Mandatory document chapters and the content assigned to each chapter.
gPronto.Framework:Placement of current requirements in document **Rules**.
gPronto.Framework:Bold formatting of defined terms.
gPronto.Framework:Repository-rooted file, folder, environment-file, and environment-variable reference formats.
gPronto.Framework:Markdown heading, tag-block, blank-line, and document-ending formatting.
gPronto.Framework:Documentation tag syntax, attributes, pairing, and behavior.
gPronto.Framework:Typed tag-reference integrity and documentation file-set variables.
gPronto.Framework:Excludes the subject matter and requirements owned by other documents.

[Documentation](documentation.md)

### Edge Functions

gPronto.Application:Ownership and location of application Supabase Edge Functions.
gPronto.Application:Required Edge Function folders, source files, handlers, and runtime behavior.
gPronto.Application:Naming requirements for Edge Function folders, files, handlers, and database functions.
gPronto.Application:Excludes database access, database naming, browser integration, and CLI authentication.

[Edge Functions](edge-functions.md)

### Filenames

gPronto.Framework:The naming pattern for files directly inside the framework source folder.
gPronto.Framework:Permitted source areas and subareas.
gPronto.Framework:Permitted filename suffixes and their meanings.
gPronto.Framework:Excludes filenames inside **gComponent**, **gLayout**, and **gPostgresDataContract** folders.

[Filenames](filenames.md)

### Formats

gPronto.Framework:The public value-formatting function and immutable format catalog.
gPronto.Framework:The formatter result contract for valid, nullish, and incompatible values.
gPronto.Framework:Output contracts for text, number, boolean, date, timestamp, UUID, JSONB, and array formats.
gPronto.Framework:Excludes database column schemas and user-specific formatting overrides.

[Formats](formats.md)

### gComponent catalog

gPronto.Framework:Public **gComponent** props types and no-props components.
gPronto.Framework:General-purpose public **gComponents** and their props.
gPronto.Framework:Input, textarea, and button component behavior.
gPronto.Framework:Authentication presentation-component props and defaults.
gPronto.Framework:PostgreSQL data-table resource behavior and saved settings.
gPronto.Framework:Navigation component behavior and props.
gPronto.Framework:Excludes the general source-structure requirements for creating a **gComponent**.

[gComponent catalog](gcomponent-catalog.md)

### gComponents

gPronto.Framework:The definition and purpose of a **gComponent**.
gPronto.Framework:Source-folder, source-file, component, and props-type naming.
gPronto.Framework:Public export and application import requirements.
gPronto.Framework:Styling ownership and application-use restrictions.
gPronto.Framework:Framework replacements for common HTML controls.
gPronto.Framework:Excludes the props and behavior of individual **gComponents**.

[gComponents](gcomponents.md)

### Get Emails

gPronto.Application:Capture timing and read-state preservation for supported authentication-email recipients.
gPronto.Application:Authentication and request requirements for the read-only email API.
gPronto.Application:Response ordering, callback-link extraction, and fetch-health fields.
gPronto.Application:Excludes how Authentication sends, verifies, or processes emails.

[Get Emails](get-emails.md)

### gLayout catalog

gPronto.Framework:The complete public **gLayout** catalog and its registry.
gPronto.Framework:Props, open slots, and fixed slots of `GLayoutSingleColumn`.
gPronto.Framework:Props, open slots, and fixed slots of `GLayoutTwoColumnNavigation`.
gPronto.Framework:Props, open slots, and fixed slots of `GLayoutCardsModern`.
gPronto.Framework:Excludes the general source-structure requirements for creating a **gLayout**.

[gLayout catalog](glayout-catalog.md)

### gLayouts

gPronto.Framework:The definition and purpose of a **gLayout**.
gPronto.Framework:Composition of fixed and open slots.
gPronto.Framework:Source-folder, source-file, component, props-type, and CSS naming.
gPronto.Framework:Public export and application-use requirements.
gPronto.Framework:Excludes the props and slots of individual **gLayouts**.

[gLayouts](glayouts.md)

### gPostgresDataContracts

gPronto.Framework:File structure, naming, exports, and version numbering for **gPostgresDataContracts**.
gPronto.Framework:The top-level PostgreSQL data-contract schema and its column entries.
gPronto.Framework:Column validation and array-item metadata.
gPronto.Framework:Insert and update permissions, defaults, selectors, and validators.
gPronto.Framework:Data-table visibility, sorting, filtering, formatting, and defaults.
gPronto.Framework:Format-key compatibility with the framework format catalog.
gPronto.Framework:Registry membership and public identifier exposure.
gPronto.Framework:Schema-version applicability and released-version immutability.
gPronto.Framework:Excludes data-provider registration, resource execution, and database enforcement.

[gPostgresDataContracts](gpostgresdatacontracts.md)

### gPronto.Application

gPronto.Application:The identity of a **gPronto.Application** as a Vite React application in its own repository.
gPronto.Application:The repository, dependency, and browser-bootstrap contracts that together define application setup.
gPronto.Application:Excludes the detailed requirements owned by those three setup contracts.

[gPronto.Application](gpronto.application.md)

### gPronto.Framework

gPronto.Framework:The business context and purpose of **gPronto.Framework**.
gPronto.Framework:The identities and purposes of **gPronto.Application.Backstage** and **gPronto.Application.Prototypes**.
gPronto.Framework:The identities, purposes, and boundaries of **gPronto.Services** and **gPronto.Tools**.
gPronto.Framework:Framework integration, application hosting, and application separation.
gPronto.Framework:The current state of prototype admission control.
gPronto.Framework:The shared-framework philosophy and its intended benefits.
gPronto.Framework:Excludes detailed requirements owned by individual framework areas.

[gPronto.Framework](gpronto.framework.md)

### gPronto.Services

gPronto.Services:The purpose and ownership boundary of **gPronto.Services**.
gPronto.Services:The current gCodex API source, configuration, environment, and resources.
gPronto.Services:Excludes browser application source, framework package source, and development tools.

[gPronto.Services](gpronto.services.md)

### gPronto.Tools

gPronto.Tools:The purpose and ownership boundary of **gPronto.Tools**.
gPronto.Tools:The shared automation scripts, automated-test harness, browser profiles, configuration, dependencies, and generated logs.
gPronto.Tools:The source, configuration, and current features of the gPronto Visual Studio Code extension.
gPronto.Tools:Excludes browser application source, framework package source, and non-browser services.

[gPronto.Tools](gpronto.tools.md)

### Public API

gPronto.Framework:The public package entry point.
gPronto.Framework:Public application-root values and types.
gPronto.Framework:Public registered-webpage values and types.
gPronto.Framework:Public **gComponent** values and props types.
gPronto.Framework:Public **gLayout** values and props types.
gPronto.Framework:Public PostgreSQL data-resource identifiers.
gPronto.Framework:Excludes internal modules and the behavior of exported values.

[Public API](public-api.md)

### Roadmap

gPronto.Framework:Planned future work for **gPronto.Framework** and its documentation.
gPronto.Framework:Excludes completed work and current behavior.

[Roadmap](roadmap.md)

### Scripts

gPronto.Tools:Current direct-child `.mjs` scripts in `gPronto.Tools:scripts`.
gPronto.Tools:Script log locations, names, and retention.
gPronto.Tools:Script settings files and settings coverage.
gPronto.Tools:Script environment-file ownership and usage.
gPronto.Tools:Excludes scripts outside `gPronto.Tools:scripts`, files in subfolders, application startup, automated-test behavior, and deployment procedures.

[Scripts](scripts.md)

### Scripts catalog

gPronto.Tools:The purpose, prerequisites, effects, and invocation of every current direct-child script in `gPronto.Tools:scripts`.
gPronto.Tools:The supported command-line arguments of every current direct-child script in `gPronto.Tools:scripts`.
gPronto.Tools:Excludes script governance, shared-settings requirements, and log-retention requirements owned by `gPronto.Framework:documentation/scripts.md`.

[Scripts catalog](scripts-catalog.md)

### Styling

gPronto.Framework:Styling-option source structure, registration, runtime identifiers, and application selection.
gPronto.Framework:CSS class naming, ownership, and source-backed usage.
gPronto.Framework:Variant class names and cross-option selector parity.
gPronto.Framework:Selector, pseudo-selector, and styling-file restrictions.
gPronto.Framework:The global reset and root custom properties.
gPronto.Framework:Framework icon ownership and presentation conventions.
gPronto.Framework:Excludes application-owned style overrides and styling-driven behavior changes.

[Styling](styling.md)

### Supabase CLI

gPronto.Application:Supabase CLI installation and version checks.
gPronto.Application:CLI authentication and hosted-project linking procedures.
gPronto.Application:Availability requirements for Supabase-related skills.
gPronto.Application:Excludes browser integration, database access policy, database naming, and Edge Functions.

[Supabase CLI](supabase-cli.md)

### Supabase projects

gPronto.Application:Hosted Supabase project identities, endpoints, platform settings, Postgres versions, and secret references.
gPronto.Application:Mapping of application browser environment variables to project URLs and publishable keys.
gPronto.Application:Allowed Authentication callback URLs for every current project and environment.
gPronto.Application:Excludes browser integration, CLI procedures, database access, naming, and Edge Function requirements.

[Supabase projects](supabase-projects.md)

### Supabase

gPronto.Application:Supabase organization, hosted-project ownership, and prohibition of local project copies.
gPronto.Application:Application project linking and browser-safe configuration values.
gPronto.Application:Shared browser-client creation, validation, and ownership.
gPronto.Application:Hosted project and browser Authentication configuration.
gPronto.Application:Refine Supabase data-provider registration and session sharing.
gPronto.Application:Excludes CLI procedures, database access, database naming, and Edge Function requirements.

[Supabase](supabase.md)

### Telemetry

gPronto.Framework:UUID requirements shared by telemetry records.
gPronto.Framework:Browser-error telemetry capture, persistence, deduplication, and retry behavior.
gPronto.Framework:**User**-event telemetry for page visits and button clicks.
gPronto.Framework:**User**-session heartbeat creation, refresh, retry, and stop behavior.
gPronto.Framework:Telemetry runtime startup and lifetime ownership.
gPronto.Framework:Excludes database table schemas and browser-log file locations.

[Telemetry](telemetry.md)

### Terms

gPronto.Framework:The authoritative meanings of documentation and agent terms.
gPronto.Framework:The authoritative meanings of framework, application, service, tool, interface-composition, and data-contract terms.
gPronto.Framework:Excludes functional and technical requirements for framework features.

[Terms](terms.md)

### Webpages

gPronto.Application:Ownership, folder structure, file naming, and exported naming of application webpages.
gPronto.Application:The required not-found webpage and catch-all route.
gPronto.Application:Webpage composition with one public **gLayout** and public **gComponents**.
gPronto.Application:Prohibition of application-owned webpage styling.
gPronto.Application:Webpage registration, route identity, metadata, navigation, and visibility requirements.
gPronto.Application:Framework import and usage requirements for webpage source.
gPronto.Application:Excludes the internal implementation of routing, **gLayouts**, and **gComponents**.

[Webpages](webpages.md)

