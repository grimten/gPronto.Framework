# Authentication

## Status

Draft

## Scope

gPronto.Framework:The end-to-end Authentication model and implementation status.
gPronto.Framework:Framework and application Authentication ownership.
gPronto.Framework:Authentication source organization and application webpage families.
gPronto.Framework:The documents that own runtime, operation, interface, and application-root-state contracts.
gPronto.Framework:Excludes the detailed requirements owned by those focused contracts.
gPronto.Framework:Excludes Supabase platform configuration.

## Verification

Date: 2026-08-17

## Rules

<rule category="authentication-overview" id="authentication-overview">

The implementation **MUST** supply a shared Supabase client, session observation, public operations, runtime status, synchronization of the current Auth identifier and email with database hydration of the active `public.users` row and its optional `public.organisations` row, 15 framework-owned authentication **gComponents**, and 15 registered authentication webpages in each **gPronto.Application**.

The eleven operation-specific authentication **gComponents** are connected to their public operations. They own their applicable form state and required-field validation, prevent duplicate submission, provide disabled and loading states, preserve native Supabase operation results, present native error messages with operation-specific fallbacks, and present operation-specific success results. Password confirmation is also validated for sign-up, password reset, invitation acceptance, and password change.

The callback **gComponent** **MUST** complete email-link verification and present the current authentication runtime state by composing the shared loading, operation-error, and result-message **gComponents**. The loading **gComponent** **MUST** be a reusable presentation component. The operation-error and result-message **gComponents** **MUST** create one global transient notification in an effect and **MUST** render no inline alert.

</rule>

<rule category="scope-and-ownership" id="scope-and-ownership">

**gPronto.Framework** owns the shared browser Authentication implementation. Its shared Supabase subsystem owns the browser client used by both Authentication and Refine data access.

Every **gPronto.Application**:

- uses its own Supabase project;
- supplies its own Supabase URL and publishable key;
- receives an independent browser session;
- uses the same framework implementation;
- has the same callback path;
- does not supply any secret or service-role key to browser source.

There is no `gGlobalAdapter`. Public authentication functions and current values are exposed through GProntoFrameworkApplicationRootComponent.

The Supabase client is private to **gPronto.Framework**. A **gPronto.Application** does not create, receive, or select a Supabase client for Authentication or data operations.

</rule>

<rule category="source-organization" id="source-organization">

The framework authentication source is held in focused files under:

`gPronto.Framework:gPronto.Framework`

Authentication event handling, subscription ownership, status ordering, and deferred scheduling are implemented in:

`gPronto.Framework:gPronto.Framework/gPronto.Framework.Authentication.Runtime.ts`

RPC execution, response validation, mapping, request deduplication, retry ownership, and stale-result rejection are implemented in:

`gPronto.Framework:gPronto.Framework/gPronto.Framework.Authentication.UserAndOrganisationSynchronization.ts`

The database function and its permissions are defined in the four existing **gPronto.Application** initial SQL scripts. No authentication source file, migration file, or validation script was added for hydration.

Shared Supabase configuration, validation, and browser-client ownership are held in the `gPronto.Framework.Supabase.*` source modules in that folder. Authentication consumes the shared browser client through its internal getter; it does not create a second client.

The application-owned configuration is supplied in each **gPronto.Application** through this relative file name:

```text
gPronto.Application:src/gPronto.Application.Bootstrap.EntryPoint.ts
```

Every **gPronto.Application** **MUST** contain exactly these fifteen authentication webpage folders directly under `gPronto.Application:src/webpages`, and each folder **MUST** contain one `gPronto.Application:src/webpages/[WEBPAGE FOLDER]/webpage.tsx`:

```text
gPronto.Application:src/webpages/authentication-callback.webpage/webpage.tsx
gPronto.Application:src/webpages/authentication-sign-in.webpage/webpage.tsx
gPronto.Application:src/webpages/authentication-email-change.webpage/webpage.tsx
gPronto.Application:src/webpages/authentication-email-confirmation-resend.webpage/webpage.tsx
gPronto.Application:src/webpages/authentication-invitation-acceptance.webpage/webpage.tsx
gPronto.Application:src/webpages/authentication-loading.webpage/webpage.tsx
gPronto.Application:src/webpages/authentication-magic-link-request.webpage/webpage.tsx
gPronto.Application:src/webpages/authentication-operation-error.webpage/webpage.tsx
gPronto.Application:src/webpages/authentication-password-change.webpage/webpage.tsx
gPronto.Application:src/webpages/authentication-password-recovery-request.webpage/webpage.tsx
gPronto.Application:src/webpages/authentication-password-reset.webpage/webpage.tsx
gPronto.Application:src/webpages/authentication-reauthentication.webpage/webpage.tsx
gPronto.Application:src/webpages/authentication-result-message.webpage/webpage.tsx
gPronto.Application:src/webpages/authentication-sign-out.webpage/webpage.tsx
gPronto.Application:src/webpages/authentication-sign-up.webpage/webpage.tsx
```

For each relative name, the four application files are content-identical: after line-ending normalization they match byte for byte. Today the three **gPronto.Application.Prototype** repositories store these files with CRLF line endings and **gPronto.Application.Backstage** stores them with LF. They form 15 Source File Families.

The public authentication **gComponents** are held in focused folders under:

`gPronto.Framework:gPronto.Framework/gComponents`

The public authentication contracts are exported through:

`gPronto.Framework:gPronto.Framework/gPronto.Framework.PublicApi.ApplicationRootExports.ts`

The internal rendering component remains separate from the public facade and contains no authentication implementation.

</rule>

<rule category="authentication-contracts" id="authentication-contracts">

Authentication **MUST** be defined by exactly these four detailed contracts:

- [Authentication runtime](authentication-runtime.md) **MUST** define browser storage, synchronization, and runtime state.
- [Authentication operations](authentication-operations.md) **MUST** define the public operation interface.
- [Authentication interface](authentication-interface.md) **MUST** define user interfaces, administrative shells, and callback behavior.
- [Application-root state](application-root-state.md) **MUST** define the Authentication-owned public values exposed through the application root.

Supabase platform configuration **MUST** be defined by [Supabase](supabase.md).

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-authentication">

The **Agent** **MUST** validate these **Rules** against the current **gPronto.Framework** source, every **gPronto.Application** listed in [Application inventory](application-inventory.md), the referenced documentation contracts, and the hosted Supabase projects when a **Rule** makes a claim about deployed state:

- `authentication.md: rule:[authentication-overview]`
- `authentication.md: rule:[scope-and-ownership]`
- `authentication.md: rule:[source-organization]`
- `authentication.md: rule:[authentication-contracts]`

For each listed **Rule**, the **Agent** **MUST** first verify that every referenced document, source file, source folder, initial SQL script, and deployed database artifact required by that **Rule** exists and then validate the **Rule** exactly as written.

When validation requires information about Supabase, the **Agent** **MUST** check the current information online.

When a validation fails, the **Agent** **MUST** mark the text containing the failed requirement by applying `documentation.md: rule:[documentation-tag-requirements]`. The `agent-error-explanation` **MUST** identify every affected **gPronto.Application**, document, file, folder, hosted project, and reason for failure.

When every validation passes, the **Agent** **MUST NOT** add an `agent-error` or `agent-error-explanation` tag.

</instructions>

## Authentication contracts

Authentication is defined by four focused documents:

1. [Authentication runtime](authentication-runtime.md) defines browser storage, synchronization, and runtime state.
2. [Authentication operations](authentication-operations.md) defines the public operation interface.
3. [Authentication interface](authentication-interface.md) defines user interfaces, administrative shells, and callback behavior.
4. [Application-root state](application-root-state.md) defines the Authentication-owned public values exposed through the application root.

Supabase platform configuration is defined by [Supabase](supabase.md).

