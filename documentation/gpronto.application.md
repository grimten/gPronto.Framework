# gPronto.Application

## Status

Draft

## Scope

gPronto.Application:The identity of a **gPronto.Application** as a Vite React application in its own repository.
gPronto.Application:The repository, dependency, and browser-bootstrap contracts that together define application setup.
gPronto.Application:Excludes the detailed requirements owned by those three setup contracts.

## Verification

Date: 2026-08-18

## Rules

<rule category="application-identity" id="application-identity">

Every **gPronto.Application** **MUST** be a Vite React application in its own Git repository.

</rule>

<rule category="application-setup" id="application-setup-contracts">

The complete setup contract for every **gPronto.Application** **MUST** consist of [Application repository](application-repository.md), [Application dependencies](application-dependencies.md), and [Application bootstrap](application-bootstrap.md). Repository structure, dependency state, and browser bootstrap **MUST** satisfy their respective document.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-gpronto-application">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against every current **gPronto.Application** and the three setup contracts. The **Agent** has approval to inspect those repositories and documents and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** state every affected application and current evidence. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Setup contracts

A **gPronto.Application** is a Vite React application in its own Git repository.

Its setup is defined by three documents:

1. [Application repository](application-repository.md) defines the repository structure and framework integration.
2. [Application dependencies](application-dependencies.md) defines the package and lockfile contract.
3. [Application bootstrap](application-bootstrap.md) defines configuration, browser startup, environment values, and webpage discovery.

