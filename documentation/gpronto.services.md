# gPronto.Services

## Status

Draft

## Scope

gPronto.Services:The purpose and ownership boundary of **gPronto.Services**.
gPronto.Services:The current gCodex API source, configuration, environment, and resources.
gPronto.Services:Excludes browser application source, framework package source, and development tools.

## Verification

Date: 2026-08-18

## Rules

<rule category="repository-boundary" id="services-repository-boundary">

**gPronto.Services** **MUST** own shared non-browser services and **MUST NOT** own **gPronto.Framework** package source, **gPronto.Application** browser source, or development-tool source.

</rule>

<rule category="gcodex-api" id="gcodex-api-source">

The gCodex API **MUST** be implemented by `gPronto.Services:api.py`, **MUST** read its non-secret configuration from `gPronto.Services:settings.json`, and **MUST** read its secrets from `gPronto.Services:.env`.

</rule>

<rule category="gcodex-api" id="gcodex-api-resources">

The gCodex API **MUST** provide the configured branch, session, template-item, and authentication-email resources through the route prefix defined in `gPronto.Services:settings.json`.

</rule>

<rule category="secrets" id="services-secret-boundary">

Secrets required by **gPronto.Services** **MUST** remain in `gPronto.Services:.env` and **MUST NOT** be written into documentation, committed source, or `gPronto.Services:settings.json`.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-gpronto-services">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current **gPronto.Services** source, tests, settings, and environment-variable names without exposing secret values. The **Agent** has approval to perform read-only inspection and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify the affected service boundary, source, resource, setting, or environment-variable name. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Current service

The current service is the Python FastAPI gCodex API. Its source entry point is `gPronto.Services:api.py`, its configuration is `gPronto.Services:settings.json`, and its environment file is `gPronto.Services:.env`.

The API exposes branch and session operations, test template items, authentication emails, health information, and generated API documentation.

