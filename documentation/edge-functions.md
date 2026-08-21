# Edge Functions

## Status

Draft

## Scope

gPronto.Application:Ownership and location of application Supabase Edge Functions.
gPronto.Application:Required Edge Function folders, source files, handlers, and runtime behavior.
gPronto.Application:Naming requirements for Edge Function folders, files, handlers, and database functions.
gPronto.Application:Excludes database access, database naming, browser integration, and CLI authentication.

## Verification

Date: 2026-08-18

## Rules

<rule category="edge-functions">

Each **gPronto.Application** **MUST** store its local Edge Functions at its applicable repository-rooted location:

- `gPronto.Application.Backstage:supabase/functions`
- `gPronto.Application.gPrototype2:supabase/functions`
- `gPronto.Application.gPrototype3:supabase/functions`
- `gPronto.Application.gPrototype4:supabase/functions`

</rule>

<rule category="edge-function-naming" id="no-version-suffix">

In every **gPronto.Application** repository, the name of a direct-child folder of `gPronto.Application:supabase/functions` **MUST NOT** contain a hyphen-separated segment matching `^v[0-9]+$`.

</rule>

<rule category="edge-function-naming" id="function-folder-name-format">

In every **gPronto.Application** repository, the name of a direct-child folder of `gPronto.Application:supabase/functions` other than `gPronto.Application:supabase/functions/_shared` **MUST** match `^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$`.

</rule>

<rule category="edge-function-naming" id="handler-factory-name">

In every **gPronto.Application** repository, the file `gPronto.Application:supabase/functions/[FUNCTION]/handler.ts` in a direct-child folder of `gPronto.Application:supabase/functions` other than `gPronto.Application:supabase/functions/_shared` **MUST** export a function named `create[Name]Handler`, where `[Name]` is the folder name with the first letter of every hyphen-separated segment uppercased and the hyphens removed.

</rule>

<rule category="edge-function-naming" id="canonical-words">

In every **gPronto.Application** repository, a hyphen-separated segment of the name of a direct-child folder of `gPronto.Application:supabase/functions` **MUST NOT** be `org`, `organization`, `dev`, `stage`, `repo`, or `datetime`.

</rule>

<rule category="edge-function-naming" id="function-folder-location">

Every Edge Function **MUST** live in its own direct-child folder under `gPronto.Application:supabase/functions` in its **gPronto.Application** repository.

</rule>

<rule category="edge-function-naming" id="functions-folder-content">

In every **gPronto.Application** repository, `gPronto.Application:supabase/functions` **MUST** contain only Edge Function folders and one folder named exactly `gPronto.Application:supabase/functions/_shared`, and **MUST NOT** directly contain a file.

</rule>

<rule category="edge-function-naming" id="function-files">

In every **gPronto.Application** repository, every direct-child folder of `gPronto.Application:supabase/functions` other than `gPronto.Application:supabase/functions/_shared` **MUST** contain exactly two files, named `gPronto.Application:supabase/functions/[FUNCTION]/index.ts` and `gPronto.Application:supabase/functions/[FUNCTION]/handler.ts`, and **MUST NOT** contain a folder.

</rule>

<rule category="edge-function-naming" id="index-content">

After line-ending normalization and ignoring trailing newlines, the complete content of `gPronto.Application:supabase/functions/[FUNCTION]/index.ts` in every direct-child folder of `gPronto.Application:supabase/functions` other than `gPronto.Application:supabase/functions/_shared` **MUST** be exactly:

```ts
import { create[Name]Handler } from "./handler.ts";

Deno.serve(create[Name]Handler());
```

where `[Name]` is derived from the folder name as defined in `edge-functions.md: rule:[handler-factory-name]`.

</rule>

<rule category="edge-function-naming" id="shared-file-name-format">

In every **gPronto.Application** repository, the name of every file directly in `gPronto.Application:supabase/functions/_shared` **MUST** match `^[a-z][a-z0-9]*(?:-[a-z0-9]+)*\.ts$`.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-edge-functions">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current Edge Function folders, `gPronto.Application:supabase/functions/[FUNCTION]/index.ts` and `gPronto.Application:supabase/functions/[FUNCTION]/handler.ts` files, shared modules, and hosted deployment inventory. The **Agent** has approval to perform read-only inspection and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify every affected application, function, and file. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Edge Functions

## Naming rules

