# Browser logs

## Status

Draft

## Scope

gPronto.Tools:The filesystem location of captured browser logs.
gPronto.Tools:The grouping of browser logs by launcher run and application.
gPronto.Tools:Excludes browser logging runtime behavior and telemetry records.

## Verification

Date: 2026-08-18

## Rules

<rule category="browser-log-storage" id="browser-log-path">

Captured browser logs **MUST** be stored under `gPronto.Tools:logs/browser/[RUN IDENTIFIER]/[APPLICATION NAME]`.

</rule>

<rule category="browser-log-storage" id="browser-log-grouping">

Each launcher run **MUST** create one run-identifier folder, and each selected **gPronto.Application** **MUST** have one application-name folder inside that run folder.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-browser-logs">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current browser-log collection source and output structure. The **Agent** has approval to inspect those sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** state the failed requirement and current evidence. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Info

Browser logs can be found under:

```text
gPronto.Tools:logs/browser/<run-identifier>/<application-name>
```

Each launcher run creates one `<run-identifier>` folder. Each selected application has its own `<application-name>` folder inside that run folder.

