# Authentication interface

## Status

Draft

## Scope

gPronto.Framework:Public Authentication **gComponents** and their user-interface behavior.
gPronto.Framework:Required application Authentication webpages and their visibility behavior.
gPronto.Framework:Public administrative-operation shells and their interim manual process.
gPronto.Framework:Authentication callback routing, verification, and result presentation.
gPronto.Framework:Excludes Authentication runtime storage and synchronization.
gPronto.Framework:Excludes public Authentication operation implementation and hosted Supabase project settings.

## Verification

Date: 2026-08-18

## Rules

<rule category="authentication-user-interfaces">

The set of public authentication **gComponents** **MUST** equal the set defined by `authentication-interface.md: variable:[authentication-interface-gcomponents]`.

Every **gPronto.Application** registers one separate webpage for each authentication **gComponent**.

Each authentication webpage **MUST** render the applicable authentication **gComponent** and **MUST** remain hidden from navigation.

Each **gPronto.Application** **MAY** select any public **gLayout** for each authentication webpage. Every authentication webpage **MUST** satisfy the general composition requirements defined by [Webpages](webpages.md). Authentication **MUST NOT** require a specific **gLayout** or other page-level composition.

The behavior is divided into these groups:

- `GComponentAuthenticationSignIn` owns its form state, validates that email and password are supplied, calls the public sign-in operation, prevents duplicate submission, and presents the native Supabase error message or a success message;
- `GComponentAuthenticationCallback` reads `token_hash` and `type` from the callback query string exactly once, calls the public verify-email-link operation automatically when both are present and the type is recognized, and reads `AuthenticationStatus` and `AuthenticationErrorMessage` to compose the loading, operation-error, or result-message **gComponent**;
- `GComponentAuthenticationLoading` is a reusable presentation **gComponent**; `GComponentAuthenticationOperationError` and `GComponentAuthenticationResultMessage` create one global transient notification in an effect and render no inline alert;
- the other ten operation-specific authentication **gComponents** own their applicable state and validation, call only their public GProntoFrameworkApplicationRootComponent authentication operation, prevent duplicate submission, provide disabled and loading states, present native operation errors with fallbacks, and present operation-specific success results;
- none of the operation-specific authentication **gComponents** navigates after success.

The email-change, password-change, reauthentication, and sign-out webpages declare `metadata.visibility` as `authenticated`. The other authentication webpages declare it as `public`. The registered-webpage routing composition enforces that visibility: an unauthenticated request for an authenticated webpage redirects to sign-in, an initializing request renders nothing, and an authenticated request renders the webpage.

</rule>

<rule category="administrative-shells">

The following public expressions exist but are not implemented:

```ts
GProntoFrameworkApplicationRootComponent.Authentication.Create.User.Function(
  email,
  password,
);

GProntoFrameworkApplicationRootComponent.Authentication.Invite.User.Function(
  email,
);

GProntoFrameworkApplicationRootComponent.Authentication.Update.User.Function(
  authUserId,
  email,
);

GProntoFrameworkApplicationRootComponent.Authentication.Delete.User.Function(
  authUserId,
);
```

Each shell throws synchronously with a descriptive `Not implemented` error.

These are administrative operations for another user. They are different from self-service sign-up and from a signed-in user changing their own email or password.

Manual Supabase Dashboard administration is the interim process. A Dashboard invitation email links to the project's configured Site URL rather than a callback webpage, so an invitation cannot complete unless the link is manually edited to the applicable environment's callback path with the same query parameters.

</rule>

<rule category="callback-behavior">

Every **gPronto.Application** registers this public callback route:

```text
/authentication/callback
```

Every redirect-based operation constructs its target from the active browser origin:

```ts
`${window.location.origin}/authentication/callback`;
```

This returns production, stage, preview, and local requests to the same origin that initiated the operation.

The authoritative application-origin and callback overview is maintained in [Supabase project catalog](supabase-project-catalog.md).

Authentication emails link to this callback webpage with `token_hash` and `type` query parameters. Visiting the webpage consumes nothing; the callback **gComponent** completes verification with one automatic `Verify.EmailLink.Function` call when it loads. An email link scanner that prefetches the link consumes nothing, because a prefetch does not execute JavaScript.

A token hash is verified exactly once. Loading the callback again with a consumed `token_hash` re-attempts the verification and presents the native Supabase error while any established session remains signed in.

The Supabase flow type remains `implicit` and `detectSessionInUrl` remains enabled, so a link that carries session tokens in a URL fragment is still processed automatically. There is no `Authentication.Complete.Callback.Function()`.

The callback webpage displays one of these messages:

- `Completing authentication.`
- `Authentication completed.`
- `No authenticated session was received.`
- `The email verification link is invalid.` — when `token_hash` is present but the type is missing or unrecognized
- the native verification error message, with the fallback `Email verification failed.`
- the current authentication error message.

The callback webpage does not navigate elsewhere after completion.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-authentication-interface">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current public authentication **gComponents**, registered webpages, routing visibility, administrative shell, and callback source. The **Agent** has approval to inspect those sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify the affected interface and current evidence. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Authentication user interfaces

## Administrative shells

## Callback behavior

## Variables

<variable id="authentication-operation-gcomponents">

- `GComponentAuthenticationCallback`
- `GComponentAuthenticationEmailChange`
- `GComponentAuthenticationEmailConfirmationResend`
- `GComponentAuthenticationInvitationAcceptance`
- `GComponentAuthenticationMagicLinkRequest`
- `GComponentAuthenticationPasswordChange`
- `GComponentAuthenticationPasswordRecoveryRequest`
- `GComponentAuthenticationPasswordReset`
- `GComponentAuthenticationReauthentication`
- `GComponentAuthenticationSignIn`
- `GComponentAuthenticationSignOut`
- `GComponentAuthenticationSignUp`

</variable>

<variable id="authentication-interface-gcomponents">

- Every **gComponent** defined by `authentication-interface.md: variable:[authentication-operation-gcomponents]`.
- `GComponentAuthenticationLoading`
- `GComponentAuthenticationOperationError`
- `GComponentAuthenticationResultMessage`

</variable>

