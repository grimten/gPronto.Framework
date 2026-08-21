# Documentation catalog

## Status

Draft

## Scope

gPronto.Framework:The current documentation catalog.
gPronto.Framework:The title, purpose, and link of every direct-child documentation document.
gPronto.Framework:Excludes requirements owned by the cataloged documents.

## Verification

Date: 2026-08-19

## Rules

<rule category="catalog" id="documentation-catalog-current">

The catalog **MUST** contain exactly one entry for every Markdown document directly inside `gPronto.Framework:documentation` and **MUST NOT** contain any other entry.

Every document title **MUST** equal the document's level-one heading. Every purpose **MUST** equal the document's first `Scope` statement with its owner prefix removed.

</rule>

<rule category="catalog" id="documentation-catalog-overview">

This document **MUST** describe only the current documentation inventory. It **MUST NOT** duplicate the cataloged documents' requirements or instructions.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-documentation-catalog">

The **Agent** **MUST** validate this catalog against the Markdown documents directly inside `gPronto.Framework:documentation`. The **Agent** has approval to update only this document when a catalog entry is missing, extra, or stale.

</instructions>

## Catalog

| Document                                                          | Purpose                                                                                                                |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [Application bootstrap](application-bootstrap.md)                 | The application HTML entry.                                                                                            |
| [Application catalog](application-catalog.md)                     | The current application catalog.                                                                                       |
| [Application dependencies](application-dependencies.md)           | The canonical package manifest, dependency versions, and package scripts.                                              |
| [Application repository](application-repository.md)               | Required repository-root entries.                                                                                      |
| [Application-root state](application-root-state.md)               | The public `User`, `Organisation`, and `Session` fields, defaults, and mutability.                                     |
| [Application root](application-root.md)                           | The public application-root component name, props, and application definition.                                         |
| [Authentication interface](authentication-interface.md)           | Public Authentication **gComponents** and their user-interface behavior.                                               |
| [Authentication operations](authentication-operations.md)         | The immutable public Authentication operation object.                                                                  |
| [Authentication runtime](authentication-runtime.md)               | Browser storage of Authentication-owned public state.                                                                  |
| [Authentication](authentication.md)                               | The end-to-end Authentication model and implementation status.                                                         |
| [Automated test catalog](automated-test-catalog.md)               | The current automated-test runtime, action, and journey catalog.                                                       |
| [Automated tests](automated-tests.md)                             | The shared automated-test harness behavior and ownership.                                                              |
| [Browser logs](browser-logs.md)                                   | The filesystem location of captured browser logs.                                                                      |
| [Data](data.md)                                                   | Ownership of the shared PostgreSQL data layer.                                                                         |
| [Database access](database-access.md)                             | Data API schema exposure and automatic table exposure.                                                                 |
| [Database naming](database-naming.md)                             | Naming requirements for database tables and views.                                                                     |
| [Deployment catalog](deployment-catalog.md)                       | The current local and hosted deployment catalog.                                                                       |
| [Documentation catalog](documentation-catalog.md)                 | The current documentation catalog.                                                                                     |
| [Documentation](documentation.md)                                 | Mandatory document chapters and the content assigned to each chapter.                                                  |
| [Edge Functions](edge-functions.md)                               | Ownership and location of application Supabase Edge Functions.                                                         |
| [Filenames](filenames.md)                                         | The naming pattern for files directly inside the framework source folder.                                              |
| [Format catalog](format-catalog.md)                               | The current public format catalog.                                                                                     |
| [Formats](formats.md)                                             | The public value-formatting interface.                                                                                 |
| [gComponent catalog](gcomponent-catalog.md)                       | The current public **gComponent** catalog.                                                                             |
| [gComponents](gcomponents.md)                                     | The definition and purpose of a **gComponent**.                                                                        |
| [Get Emails](get-emails.md)                                       | Capture timing and read-state preservation for supported authentication-email recipients.                              |
| [gLayout catalog](glayout-catalog.md)                             | The current public **gLayout** catalog.                                                                                |
| [gLayouts](glayouts.md)                                           | The definition and purpose of a **gLayout**.                                                                           |
| [gPostgresDataContract catalog](gpostgresdatacontract-catalog.md) | The current **gPostgresDataContract** catalog.                                                                         |
| [gPostgresDataContracts](gpostgresdatacontracts.md)               | File structure, naming, exports, and version numbering for **gPostgresDataContracts**.                                 |
| [gPronto.Application](gpronto.application.md)                     | The identity of a **gPronto.Application** as a Vite React application in its own repository.                           |
| [gPronto.Framework](gpronto.framework.md)                         | The business context and purpose of **gPronto.Framework**.                                                             |
| [gPronto.Services](gpronto.services.md)                           | The purpose and ownership boundary of **gPronto.Services**.                                                            |
| [gPronto.Tools](gpronto.tools.md)                                 | The purpose and ownership boundary of **gPronto.Tools**.                                                               |
| [Public API catalog](public-api-catalog.md)                       | The current public API export-group catalog.                                                                           |
| [Roadmap](roadmap.md)                                             | Planned future work for **gPronto.Framework** and its documentation.                                                   |
| [Scripts catalog](scripts-catalog.md)                             | The current direct-child script catalog.                                                                               |
| [Scripts](scripts.md)                                             | Execution, logging, settings, and environment requirements for direct-child `.mjs` scripts in `gPronto.Tools:scripts`. |
| [Styling catalog](styling-catalog.md)                             | The current registered styling catalog.                                                                                |
| [Styling](styling.md)                                             | Styling-option source structure, registration, runtime identifiers, and application selection.                         |
| [Supabase CLI](supabase-cli.md)                                   | Supabase CLI installation and version checks.                                                                          |
| [Supabase project catalog](supabase-project-catalog.md)           | The current hosted Supabase project catalog.                                                                           |
| [Supabase](supabase.md)                                           | Supabase organization, hosted-project ownership, and prohibition of local project copies.                              |
| [Telemetry](telemetry.md)                                         | UUID requirements shared by telemetry records.                                                                         |
| [Terms](terms.md)                                                 | The authoritative meanings of documentation and agent terms.                                                           |
| [Webpages](webpages.md)                                           | Ownership, folder structure, file naming, and exported naming of application webpages.                                 |

