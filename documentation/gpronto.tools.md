# gPronto.Tools

## Status

Draft

## Scope

gPronto.Tools:The purpose and ownership boundary of **gPronto.Tools**.
gPronto.Tools:The shared automation scripts, automated-test harness, browser profiles, configuration, dependencies, and generated logs.
gPronto.Tools:The source, configuration, and current features of the gPronto Visual Studio Code extension.
gPronto.Tools:Excludes browser application source, framework package source, and non-browser services.

## Verification

Date: 2026-08-18

## Rules

<rule category="repository-boundary" id="tools-repository-boundary">

**gPronto.Tools** **MUST** own development tools and **MUST NOT** own **gPronto.Framework** package source, **gPronto.Application** browser source, or shared non-browser service source.

</rule>

<rule category="automation" id="automation-source">

The shared automation scripts **MUST** be stored in `gPronto.Tools:scripts`.

The shared automated-test harness **MUST** be stored in `gPronto.Tools:automated-tests`.

The scripts and automated-test harness **MUST** read repository-owned configuration and environment values from `gPronto.Tools:settings.json` and `gPronto.Tools:.env`.

Generated tool logs **MUST** be written under `gPronto.Tools:logs`, and persistent application browser profiles **MUST** be stored under `gPronto.Tools:browserprofiles`.

Root script dependencies **MUST** be defined by `gPronto.Tools:package.json` and `gPronto.Tools:package-lock.json`. Automated-test dependencies **MUST** be defined independently by `gPronto.Tools:automated-tests/package.json` and `gPronto.Tools:automated-tests/package-lock.json`.

</rule>

<rule category="vscode-extension" id="vscode-extension-source">

The gPronto Visual Studio Code extension **MUST** be located in `gPronto.Tools:vs.code.extension`, **MUST** define its extension metadata in `gPronto.Tools:vs.code.extension/package.json`, and **MUST** use `gPronto.Tools:vs.code.extension/extension.js` as its source entry point.

</rule>

<rule category="vscode-extension" id="vscode-extension-features">

The gPronto Visual Studio Code extension **MUST** provide automatic text replacement, Markdown tag highlighting, Markdown status file decorations, and agent-error monitoring as workspace-configurable features.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-gpronto-tools">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current **gPronto.Tools** source, package metadata, configuration schema, and extension documentation. The **Agent** has approval to perform read-only inspection and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify the affected tool boundary, source, metadata, configuration, or feature. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Current tools

The shared automation scripts are stored in `gPronto.Tools:scripts`, and their shared settings are stored in `gPronto.Tools:settings.json`.

The shared automated-test harness is stored in `gPronto.Tools:automated-tests`.

Persistent browser profiles and generated logs are stored outside tracked source in `gPronto.Tools:browserprofiles` and `gPronto.Tools:logs`.

The gPronto Visual Studio Code extension is stored in `gPronto.Tools:vs.code.extension`. It provides workspace-configurable documentation and editing support without becoming part of the framework package or a **gPronto.Application** browser runtime.

