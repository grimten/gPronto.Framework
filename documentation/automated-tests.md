# Automated tests

## Status

Draft

## Scope

gPronto.Tools:The shared automated-test harness behavior and ownership.
gPronto.Tools:Test-run settings, journey execution, evidence collection, reports, and exit results.
gPronto.Tools:Excludes the current harness, action, and journey inventory.
gPronto.Tools:Excludes application implementation and deployment procedures.

## Verification

Date: 2026-08-19

## Rules

<rule category="ownership" id="automated-test-ownership">

The shared automated-test harness **MUST** be owned by **gPronto.Tools** and **MUST NOT** be implemented in a **gPronto.Application** repository.

</rule>

<rule category="execution" id="automated-test-execution">

A test run **MUST** load the configured applications, settings, users, and journeys before browser execution. It **MUST** execute included journey instances, collect their evidence, and write a final report and exit result.

</rule>

<rule category="results" id="automated-test-results">

A run in which every stage and journey instance passes **MUST** exit with code `0`. A run with a validation, launch, journey, assertion, browser, collection, or reporting failure **MUST** exit nonzero.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-automated-tests">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current **gPronto.Tools** automated-test source, settings, journeys, and a current validation run. The **Agent** has approval to add, update, or remove only validation-error tags in this document.

</instructions>

## Overview

The harness runs configured browser journeys against the selected stage or production deployment. It keeps application settings, journey definitions, browser execution, evidence collection, and reporting in **gPronto.Tools**.

The current runtime entries, actions, and journey files are listed in [Automated test catalog](automated-test-catalog.md).
