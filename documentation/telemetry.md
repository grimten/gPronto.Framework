# Telemetry

## Status

Draft

## Scope

gPronto.Framework:UUID requirements shared by telemetry records.
gPronto.Framework:Browser-error telemetry capture, persistence, deduplication, and retry behavior.
gPronto.Framework:**User**-event telemetry for page visits and button clicks.
gPronto.Framework:**User**-session heartbeat creation, refresh, retry, and stop behavior.
gPronto.Framework:Telemetry runtime startup and lifetime ownership.
gPronto.Framework:Excludes database table schemas and browser-log file locations.

## Verification

Date: 2026-08-18

## Rules

<rule category="uuid">

For every telemetry **Rule**, a valid UUID **MUST** match `^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$` with case-insensitive matching. Every other string **MUST** be an invalid UUID.

</rule>

<rule category="browser-errors">

The browser-error telemetry runtime **MUST** register one window listener for `error` and one window listener for `unhandledrejection`. It **MUST NOT** register a listener for another event name.

</rule>

<rule category="browser-errors">

Browser-error telemetry **MUST NOT** insert a row unless authentication status is `SignedIn` and `auth_user_id` is a valid UUID.

</rule>

<rule category="browser-errors">

A browser-error telemetry row **MUST** contain every value listed in the browser-error telemetry table.

</rule>

<rule category="user-events">

`GProntoFrameworkUserEvent` **MUST** permit exactly the `event_type` values `page_visit` and `button_click`.

</rule>

<rule category="user-events">

**User**-event telemetry **MUST NOT** insert a row unless authentication status is `SignedIn`, `session_id` is a valid UUID, and `actor_user_id` is a valid UUID.

</rule>

<rule category="user-events">

Two consecutive `page_visit` events with the same `key` **MUST** produce at most one row.

</rule>

<rule category="user-events">

A `button_click` row **MUST** use the most recently recorded `page_id`, or `null` when no page visit has been recorded.

</rule>

<rule category="heartbeat">

The heartbeat interval **MUST** be 30 seconds.

The heartbeat runtime **MUST NOT** call `upsert` unless recorded activity is pending, no heartbeat request is in flight, authentication status is `SignedIn`, `user_id` is a valid UUID, and `session_id` is a valid UUID.

A heartbeat **MUST** upsert on the conflict target `user_id,session_id` and **MUST** set `is_deleted` to `false`.

When the heartbeat upsert returns a non-null error or throws, `hadActivity` **MUST** be `true` after the request finishes. The next 30-second interval that satisfies every heartbeat condition **MUST** attempt another upsert.

</rule>

<rule category="runtime-lifetime">

Each telemetry runtime **MUST** have at most one active Supabase client. Starting an active telemetry runtime with a different Supabase client **MUST** throw an `Error`.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-telemetry">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current browser-error, user-event, heartbeat, session, and runtime-lifetime sources. The **Agent** has approval to inspect and type-check those sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify the event, table, interval, listener, or lifecycle behavior that fails. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Browser-error telemetry

The browser-error runtime listens for the window events `error` and `unhandledrejection`.

It writes one row to `logs` with this shape:

| Column           | Value                             |
| ---------------- | --------------------------------- |
| `log_category`   | `-`                               |
| `level`          | `-`                               |
| `source`         | `-`                               |
| `auth_user_id`   | Authenticated user UUID           |
| `actor_user_id`  | **User** UUID or `null`           |
| `message`        | Error message or fallback message |
| `error_code`     | Error name or `-`                 |
| `event`          | `error` or `unhandledrejection`   |
| `metadata.route` | Current pathname                  |
| `metadata.stack` | Error stack or `null`             |

The runtime writes only when authentication status is `SignedIn` and `auth_user_id` is a valid UUID. A missing valid `actor_user_id` becomes `null`.

The runtime reports a skipped write or a failed write through `console.error`. Every failed insert or thrown insert increments the internal failed-write count.

## User-event telemetry

The user-event runtime supports exactly two event types:

| Event          | Required values                                          |
| -------------- | -------------------------------------------------------- |
| `page_visit`   | `key`, `page_id`, `route`, `session_id`, `actor_user_id` |
| `button_click` | `route`, `session_id`, `actor_user_id`, `metadata.text`  |

The runtime writes only when it is active, authentication status is `SignedIn`, and both `session_id` and `actor_user_id` are valid UUIDs.

A `page_visit` writes `event_type`, `page_id`, `route`, `session_id`, and `actor_user_id` to `user_events`. Two consecutive page visits with the same `key` produce one row.

A `button_click` writes `event_type`, the most recently recorded `page_id` or `null`, `route`, `session_id`, `actor_user_id`, and `metadata` to `user_events`.

Every failed insert or thrown insert increments the internal failed-write count and writes an error to `console.error`.

## User-session heartbeat

The heartbeat runtime listens for `pointerdown`, `keydown`, `scroll`, and `touchstart`.

Every 30 seconds, the runtime attempts a heartbeat only when all of these conditions are true:

- the runtime is active;
- activity has occurred since the last successful heartbeat;
- no heartbeat request is in flight;
- authentication status is `SignedIn`;
- `user_id` is a valid UUID;
- `session_id` is a valid UUID.

The runtime upserts one `user_sessions` row with this shape:

| Column         | Value                                           |
| -------------- | ----------------------------------------------- |
| `user_id`      | Current user UUID                               |
| `session_id`   | Current session UUID                            |
| `last_seen_at` | Current ISO timestamp                           |
| `is_visible`   | Whether `document.visibilityState` is `visible` |
| `is_deleted`   | `false`                                         |

The conflict target is `user_id,session_id`. A failed or thrown upsert preserves pending activity so that a later interval can retry. A successful upsert clears pending activity only when no newer activity occurred during the request.

## Runtime lifetime

Each telemetry runtime has at most one active client. Starting an active runtime with the same client adds one consumer. Starting it with a different client throws an error. The runtime stops only after every consumer has stopped.

