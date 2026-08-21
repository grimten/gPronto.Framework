# Application repository

## Status

Draft

## Scope

gPronto.Application:Required repository-root entries.
gPronto.Application:The **Framework link**, its target, and its Git treatment.
gPronto.Application:The application source-folder shape.
gPronto.Application:The application public-assets shape.
gPronto.Application:The module specifier used for framework imports.
gPronto.Application:Excludes dependency state and browser bootstrap configuration.

## Verification

Date: 2026-08-18

## Rules

<rule category="repository" id="root-files">

The repository root **MUST** contain these tracked files: `gPronto.Application:.gitignore`, `gPronto.Application:index.html`, `gPronto.Application:package-lock.json`, `gPronto.Application:package.json`, `gPronto.Application:tsconfig.json`, `gPronto.Application:vite.config.ts`.

</rule>

<rule category="repository" id="gitignore-content">

After converting CRLF line endings to LF and removing trailing newline characters, `gPronto.Application:.gitignore` **MUST** exactly match the [canonical `gPronto.Application:.gitignore`](assets/gpronto.application/.gitignore).

</rule>

<rule category="framework-link" id="framework-link-name">

The repository root **MUST** contain a **Framework link** named exactly `gPronto.Application:gPronto` that resolves to a folder.

</rule>

<rule category="framework-link" id="framework-link-target">

The **Framework link** **MUST** resolve to the `gPronto.Framework:gPronto.Framework` folder inside the local clone of the **gPronto.Framework** repository.

</rule>

<rule category="framework-link" id="framework-link-ignored">

The **Framework link** **MUST NOT** be committed.

</rule>

<rule category="source-files" id="src-single-folder">

`gPronto.Application:src` **MUST** contain exactly one folder, named `gPronto.Application:src/webpages`.

</rule>

<rule category="public-assets" id="public-content">

`gPronto.Application:public` **MUST** contain exactly one file, named `gPronto.Application:public/favicon.svg`, and **MUST NOT** contain a folder.

</rule>

<rule category="framework-interface" id="import-specifier">

Every import of **gPronto.Framework** in **gPronto.Application** source **MUST** use the module specifier `@gpronto.framework`.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-application-repository">

The **Agent** **MUST** validate these **Rules** against every **gPronto.Application** listed in [Application catalog](application-catalog.md):

- `application-repository.md: rule:[root-files]`
- `application-repository.md: rule:[gitignore-content]`
- `application-repository.md: rule:[framework-link-name]`
- `application-repository.md: rule:[framework-link-target]`
- `application-repository.md: rule:[framework-link-ignored]`
- `application-repository.md: rule:[src-single-folder]`
- `application-repository.md: rule:[public-content]`
- `application-repository.md: rule:[import-specifier]`

For each listed **Rule**, the **Agent** **MUST** first verify that every canonical asset referenced by that **Rule** exists and then validate the **Rule** exactly as written.

When a validation fails, the **Agent** **MUST** mark the text containing the failed requirement by applying `documentation.md: rule:[documentation-tag-requirements]`. The `agent-error-explanation` **MUST** identify every affected **gPronto.Application**, file or folder, and reason for failure.

When every validation passes, the **Agent** **MUST NOT** add an `agent-error` or `agent-error-explanation` tag.

</instructions>

## Repository structure

A **gPronto.Application** lives in its own Git repository and uses a **Framework link** to reach the shared **gPronto.Framework** source.

## More files

A **gPronto.Application** repository can contain files and folders other than those named in this document.

