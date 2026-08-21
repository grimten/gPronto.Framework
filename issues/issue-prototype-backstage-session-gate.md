# Require a Backstage session before showing a prototype

## Status

Ready for specification review.

## Outcome

Use the simplest framework-owned flow that does the following:

1. when a **User** is authenticated in **gPronto.Application.Backstage**, set the shared Backstage cookie;
2. when any **gPronto.Application.Prototype** starts, run one JavaScript gate before rendering its webpages;
3. when the shared cookie does not represent an active Backstage session, take the visitor to a configured Backstage sign-in URL;
4. when the session is active, continue loading the prototype.

Keep the shared implementation in **gPronto.Framework** wherever possible. Use each application's existing `GPRONTO_APPLICATION_TYPE` environment value to distinguish `BACKSTAGE` from `PROTOTYPE`.

This requirement is separate from authentication as a **Mock user** inside a prototype. A visitor who is not logged into Backstage must not be allowed to reach a prototype webpage, regardless of any prototype-local Supabase session or browser storage value.

## Current problem

The current repositories contain server-side functionality that constructs, issues, reads, renews, revokes, and clears a shared Backstage session cookie. They do not contain a prototype-side page guard that calls the server-side session check and blocks prototype rendering when the Backstage session is inactive.

The backed-up browser integration issues and clears the cookie when the Backstage Supabase authentication state changes. It does not guard prototype webpages.

The older prototype engine contains a browser-side session gate, but that gate checks a prototype-user authentication storage key in `localStorage`. It does not check the shared Backstage session and is not the required solution.

## Confirmed current functionality

### Cookie value and construction

The shared helper defines the cookie name `__Secure-grimten_session`.

`issueGrimtenSsoSession()` creates an opaque 256-bit token, stores only its SHA-256 hash in `public.grimten_sso_sessions`, and returns a cookie produced by `buildSessionCookie()`.

`buildSessionCookie()` creates a parent-domain cookie with these attributes:

- `Path=/`;
- `HttpOnly`;
- `Secure`;
- `SameSite=Lax`;
- a configured `Domain`;
- a bounded `Max-Age`.

Current source:

`gPronto.Application.Backstage:supabase/functions/_shared/grimten-sso-session.ts`

### Cookie issuance

`createGrimtenSsoIssueHandler()` validates the signed-in Backstage Supabase user and authentication session, calls `issueGrimtenSsoSession()`, and returns the cookie in the HTTP `Set-Cookie` response header.

Current source:

`gPronto.Application.Backstage:supabase/functions/grimten-sso-issue/handler.ts`

### Cookie validation and lifecycle

`checkGrimtenSsoSession()` reads exactly one `__Secure-grimten_session` value from the incoming HTTP `Cookie` header, hashes the value, looks up the corresponding session, and returns inactive when the record is missing, revoked, or expired.

`renewGrimtenSsoSession()` validates the cookie through `public.renew_grimten_sso_session` and returns a refreshed cookie when the session remains active.

`revokeGrimtenSsoSession()` marks the matching session as revoked. `buildClearedSessionCookie()` returns an expired cookie with the same parent-domain attributes.

Current source:

`gPronto.Application.Backstage:supabase/functions/_shared/grimten-sso-session.ts`

The `grimten-sso-session` Edge Function exposes:

- `GET` to check the cookie-backed session;
- `POST` to renew the session and refresh the cookie;
- `DELETE` to revoke the session and clear the cookie.

Current source:

`gPronto.Application.Backstage:supabase/functions/grimten-sso-session/handler.ts`

### Existing server consumer

The `domain-user-presence` Edge Function already calls `checkGrimtenSsoSession()` and rejects a request with HTTP `401` when the shared Backstage session is not active. This proves that the cookie can be used for server-side authentication of credentialed requests from registered prototype origins.

Current source:

`gPronto.Application.Backstage:supabase/functions/domain-user-presence/handler.ts`

## Confirmed backup functionality

### Backstage browser synchronization

The 2026-07-14 Backstage backup contains `syncGrimtenSso()`.

When it receives a Backstage Supabase session, the function sends a credentialed `POST` to the configured issue endpoint with the Backstage access token. The browser can then accept the Edge Function's `Set-Cookie` response.

When it receives no session, the function sends a credentialed `DELETE` to the configured session endpoint so the server can revoke and clear the cookie.

Backup source:

`C:/Backup/Backstage- 2026-07-14 09 47 42/Backstage/src/framework/auth/grimtenSso.ts`

The backed-up `AuthProvider` calls `syncGrimtenSso()` when its Supabase `session` or authentication `status` changes and calls it again during sign-out.

Backup source:

`C:/Backup/Backstage- 2026-07-14 09 47 42/Backstage/src/framework/auth/AuthProvider.tsx`

This functionality is the Backstage cookie trigger. It is not the prototype page gate.

### Unrelated prototype-local gate

The older prototype engine contains `ensureSession()`, which checks whether a configured prototype-user authentication key exists in `localStorage` and redirects to a prototype login page when the key is absent.

Backup source:

`C:/Backup/prototype-engine- 2026-06-15 16 53 36/prototype-engine/main/src/javascript/redirect-not-auth-prototype-users-to-login.js`

This gate is not evidence of a valid Backstage session. A browser storage value can also be created or changed by browser JavaScript, so it must not authorize access to protected prototype content.

## Missing functionality

No inspected current or backed-up prototype browser source contains a page gate that:

1. runs before protected prototype content is displayed;
2. sends a request to the central Backstage session-check endpoint with browser credentials included;
3. relies on server validation of `__Secure-grimten_session`;
4. permits rendering only when the response confirms an active session;
5. blocks or redirects when the session is absent, invalid, revoked, or expired;
6. handles network and server failures without briefly exposing protected prototype content.

The application environment files already contain `GPRONTO_APPLICATION_TYPE`, but the current application bootstrap entry points do not pass it to **gPronto.Framework**. The framework therefore cannot yet select the Backstage cookie trigger or prototype page gate from that value.

## Simplest implementation

### Framework bootstrap selection

1. Add `GPRONTO_APPLICATION_TYPE` to the existing bootstrap request.
2. Accept exactly `BACKSTAGE` or `PROTOTYPE` and stop bootstrap on another value.
3. Keep the selection and lifecycle integration in **gPronto.Framework** so individual applications do not implement their own gate.

Current application entry points to update:

- `gPronto.Application.Backstage:src/gPronto.Application.Bootstrap.EntryPoint.ts`;
- `gPronto.Application.gPrototype2:src/gPronto.Application.Bootstrap.EntryPoint.ts`;
- `gPronto.Application.gPrototype3:src/gPronto.Application.Bootstrap.EntryPoint.ts`;
- `gPronto.Application.gPrototype4:src/gPronto.Application.Bootstrap.EntryPoint.ts`.

### Backstage behavior

When the application type is `BACKSTAGE`, **gPronto.Framework** must synchronize the shared cookie with the existing Supabase authentication state:

- an authenticated session sends one credentialed `POST` to `grimten-sso-issue` with the Supabase access token;
- signing out sends one credentialed `DELETE` to `grimten-sso-session`;
- the browser accepts or clears the cookie from the Edge Function's `Set-Cookie` response.

Use the backed-up `syncGrimtenSso()` behavior as the implementation reference, but place the resulting lifecycle functionality in the current framework authentication flow.

### Prototype behavior

When the application type is `PROTOTYPE`, **gPronto.Framework** must run one gate before mounting or revealing prototype webpage content:

1. send a credentialed `GET` to the existing `grimten-sso-session` endpoint;
2. allow rendering only when the response confirms `active: true`;
3. otherwise call `window.location.replace()` with the configured Backstage sign-in URL.

The JavaScript gate cannot directly inspect `__Secure-grimten_session` because the existing cookie is intentionally `HttpOnly`. The credentialed request is the simplest safe cookie check: the browser sends the cookie and the existing Edge Function validates it.

### Configuration

Keep the existing application-type values:

- `GPRONTO_APPLICATION_TYPE=BACKSTAGE` for **gPronto.Application.Backstage**;
- `GPRONTO_APPLICATION_TYPE=PROTOTYPE` for every **gPronto.Application.Prototype**.

Add only the smallest configuration required to identify:

- the central `grimten-sso-issue` endpoint;
- the central `grimten-sso-session` endpoint;
- the Backstage sign-in URL.

Prefer framework bootstrap configuration derived from environment values over application-specific source code.

## Required behavior

1. Every **gPronto.Application.Prototype** must start in a blocking authentication-check state before rendering any prototype webpage content.
2. The gate must make a credentialed request to an approved central Backstage endpoint. The browser must attach the `HttpOnly` cookie automatically; prototype JavaScript must not read the cookie value.
3. The server must validate the opaque cookie using the existing central session records and return only the minimum session status required by the gate.
4. An active and unexpired Backstage session permits the prototype to continue rendering.
5. A missing, duplicated, invalid, revoked, or expired cookie must prevent rendering and take the visitor to the agreed Backstage sign-in flow.
6. A network failure, malformed response, CORS failure, configuration failure, or server error must fail closed and must not reveal protected prototype content.
7. The gate must apply to direct URL entry, browser refresh, and client-side navigation to every prototype webpage.
8. The gate must not use a prototype Supabase session, a **Mock user**, `localStorage`, or `sessionStorage` as proof of a Backstage session.
9. The Backstage cookie-issuance trigger must run after Backstage login so an authenticated Backstage browser receives the shared cookie required by the prototype gate.
10. Backstage sign-out must revoke and clear the shared cookie so subsequently opened or refreshed prototypes are blocked.
11. **gPronto.Framework** must own the shared Backstage synchronization and prototype gate; application repositories must only pass their environment configuration during bootstrap.
12. The first implementation must reuse the existing `grimten-sso-issue` and `grimten-sso-session` Edge Functions instead of adding another endpoint.
13. A failed prototype check must redirect using `window.location.replace()` so the blocked prototype page is not retained as the immediately previous history entry.

## Security boundary

The cookie is an authentication credential. Keep it opaque, `HttpOnly`, and unavailable to browser JavaScript. Do not place a Backstage access token, refresh token, service-role key, session hash, or authorization claim in prototype browser storage.

The prototype must not authorize access from the existence of a cookie alone. The server-side session check must confirm that the central session record is active and unexpired.

The page gate prevents the React application from rendering protected content after the page loads. If prototype source files and static assets must also be confidential, a browser-only React gate is insufficient; hosting-level access control must reject unauthorized requests before serving those resources.

## Decisions still required

- Choose the Backstage sign-in URL and how the original prototype URL is preserved for return after authentication.
- Decide whether the first implementation checks only for an active Backstage session or also verifies that the Backstage **User** is authorized for the requested prototype origin.
- Decide whether the first implementation checks only during bootstrap or periodically rechecks while a prototype remains open.
- Decide whether protection is limited to rendered webpage content or must also cover the prototype's HTML, JavaScript, static assets, and data endpoints at the hosting layer.

## Verification

Automated verification must cover every current **gPronto.Application.Prototype** and at least these cases:

1. no shared cookie blocks the page before protected content renders;
2. a valid active Backstage session allows the page;
3. an expired session blocks the page;
4. a revoked session blocks the page;
5. an invalid cookie blocks the page;
6. a duplicated cookie blocks the page;
7. a failed or malformed session-check response blocks the page;
8. direct navigation to a nested prototype URL cannot bypass the gate;
9. client-side navigation cannot bypass the gate;
10. Backstage sign-out causes the prototype to be blocked on its next validation;
11. a prototype-local Supabase session or forged browser-storage value does not satisfy the gate;
12. the browser request includes credentials without exposing the cookie to JavaScript.

## Acceptance criteria

Implementation is complete when the application type is passed through bootstrap, **gPronto.Framework** sets or clears the shared cookie from Backstage authentication changes, **gPronto.Framework** checks the existing session endpoint before rendering any prototype webpage, inactive visitors are sent to the configured Backstage sign-in URL, no protected content flashes before validation, and the automated verification passes for all current prototypes.
