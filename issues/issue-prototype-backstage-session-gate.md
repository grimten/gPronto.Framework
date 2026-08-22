# Require a Backstage session before showing a prototype

## User instruction

This is what we need to do.

The complete public functionality must be provided by **gPronto.Framework**. Nothing may be added to a **gPronto.Application**.

When an application starts, a setting in its environment file states whether the application is a **gPronto.Application.Prototype** or the **gPronto.Application.Backstage**.

When any webpage in any **gPronto.Application.Prototype** is visited and there is no active **gPronto.Application.Backstage** session, the visitor is redirected from the **gPronto.Application.Prototype** to the **gPronto.Application.Backstage** sign-in webpage.

How that is implemented does not matter. Existing functionality and new functionality are both acceptable.

The implementation must be as easy and as quick as possible. It must not be complex. It must not be over-engineered. It must be straightforward. We implement it now and then never think about it again.

If this requires an Edge Function, an Edge Function may be used, but not using one is preferred.

## Status

Ready for implementation.

## Outcome

A visitor who is not signed in to **gPronto.Application.Backstage** cannot see any webpage of any **gPronto.Application.Prototype**. The visitor is sent to the **gPronto.Application.Backstage** sign-in webpage instead.

This is separate from signing in as a **Mock user** inside a **gPronto.Application.Prototype**. A prototype Supabase session, a browser storage value, or a **Mock user** never satisfies this gate.

## Change boundary

Modify only files in `gPronto.Framework:gPronto.Framework`.

Do not modify a **gPronto.Application** file, an environment file, an Edge Function, an initial SQL script, or a hosted Supabase setting. Do not create a new Edge Function.

## What already exists

The server side is complete and deployed. Reuse it.

`gPronto.Application.Backstage:supabase/functions/grimten-sso-issue/handler.ts` validates the signed-in Backstage Supabase user and returns the shared cookie `__Secure-grimten_session` in a `Set-Cookie` response header. The cookie is an opaque 256-bit token and is parent-domain, `Path=/`, `HttpOnly`, `Secure`, `SameSite=Lax`, with a bounded `Max-Age`. Only its SHA-256 hash is stored, in `public.grimten_sso_sessions`.

`gPronto.Application.Backstage:supabase/functions/grimten-sso-session/handler.ts` exposes `GET` to check the cookie-backed session, `POST` to renew it, and `DELETE` to revoke it and clear the cookie. `GET` returns `active: true` or `active: false`. It uses credentialed CORS restricted to the origins in `GRIMTEN_SSO_ALLOWED_ORIGINS`, and its runtime JWT precheck is disabled, so a prototype browser can call it without a Supabase key.

`gPronto.Application.Backstage:supabase/functions/domain-user-presence/handler.ts` already calls the same session check and rejects an inactive session with HTTP `401`, so the mechanism is proven for credentialed requests from prototype origins.

The Backstage browser trigger exists only in the 2026-07-14 backup as `syncGrimtenSso()`. Use it as the reference for the Backstage half.

`C:/Backup/Backstage- 2026-07-14 09 47 42/Backstage/src/framework/auth/grimtenSso.ts`

The cookie is `HttpOnly`, so browser JavaScript cannot read it and no local check is possible. The credentialed request to the existing endpoint is the check. No new Edge Function is written.

## Implementation

### 1. Application type

**gPronto.Framework** reads the application type itself:

```ts
import.meta.env.GPRONTO_APPLICATION_TYPE;
```

Every application `gPronto.Application:vite.config.ts` already sets `envPrefix: ["VITE_", "GPRONTO_"]`, and every application environment file already defines `gPronto.Application:.env variable:[GPRONTO_APPLICATION_TYPE]`, so no application file changes.

Accept exactly `BACKSTAGE` or `PROTOTYPE`. Any other value stops startup with an explicit error.

Do not add the value to the bootstrap request. `application-bootstrap.md: rule:[bootstrap-request]` states that the bootstrap request must contain exactly `styling`, `supabase`, and `webpageModules`, and adding a field would change all four applications.

### 2. Prototype gate

When the application type is `PROTOTYPE`, **gPronto.Framework** runs one check before it renders any webpage content:

1. render nothing while the check is running;
2. send `GET` to the existing `grimten-sso-session` endpoint with `credentials: "include"`;
3. render the application only when the response is successful and its `active` value is `true`;
4. in every other case, including `active: false`, a failed request, a network failure, and a malformed response, call `window.location.replace()` with the Backstage sign-in URL.

The check runs once, at startup. It fails closed.

### 3. Backstage cookie

When the application type is `BACKSTAGE`, **gPronto.Framework** keeps the shared cookie in step with the existing Supabase authentication state:

- an authenticated session sends one credentialed `POST` to `grimten-sso-issue` with the Supabase access token, and the browser accepts the returned cookie;
- signing out sends one credentialed `DELETE` to `grimten-sso-session`, and the browser clears the cookie.

Place this in the existing framework Authentication flow, beside the current session handling.

### 4. Configuration

Hold two values as constants in **gPronto.Framework** source:

- the Backstage Supabase functions base URL, built from `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_URL]`;
- the Backstage sign-in URL `https://grimten.com/authentication/sign-in`.

Do not add an environment variable, a bootstrap field, or a settings file. Adding one would require a change in every **gPronto.Application**.

## Decisions

- Return path. The redirect goes to the Backstage sign-in URL only. The original prototype URL is not preserved and the visitor is not returned automatically.
- Authorization. The gate confirms only that a Backstage session is active. It does not check that the Backstage user is authorized for the requested prototype.
- Recheck. The gate runs once at startup. There is no periodic recheck while a prototype stays open. A revoked or expired session blocks the next load.
- Hosting layer. The gate is a browser gate only. Prototype source files and static assets remain served without access control.
- Edge Functions. No Edge Function is created. The deployed `grimten-sso-issue` and `grimten-sso-session` are called as they are.

## Out of scope

Hosting-level access control, session renewal from a prototype, per-prototype authorization, returning the visitor to the original prototype URL, changes to the cookie or its Edge Functions, and every **Mock user** behavior inside a prototype.

## Verification

Run the existing **gPronto.Framework** type-check and build, followed by the existing type-check and build commands in all four **gPronto.Application** repositories.

Then check these cases in one **gPronto.Application.Prototype**:

1. no shared cookie takes the visitor to the Backstage sign-in webpage, and no prototype content appears first;
2. an active Backstage session shows the prototype;
3. Backstage sign-out blocks the prototype on its next load;
4. a nested prototype URL entered directly is gated in the same way;
5. **gPronto.Application.Backstage** itself is never gated.

## Acceptance criteria

Implementation is complete when **gPronto.Framework** reads the application type from the environment without any application change, sets and clears the shared cookie from Backstage authentication changes, checks the existing session endpoint before rendering any prototype webpage, sends an inactive visitor to the Backstage sign-in URL, shows no prototype content before the check completes, and every verification case passes.
