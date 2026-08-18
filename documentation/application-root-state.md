# Application-root state

## Status

Draft

## Scope

gPronto.Framework:The public `User`, `Organisation`, and `Session` fields, defaults, and mutability.
gPronto.Framework:Direct assignment of public `User` and `Organisation` fields.
gPronto.Framework:Persistence and publication of Authentication-owned public values.
gPronto.Framework:Cross-tab replacement of persisted public values.
gPronto.Framework:Synchronization and trust characteristics of `Session.SessionId`.
gPronto.Framework:Excludes the complete application-root API.
gPronto.Framework:Excludes public Authentication operations and Authentication event sequencing.

## Verification

Date: 2026-08-17

## Rules

<rule category="public-user-organisation-and-session-values" id="public-user-organisation-and-session-values">

The following objects always exist:

```ts
GProntoFrameworkApplicationRootComponent.User;
GProntoFrameworkApplicationRootComponent.Organisation;
GProntoFrameworkApplicationRootComponent.Session;
```

They are never `null`. Every property is a string and defaults to `"-"`.

The `User` properties are:

```text
UserId
AuthUserId
Email
FirstName
LastName
Role
RoleApplication
RolePrototype
OrganisationId
ProfileUrl
Language
Locale
CurrencyCode
DateFormat
DatetimeFormat
CurrencyFormat
Blocked
CanInitiate
CanProcess
Kyc
Settings
```

The `Organisation` properties are:

```text
OrganisationId
Name
Type
ProfileUrl
Kyb
Settings
```

The `Session` properties are:

```text
SessionId
```

Every `User` and `Organisation` property is readable and writable. `Session.SessionId` is readable and readonly.

A **gPronto.Application** may read an individual property directly and may assign an individual `User` or `Organisation` property directly:

```ts
const email = GProntoFrameworkApplicationRootComponent.User.Email;
const sessionId = GProntoFrameworkApplicationRootComponent.Session.SessionId;

GProntoFrameworkApplicationRootComponent.User.Email = "person@example.com";
```

An assignment to a `User` or `Organisation` property **MUST** be a string. A non-string assignment throws a `TypeError`.

An individual assignment updates only the framework's browser state.

An assignment whose value equals the current value of that property does nothing.

An assignment whose value differs from the current value of that property:

1. writes the complete next `User`, `Organisation`, and `Session` JSON envelope to `localStorage`;
2. publishes an immutable in-memory snapshot;
3. causes React subscribers to update;
4. becomes visible to other tabs through the browser `storage` event.

An individual `User` or `Organisation` assignment preserves every current `Session` value.

An assignment does not read or write a database row.

When two tabs assign different values at nearly the same time, the last completed `localStorage` write wins.

Authentication state replacement validates every `User`, `Organisation`, and `Session` property as a string, writes the complete JSON envelope, and publishes one immutable snapshot.

A successful Authentication hydration sets `Session.SessionId` from the validated `session.session_id` response value. A matching cached `Session.SessionId` may remain visible while hydration is pending. A changed user, a hydration failure, or Authentication clearing the public state resets `Session.SessionId` to `"-"`.

An Authentication identity-only update preserves the current `Session.SessionId`.

The stored `Session.SessionId` is browser-controlled cached state. It **MUST NOT** be treated as authoritative proof of a Supabase session or database Authorization.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-application-root-state">

The **Agent** **MUST** validate this **Rule** against the current **gPronto.Framework** source:

- `application-root-state.md: rule:[public-user-organisation-and-session-values]`

The **Agent** **MUST** validate the referenced **Rule** exactly as written.

When validation fails, the **Agent** **MUST** mark the text containing the failed requirement by applying `documentation.md: rule:[documentation-tag-requirements]`. The `agent-error-explanation` **MUST** identify every affected **gPronto.Framework** file and reason for failure.

When validation passes, the **Agent** **MUST NOT** add an `agent-error` or `agent-error-explanation` tag.

</instructions>

