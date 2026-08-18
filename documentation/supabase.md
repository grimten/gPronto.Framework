# Supabase

## Status

Draft

## Scope

gPronto.Application:Supabase organization, hosted-project ownership, and prohibition of local project copies.
gPronto.Application:Application project linking and browser-safe configuration values.
gPronto.Application:Shared browser-client creation, validation, and ownership.
gPronto.Application:Hosted project and browser Authentication configuration.
gPronto.Application:Refine Supabase data-provider registration and session sharing.
gPronto.Application:Excludes CLI procedures, database access, database naming, and Edge Function requirements.

## Verification

Date: 2026-08-18

## Rules

<rule category="supabase-environment">

Local copies of Supabase **MUST NOT** be used.

</rule>

<rule category="supabase-information">

When information is needed about Supabase, the information **MUST** be checked online.

</rule>

<rule category="supabase-linking">

Projects **MUST NOT** be linked to Supabase.

</rule>

<rule category="application-configuration">

GProntoFrameworkApplicationDefinition requires:

```ts
{
  webpages: GProntoFrameworkRegisteredWebpageDefinitionRegistry;
  supabase: {
    SupabaseUrl: string;
    SupabasePublishableKey: string;
  }
}
```

Each **gPronto.Application** supplies the shared Supabase values from:

```ts
import.meta.env.VITE_SUPABASE_URL;
import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
```

For local development, those values belong in `gPronto.Application:.env variable:[VITE_SUPABASE_URL]` and `gPronto.Application:.env variable:[VITE_SUPABASE_PUBLISHABLE_KEY]`. Every application ignores `gPronto.Application:.env`; its contents are not committed or reproduced in this document. Deployed applications supply the same values through their hosting environment. No `gPronto.Application:.env.example` file is part of the design.

The framework validates both values during root-component rendering.

The URL and publishable key must be non-empty strings. The URL must be a valid HTTP or HTTPS URL. Invalid configuration throws immediately and prevents startup. Initializing the client again with different configuration also throws.

These browser environment values may contain only the Supabase project URL and publishable key. They must never contain a secret key, service-role key, database password, SMTP password, Management API token, or another privileged credential.

`@supabase/supabase-js` is pinned at exactly `2.112.1` in every **gPronto.Application** package and lockfile.

</rule>

<rule category="supabase-browser-client">

One module-level Supabase browser client is created for the running **gPronto.Application**. The client belongs to the shared Supabase subsystem rather than to Authentication. Authentication and the Refine Supabase data provider receive the same client and share its authenticated session.

Its Auth configuration is:

```ts
{
  flowType: "implicit",
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: true,
}
```

Supabase owns access-token and refresh-token storage, session restoration, and automatic refresh. The tokens are not copied into `User`, `Organisation`, or `gPronto.Framework.LocalStorage`.

Public authentication functions obtain this one initialized shared client internally. Calling an operation before the client is initialized throws.

</rule>

<rule category="supabase-project-configuration">

All four Supabase projects have:

- the email provider enabled;
- new-user sign-up enabled;
- email confirmation enabled;
- secure email change enabled, requiring confirmation from both the current and the new email address;
- an email sending rate limit of 100 emails per hour;
- the required callback redirect URLs allowed;
- SendGrid Custom SMTP enabled.

Supabase Auth delivers the confirmation, invitation, magic-link, password-recovery, email-change, and reauthentication emails through Custom SMTP. The confirmation, invitation, magic-link, password-recovery, and email-change templates link to the callback webpage in the token-hash form `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=<type>`, with the types `signup`, `invite`, `magiclink`, `recovery`, and `email_change`. The reauthentication email delivers a code, not a link. `{{ .RedirectTo }}` is the callback URL supplied by the requesting operation, so every emailed link returns to the origin that initiated the operation.

No Send Email Auth Hook is used.

The framework `email` Edge Function is an independent trusted transactional-email endpoint. It uses `GPRONTO_EMAIL_CALLER_SECRET` and the SendGrid Web API. It is not an Auth hook and is not used by the authentication functions described here.

Explicit callback URLs are supplied by the browser operations. The exact Site URL configured in each Supabase project is not recorded in this documentation.

</rule>

<rule category="browser-configuration">

Every **gPronto.Application** **MUST** supply its own browser-safe Supabase connection values through its bootstrap request:

```ts
supabase: {
  SupabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  SupabasePublishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
}
```

**gPronto.Framework** **MUST** validate those values and create one singleton browser client for the running application. Authentication and Refine data access **MUST** use the same client and the same authenticated session.

The browser client **MUST NOT** receive anything other than a project URL and publishable key. A secret key, service-role key, database password, Management API token, or other privileged credential **MUST NOT** be present in browser source or browser environment variables.

</rule>

<rule category="browser-configuration">

`@supabase/supabase-js` **MUST** be pinned at `2.112.1` in every **gPronto.Application**.

</rule>

<rule category="refine-data-provider">

**gPronto.Framework** **MUST** use the official `@refinedev/supabase` adapter, pinned at `6.0.2`, as its initial Refine data provider.

The adapter is created from the existing singleton Supabase client. It is registered as both Refine's default data provider and the named `supabase` provider.

Every initial Supabase resource **MUST** set `meta.dataProviderName` to `supabase`, `meta.schema` to `public`, and `meta.idColumnName` to `id`. Its versioned Refine identifier **MUST** resolve to an unversioned physical Supabase table name.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-supabase">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against current framework integration source, every application configuration, current hosted Supabase Auth settings, and current Supabase platform behavior. The **Agent** has approval to perform read-only inspection and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify every affected application, source contract, or hosted setting. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Related contracts

- [Supabase CLI](supabase-cli.md) defines command-line checks, authentication, and project operations.
- [Database access](database-access.md) defines Data API exposure, privileges, RLS, roles, and database access functions.
- [Database naming](database-naming.md) defines database identifier requirements.
- [Edge Functions](edge-functions.md) defines Edge Function ownership, structure, and naming.

## Supabase organization

We use Supabase online.

Our organization is called: `grimten`.

Our organization has the id `gPronto.Framework:.env variable:[SUPABASE_ORGANIZATION_ID]` (called both `organization_id` and `organization_slug`).

## No local copies

## Linking

## Application configuration

## Supabase browser client

## Supabase project configuration

## Browser configuration

## Refine data provider

The complete provider-neutral resource, versioning, schema-metadata, and TypeScript contract is documented in [Data](data.md).

