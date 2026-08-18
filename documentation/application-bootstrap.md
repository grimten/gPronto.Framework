# Application bootstrap

## Status

Draft

## Scope

gPronto.Application:The application HTML entry.
gPronto.Application:The application TypeScript configuration.
gPronto.Application:The application Vite configuration.
gPronto.Application:The single browser source entry point.
gPronto.Application:Browser environment variables and the request passed to the framework bootstrap.
gPronto.Application:Webpage-module discovery and required bootstrap webpages.
gPronto.Application:Excludes repository structure and dependency versions.
gPronto.Application:Excludes the internal implementation of framework initialization.

## Verification

Date: 2026-08-17

## Rules

<rule category="html-entry" id="index-html-content">

Create the expected `gPronto.Application:index.html` by replacing `[APPLICATION NAME]` in the [canonical `gPronto.Application:index.html` template](assets/gpronto.application/index.html.template) with the Application Name from [Application inventory](application-inventory.md). After converting CRLF line endings to LF and removing trailing newline characters, `gPronto.Application:index.html` **MUST** exactly match that expected content.

</rule>

<rule category="typescript-configuration" id="tsconfig-content">

After converting CRLF line endings to LF and removing trailing newline characters, `gPronto.Application:tsconfig.json` **MUST** exactly match the [canonical `gPronto.Application:tsconfig.json`](assets/gpronto.application/tsconfig.json).

</rule>

<rule category="vite-configuration" id="vite-content">

Create the expected `gPronto.Application:vite.config.ts` by replacing `[DEVELOPMENT PORT]` and `[PREVIEW PORT]` in the [canonical `gPronto.Application:vite.config.ts` template](assets/gpronto.application/vite.config.ts.template) with the ports from [Deployments](deployments.md). After converting CRLF line endings to LF and removing trailing newline characters, `gPronto.Application:vite.config.ts` **MUST** exactly match that expected content.

</rule>

<rule category="source-files" id="required-source-file-content">

Every **gPronto.Application** **MUST** contain exactly one direct-child file under `gPronto.Application:src`:

- `gPronto.Application:src/gPronto.Application.Bootstrap.EntryPoint.ts`

`gPronto.Application:src` **MUST NOT** contain another direct-child file.

After converting CRLF line endings to LF and removing trailing newline characters, `gPronto.Application:src/gPronto.Application.Bootstrap.EntryPoint.ts` **MUST** exactly match the [canonical `gPronto.Application:src/gPronto.Application.Bootstrap.EntryPoint.ts`](assets/gpronto.application/src/gPronto.Application.Bootstrap.EntryPoint.ts).

</rule>

<rule category="browser-bootstrap" id="bootstrap-request">

`gPronto.Application:src/gPronto.Application.Bootstrap.EntryPoint.ts` **MUST** import `bootstrapGProntoFrameworkApplication` from `@gpronto.framework` and call it exactly once.

The bootstrap request **MUST** contain exactly `styling`, `supabase`, and `webpageModules`.

`styling` **MUST** be `import.meta.env.GPRONTO_STYLING`.

`supabase` **MUST** contain exactly `SupabaseUrl: import.meta.env.VITE_SUPABASE_URL` and `SupabasePublishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY`.

`webpageModules` **MUST** be the result of eagerly importing every file matching `gPronto.Application:src/webpages/**/webpage.tsx` with `import.meta.glob`.

</rule>

<rule category="environment" id="env-variables">

The application environment file **MUST** define exactly these three variables: `gPronto.Application:.env variable:[GPRONTO_STYLING]`, `gPronto.Application:.env variable:[VITE_SUPABASE_URL]`, and `gPronto.Application:.env variable:[VITE_SUPABASE_PUBLISHABLE_KEY]`.

</rule>

<rule category="webpage-registration" id="required-webpages">

Every **gPronto.Application** **MUST** contain the webpage folder `gPronto.Application:src/webpages/home.webpage` directly under `gPronto.Application:src/webpages`.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-application-bootstrap">

The **Agent** **MUST** validate these **Rules** against every **gPronto.Application** listed in [Application inventory](application-inventory.md):

- `application-bootstrap.md: rule:[index-html-content]`
- `application-bootstrap.md: rule:[tsconfig-content]`
- `application-bootstrap.md: rule:[vite-content]`
- `application-bootstrap.md: rule:[required-source-file-content]`
- `application-bootstrap.md: rule:[bootstrap-request]`
- `application-bootstrap.md: rule:[env-variables]`
- `application-bootstrap.md: rule:[required-webpages]`

For each listed **Rule**, the **Agent** **MUST** first verify that every canonical asset referenced by that **Rule** exists and then validate the **Rule** exactly as written.

When a validation fails, the **Agent** **MUST** mark the text containing the failed requirement by applying `documentation.md: rule:[documentation-tag-requirements]`. The `agent-error-explanation` **MUST** identify every affected **gPronto.Application**, file or folder, and reason for failure.

When every validation passes, the **Agent** **MUST NOT** add an `agent-error` or `agent-error-explanation` tag.

</instructions>

## Browser bootstrap

The browser loads `gPronto.Application:index.html`, which loads `gPronto.Application:src/gPronto.Application.Bootstrap.EntryPoint.ts`.

The application entry point supplies styling, Supabase configuration, and the eagerly discovered webpage modules to the public `bootstrapGProntoFrameworkApplication` function. It does not create the React root, build the webpage registry, construct the application definition, or render the application root component.

**gPronto.Framework** owns those operations. Its bootstrap function starts the notification runtime, prevents a second bootstrap of the same browser document, retrieves the `root` element, resolves the selected styling, validates the Supabase configuration, creates the registered-webpage registry from the supplied modules, constructs the application definition, creates the React root, and renders `GProntoFrameworkApplicationRootComponent` in React Strict Mode inside the framework notification error wrapper.

