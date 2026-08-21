# Terms

## Status

Draft

## Scope

gPronto.Framework:The authoritative meanings of documentation and agent terms.
gPronto.Framework:The authoritative meanings of framework, application, service, tool, interface-composition, and data-contract terms.
gPronto.Framework:Excludes functional and technical requirements for framework features.

## Verification

Date: 2026-08-18

## Rules

## Instructions

<instructions category="validation" approval="silent" id="validate-terms">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the terminology used by all current documentation and source boundaries. The **Agent** has approval to inspect those documents and sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify the undefined, conflicting, or stale term. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Terms

### MUST

**MUST** states a mandatory requirement.

### MUST NOT

**MUST NOT** states a mandatory prohibition.

### MAY

**MAY** states an explicitly permitted choice.

### Rule

A **Rule** is a statement that defines a requirement, a prohibition, or an explicitly permitted choice within its applicable scope.

A **Rule** is binary: it can be checked, and the result can only be `Pass` or `Fail`, with no ambiguity.

### Chat

A **Chat** is the complete conversation between the **User** and the **Agent**. It contains every message sent by the **User** and every response provided by the **Agent**. Text in the composer becomes part of the **Chat** only after it is sent.

### User

The **User** is the person who gives instructions and information to the **Agent** through a **Chat**.

### Agent

The **Agent** is the AI participant that receives the **User**'s instructions, performs the authorized work, and responds in the **Chat**.

### Agent Role

An **Agent Role** is a named and fixed set of responsibilities and restrictions that the **Agent** follows for the remainder of a **Chat**.

### Miss Specs

**Miss Specs** is an **Agent Role**. Its description is in [the role document](../.agents/miss-specs.md).

### Mrs Senior Specs

**Mrs Senior Specs** is an **Agent Role**. Its description is in [the role document](../.agents/mrs-senior-specs.md).

### Mr Dev

**Mr Dev** is an **Agent Role**. Its description is in [the role document](../.agents/mr-dev.md).

### Mr Ricky

**Mr Ricky** is an **Agent Role**. Its description is in [the role document](../.agents/mr-ricky.md).

### Mrs Housekeeping

**Mrs Housekeeping** is an **Agent Role**. Its description is in [the role document](../.agents/mrs-housekeeping.md).

### Mr Action

**Mr Action** is an **Agent Role**. Its description is in [the role document](../.agents/mr-action.md).

### Code tour

A **code tour** is a source-led investigation in which the **Agent Role** starts at the specified entry point, follows actual imports and function calls through every required code path, and produces a code map showing each source file and connection found.

### Issue document

An **Issue document** is a document created or developed by **Miss Specs** or **Mrs Senior Specs** that describes an enhancement to the **gPronto.Framework** and one or more **gPronto.Application** for the **Mr Dev** **Agent Role** to implement.

### gPronto.Framework

Our shared way of building **gPronto.Application**.

### gPronto.Services

The repository that owns shared non-browser services used by **gPronto.Framework** and **gPronto.Application**.

### gPronto.Tools

The repository that owns development tools used to work with **gPronto.Framework**, **gPronto.Application**, and their documentation.

### gPronto.Application

**gPronto.Application.Backstage** or a **gPronto.Application.Prototype**.

### Framework link

A **Framework link** is the filesystem directory entry named `gPronto.Application:gPronto` in the root of a **gPronto.Application** repository that resolves to `gPronto.Framework:gPronto.Framework` inside a local clone of **gPronto.Framework**.

The implementation of a **Framework link** is supplied by the operating system. The mechanism used does not change the meaning or required target of the **Framework link**.

### gPronto.Application.Backstage

The portal that our clients work in when they work with their **gPronto.Application.Prototype**.

### gPronto.Application.Prototype

A **gPronto.Application.Prototype** is a client-specific React application that models a proposed customer-facing financial product before the real product is built.

The purpose of a **gPronto.Application.Prototype** is to allow our clients to see what a final product will look like.

Each **gPronto.Application.Prototype** is a complete and fully functional React application with its own Authentication, data, and more.

### Mock user

The simulated person that a **gPronto.Application.Prototype** signs in as.

### gComponent

A **gComponent** is a React component provided by **gPronto.Framework**.

### gLayout

A **gLayout** is a React component provided by **gPronto.Framework** that arranges the content of one webpage in a **gPronto.Application**.

### Open slot

An **Open slot** is a place in a **gLayout** whose content is supplied by the webpage using the **gLayout**.

### Fixed slot

A **Fixed slot** is a place in a **gLayout** whose **gComponent** is supplied by the **gLayout** rather than by the webpage.

### gDataContract

A **gDataContract** is a versioned, immutable description, owned by **gPronto.Framework**, of one source of data that a **gPronto.Application** can read or write, and of how it may be read and written. A **gDataContract** may describe PostgreSQL data, API data, event data, or another data category.

### gPostgresDataContract

A **gPostgresDataContract** is a **gDataContract** that describes one PostgreSQL table, including its columns and how a **gPronto.Application** may read and write them.

