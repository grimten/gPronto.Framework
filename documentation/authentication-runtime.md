# Authentication runtime

## Status

Draft

## Scope

gPronto.Framework:Browser storage of Authentication-owned public state.
gPronto.Framework:Cross-tab synchronization of stored Authentication state.
gPronto.Framework:Supabase session observation and Authentication event handling.
gPronto.Framework:Database hydration of the current user and organisation.
gPronto.Framework:Authentication status transitions and error-message publication.
gPronto.Framework:Runtime subscription, scheduling, retry, and cleanup ownership.
gPronto.Framework:Excludes public Authentication operations and user interfaces.
gPronto.Framework:Excludes hosted Supabase project settings.

## Verification

Date: 2026-08-18

## Rules

<rule category="framework-local-storage">

The framework public-property cache uses one browser key:

```text
gPronto.Framework.LocalStorage
```

Its envelope is JSON with this logical shape:

```json
{
  "Version": 1,
  "Format": "PlainJson",
  "Payload": {
    "User": {},
    "Organisation": {}
  }
}
```

The complete `User` and `Organisation` payload is stored together.

Missing storage, malformed JSON, a missing payload, non-object `User` or `Organisation` values, missing fields, and non-string field values are normalized to the applicable `"-"` defaults. The normalized envelope is then written back.

An explicitly supplied unsupported numeric `Version` or unsupported string `Format` throws. A browser storage access, read, serialization, or write error also throws.

No authentication status or error message is persisted in this envelope. Every fresh runtime begins with `AuthenticationStatus = "Initializing"`.

The stored user and organisation values are browser-controlled cached values. They are not authoritative for database Authorization and must never be trusted by RLS policies.

When another document under the same origin clears browser storage, receiving tabs handle the browser `storage` event and reset their `User` and `Organisation` values to defaults. It does not change `AuthenticationStatus`, because no Supabase authentication event fires. The Supabase client keeps its in-memory session while the public values show defaults. A later `TOKEN_REFRESHED` or `USER_UPDATED` event restores only `User.AuthUserId` and `User.Email`; it does not perform database hydration. A reload with a persisted session performs the forced `INITIAL_SESSION` hydration, while a reload without a persisted session starts `SignedOut`.

The document that performs `localStorage.clear()` does not receive its own `storage` event. Its in-memory public values therefore remain unchanged until another framework state change or reload. If the Auth identifier and email already match, an identity-only event performs no write and does not recreate the cleared envelope.

The envelope is intentionally versioned and carries a format marker so a later storage format, including encryption, can be introduced through an explicit migration.

</rule>

<rule category="authentication-synchronization">

The authentication runtime can replace the complete `User` and `Organisation` values in one operation.

Before publication, it validates every property as a string. It then writes the complete JSON envelope first and publishes one immutable snapshot. This causes one React update and one cross-tab storage update.

The public-properties store reads and normalizes the cached values synchronously during module initialization. Those values are visible while Authentication is `Initializing`.

For an authenticated `INITIAL_SESSION`, the framework compares the cached `User.AuthUserId` with the current Supabase Auth user id. Matching cached values remain visible until hydration completes, with the session identity fields updated if necessary. Mismatched cached values are synchronously replaced with fresh defaults seeded only with:

```ts
User.AuthUserId = session.user.id;
User.Email = session.user.email ?? "-";
```

This replacement completes before `AuthenticationStatus` becomes `SignedIn`, so a previous user's cached values are never exposed as the signed-in state of the current user.

The Supabase auth callback remains synchronous. It reserves hydration synchronously and schedules the database work with a later task after the callback has returned. The framework reserves and schedules this no-argument RPC once for an authenticated initial session:

```text
public.get_gpronto_framework_application_root_properties_version_1()
```

The response is treated as untrusted. It must be a version-1 object with a user object; valid UUID strings for the public user id and Auth user id; an Auth user id equal to the latest session user id; string first and last names; a role equal to `standard` or `admin`; nullable string application roles; a nullable UUID organisation id; and either a null organisation or an organisation with a valid UUID, string name, and string type. A returned organisation id must equal the user's organisation id, and an organisation object is invalid when the user's organisation id is null.

After complete validation, the framework starts with fresh defaults and maps only these values:

| Framework property            | Source                                                     |
| ----------------------------- | ---------------------------------------------------------- |
| `User.UserId`                 | returned `user.id`                                         |
| `User.AuthUserId`             | latest `session.user.id`                                   |
| `User.Email`                  | latest `session.user.email ?? "-"`                         |
| `User.FirstName`              | returned `user.first_name`                                 |
| `User.LastName`               | returned `user.last_name`                                  |
| `User.Role`                   | returned `user.role`                                       |
| `User.RoleApplication`        | returned `user.role_application`, or the framework default |
| `User.RolePrototype`          | returned `user.role_prototype`, or the framework default   |
| `User.OrganisationId`         | returned `user.organisation_id`, or the framework default  |
| `Organisation.OrganisationId` | returned `organisation.id`                                 |
| `Organisation.Name`           | returned `organisation.name`                               |
| `Organisation.Type`           | returned `organisation.organisation_type`                  |

Every unmapped property remains at its framework default. A null organisation leaves every `Organisation` property at its default. The complete mapped state is persisted and published once.

An RPC error, SQL null, unsupported response version, malformed field, mismatched Auth user id, or inconsistent user and organisation ids is a hydration failure. For the still-active matching session, the framework publishes fresh session-identity defaults and keeps Authentication `SignedIn`. The first later distinct same-user `SIGNED_IN` event reserves the authentication episode's one automatic retry. Persistent failure does not produce an unbounded retry loop.

Every scheduled or running request belongs to one user id and one generation. Sign-out, a changed user, forced password-recovery hydration, or final runtime shutdown invalidates older work. A stale task is checked before the RPC and exits without making the call; a stale completion is ignored without changing current state. Completion always uses the latest session email, so an older response cannot overwrite a concurrent `USER_UPDATED` value.

The function can hydrate an organisation only when `public.users.organisation_id` points to an active visible `public.organisations` row. A missing, deleted, or unlinked organisation leaves the organisation defaults. The current Auth synchronization trigger does not copy the `organisation_id` held in Auth user metadata into `public.users`, so a newly signed-up or invited user remains unlinked until another process fills that column.

On `SIGNED_OUT`, or `INITIAL_SESSION` without a session, the complete `User` and `Organisation` state is reset to defaults.

</rule>

<rule category="runtime-state">

The public runtime state is:

```ts
GProntoFrameworkApplicationRootComponent.AuthenticationStatus;
GProntoFrameworkApplicationRootComponent.AuthenticationErrorMessage;
```

`AuthenticationStatus` is exactly one of:

```text
Initializing
SignedOut
SignedIn
Failure
```

`AuthenticationErrorMessage` is a string and defaults to `"-"`.

The runtime subscribes to Supabase `onAuthStateChange` after the public root mounts. It handles:

```text
INITIAL_SESSION
SIGNED_IN
SIGNED_OUT
TOKEN_REFRESHED
USER_UPDATED
PASSWORD_RECOVERY
MFA_CHALLENGE_VERIFIED
```

A new real runtime begins as `Initializing`. Its auth callback is synchronous and never calls or awaits a Supabase API. When an event requires hydration, the callback reserves the request before returning and a later task performs the RPC.

The handled events behave as follows:

| Event                                                   | Behavior                                                                                                                                              |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `INITIAL_SESSION` without a session                     | Invalidate work, publish complete defaults, then become `SignedOut`; no RPC.                                                                          |
| `INITIAL_SESSION` with a session                        | Preserve matching cached values or replace mismatched values with session-identity defaults, then become `SignedIn`; force one deferred hydration.    |
| `SIGNED_IN` for a different user                        | Invalidate older work, publish session-identity defaults, then become `SignedIn`; defer one hydration.                                                |
| `SIGNED_IN` for the same user                           | Preserve values and update identity fields; deduplicate a pending call, skip after success, or reserve the one allowed automatic retry after failure. |
| `PASSWORD_RECOVERY` with a session                      | Preserve matching values or reset for a changed user, then become `SignedIn`; force one deferred hydration that supersedes older work.                |
| `TOKEN_REFRESHED` with the active user's session        | Preserve current values and update only changed session identity fields; no RPC.                                                                      |
| `USER_UPDATED` with the active user's session           | Preserve current values and set identity fields from the latest session; no RPC.                                                                      |
| `MFA_CHALLENGE_VERIFIED` with the active user's session | Preserve values and update identity fields; no RPC.                                                                                                   |
| `MFA_CHALLENGE_VERIFIED` for a different user           | Follow the different-user `SIGNED_IN` behavior and defer one hydration.                                                                               |
| `SIGNED_OUT`                                            | Invalidate work, publish complete defaults, then become `SignedOut`; no RPC.                                                                          |

A session-bearing event received without a session and every future event not listed above is ignored. A different-user `TOKEN_REFRESHED` or `USER_UPDATED` is also ignored without changing public values, Authentication status, or request ownership.

React Router navigation, rendering, ordinary rerendering, and React Strict Mode setup-cleanup-setup cycles do not schedule hydration. The runtime reserves request ownership before deferral, deduplicates requests for the same user, and invalidates ownership when the final consumer stops.

An error thrown while processing a recognized event sets the status to `Failure` and exposes the error message, or `"Authentication failed."` when no readable `Error` message exists.

An error while committing a hydration state replacement may also set `Failure`. An ordinary RPC error or response-validation failure instead publishes session-identity defaults and leaves the status `SignedIn`.

Ordinary Supabase operation rejections do not set this runtime status to `Failure`. They are returned through the operation's native Supabase `error` value.

The runtime keeps one active subscription and one instance-scoped synchronization controller for the client. It counts consumers so React development remounting does not leave duplicate active subscriptions or shared request state. The controller is stopped and pending work is invalidated before the subscription is removed when the final consumer unmounts.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-authentication-runtime">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current Authentication runtime, session hydration, storage, synchronization, and state source. The **Agent** has approval to inspect those sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify the runtime behavior and current evidence. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Framework localStorage

## Authentication synchronization

## Runtime state
