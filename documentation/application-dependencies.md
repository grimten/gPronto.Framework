# Application dependencies

## Status

Draft

## Scope

gPronto.Application:The canonical package manifest, dependency versions, and package scripts.
gPronto.Application:The canonical lockfile and generated dependency resolution.
gPronto.Application:Excludes repository structure, TypeScript configuration, Vite configuration, and browser startup.

## Verification

Date: 2026-08-17

## Rules

<rule category="package" id="package-content">

After converting CRLF line endings to LF and removing trailing newline characters, `gPronto.Application:package.json` **MUST** exactly match the [canonical `gPronto.Application:package.json`](assets/gpronto.application/package.json).

</rule>

<rule category="lock-file" id="package-lock-content">

After converting CRLF line endings to LF and removing trailing newline characters, `gPronto.Application:package-lock.json` **MUST** exactly match the [canonical `gPronto.Application:package-lock.json`](assets/gpronto.application/package-lock.json).

</rule>

## Instructions

<instructions category="dependency-validation" approval="silent" id="validate-application-dependency-files">

The **Agent** **MUST** validate both of these **Rules**:

- `application-dependencies.md: rule:[package-content]`
- `application-dependencies.md: rule:[package-lock-content]`

The **Agent** **MUST** identify every current **gPronto.Application** from [Application catalog](application-catalog.md).

For each referenced **Rule**, the **Agent** **MUST** verify that its linked canonical asset exists and that every current **gPronto.Application** satisfies the **Rule**.

When a validation fails, the **Agent** **MUST** mark the error immediately after the `Scope` chapter using the tags defined by `documentation.md: rule:[documentation-tag-requirements]`.

</instructions>

## Package assets

The canonical package manifest and lockfile are stored as documentation assets instead of being embedded in this document.

