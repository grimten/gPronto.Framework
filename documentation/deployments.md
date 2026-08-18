# Deployments

## Status

Draft

## Scope

gPronto.Application:Local development and preview ports for current applications.
gPronto.Application:Production and stage Cloudflare Pages projects and domains.
gPronto.Application:Cloudflare Pages environment-variable names, targets, value references, and types.
gPronto.Application:Excludes repository identity, Supabase project configuration, and deployment procedures.

## Verification

Date: 2026-08-18

## Rules

<rule category="local-deployments" id="local-port-inventory">

Every local development and preview port **MUST** equal the value in the `Local ports` table, and every application-port pair **MUST** be unique within its mode.

</rule>

<rule category="hosted-deployments" id="cloudflare-pages-inventory">

Every production and stage Cloudflare Pages project and domain **MUST** equal the value in the `Cloudflare Pages` table.

</rule>

<rule category="hosted-deployments" id="cloudflare-environment-inventory">

Every Cloudflare Pages environment-variable name, deployment target, environment, value reference, and type **MUST** equal the value in the `Pages Secret` table. A value that cannot be read because Cloudflare returns it only as `secret_text` **MUST** remain a secret reference or `TBD` and **MUST NOT** be inferred.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-deployments">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against current application configuration, reachable deployment endpoints, and authenticated Cloudflare Pages configuration when available. The **Agent** has approval to inspect those sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** state the failed requirement and current evidence. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Local ports

| Application Name | Local development port | Local preview port |
| ---------------- | ---------------------- | ------------------ |
| gPrototype2      | 5176                   | 4176               |
| gPrototype3      | 5177                   | 4177               |
| gPrototype4      | 5178                   | 4178               |
| gBackstage       | 5179                   | 4179               |

## Cloudflare Pages

| Application Name | Environment | Pages Project       | Primary Domain                                             | Secondary Domain                                             |
| ---------------- | ----------- | ------------------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| gBackstage       | Production  | `grimten-com`       | [grimten.com](https://grimten.com)                         | [backstage-3oh.pages.dev](https://backstage-3oh.pages.dev)   |
| gBackstage       | Stage       | `stage-grimten-com` | [stage.grimten.com](https://stage.grimten.com)             | [backstagestage.pages.dev](https://backstagestage.pages.dev) |
| gPrototype2      | Production  | `proto2`            | [proto2.grimten.com](https://proto2.grimten.com)           | [proto2-81t.pages.dev](https://proto2-81t.pages.dev)         |
| gPrototype2      | Stage       | `stageproto2`       | [stageproto2.grimten.com](https://stageproto2.grimten.com) | [stageproto2.pages.dev](https://stageproto2.pages.dev)       |
| gPrototype3      | Production  | `proto3`            | [proto3.grimten.com](https://proto3.grimten.com)           | [proto3-1kx.pages.dev](https://proto3-1kx.pages.dev)         |
| gPrototype3      | Stage       | `stageproto3`       | [stageproto3.grimten.com](https://stageproto3.grimten.com) | [stageproto3.pages.dev](https://stageproto3.pages.dev)       |
| gPrototype4      | Production  | `proto4`            | [proto4.grimten.com](https://proto4.grimten.com)           | [proto4.pages.dev](https://proto4.pages.dev)                 |
| gPrototype4      | Stage       | `stageproto4`       | [stageproto4.grimten.com](https://stageproto4.grimten.com) | [stageproto4.pages.dev](https://stageproto4.pages.dev)       |

### Pages Secret

Cloudflare returns encrypted values as `secret_text` without revealing their values. Sensitive values available to the new solution use `documentation.md: rule:[environment-variable-reference-format]`, approved non-sensitive values are shown directly, and unresolved values are marked `TBD`.

| Application Name | Deployment Target | Pages Project       | Cloudflare Environment | Variable Name                       | Value                                                                   | Type          |
| ---------------- | ----------------- | ------------------- | ---------------------- | ----------------------------------- | ----------------------------------------------------------------------- | ------------- |
| gBackstage       | Production        | `grimten-com`       | Production             | `BACKSTAGE_ADMIN_EMAIL`             | `TBD`                                                                   | `secret_text` |
| gBackstage       | Production        | `grimten-com`       | Production             | `BACKSTAGE_ADMIN_PASSWORD`          | `TBD`                                                                   | `secret_text` |
| gBackstage       | Production        | `grimten-com`       | Production             | `E2E_BASE_URL`                      | `https://grimten.com`                                                   | `secret_text` |
| gBackstage       | Production        | `grimten-com`       | Production             | `FONTAWESOME_NPM_AUTH_TOKEN`        | `gPronto.Framework:.env variable:[FONTAWESOME_NPM_AUTH_TOKEN]`          | `secret_text` |
| gBackstage       | Production        | `grimten-com`       | Production             | `GRIMTEN_PROTOTYPEID`               | `gPronto.Framework:.env variable:[GPRONTO_GBACKSTAGE_ID]`               | `secret_text` |
| gBackstage       | Production        | `grimten-com`       | Production             | `VITE_ADAPTER_INTEGRATION_EMAIL`    | `TBD`                                                                   | `secret_text` |
| gBackstage       | Production        | `grimten-com`       | Production             | `VITE_ADAPTER_INTEGRATION_PASSWORD` | `TBD`                                                                   | `secret_text` |
| gBackstage       | Production        | `grimten-com`       | Production             | `VITE_GCODEX_API_TOKEN`             | `gPronto.Framework:.env variable:[GCODEX_API_TOKEN]`                    | `secret_text` |
| gBackstage       | Production        | `grimten-com`       | Production             | `VITE_GCODEX_API_URL`               | `https://gcodex.grimten.com`                                            | `secret_text` |
| gBackstage       | Production        | `grimten-com`       | Production             | `VITE_GRIMTEN_SSO_ISSUE_ENDPOINT`   | `https://grimten.com/api/grimten-sso/issue`                             | `secret_text` |
| gBackstage       | Production        | `grimten-com`       | Production             | `VITE_GRIMTEN_SSO_SESSION_ENDPOINT` | `https://grimten.com/api/grimten-sso/session`                           | `secret_text` |
| gBackstage       | Production        | `grimten-com`       | Production             | `VITE_SUPABASE_PUBLISHABLE_KEY`     | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_PUBLISHABLEKEY]`  | `secret_text` |
| gBackstage       | Production        | `grimten-com`       | Production             | `VITE_SUPABASE_URL`                 | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_URL]`             | `secret_text` |
| gBackstage       | Production        | `grimten-com`       | Preview                | `VITE_SUPABASE_PUBLISHABLE_KEY`     | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_PUBLISHABLEKEY]`  | `plain_text`  |
| gBackstage       | Production        | `grimten-com`       | Preview                | `VITE_SUPABASE_URL`                 | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_URL]`             | `plain_text`  |
| gBackstage       | Stage             | `stage-grimten-com` | Production             | `BACKSTAGE_ADMIN_EMAIL`             | `TBD`                                                                   | `secret_text` |
| gBackstage       | Stage             | `stage-grimten-com` | Production             | `BACKSTAGE_ADMIN_PASSWORD`          | `TBD`                                                                   | `secret_text` |
| gBackstage       | Stage             | `stage-grimten-com` | Production             | `E2E_BASE_URL`                      | `https://grimten.com`                                                   | `secret_text` |
| gBackstage       | Stage             | `stage-grimten-com` | Production             | `FONTAWESOME_NPM_AUTH_TOKEN`        | `gPronto.Framework:.env variable:[FONTAWESOME_NPM_AUTH_TOKEN]`          | `secret_text` |
| gBackstage       | Stage             | `stage-grimten-com` | Production             | `GRIMTEN_PROTOTYPEID`               | `gPronto.Framework:.env variable:[GPRONTO_GBACKSTAGE_ID]`               | `secret_text` |
| gBackstage       | Stage             | `stage-grimten-com` | Production             | `VITE_ADAPTER_INTEGRATION_EMAIL`    | `TBD`                                                                   | `secret_text` |
| gBackstage       | Stage             | `stage-grimten-com` | Production             | `VITE_ADAPTER_INTEGRATION_PASSWORD` | `TBD`                                                                   | `secret_text` |
| gBackstage       | Stage             | `stage-grimten-com` | Production             | `VITE_GCODEX_API_TOKEN`             | `gPronto.Framework:.env variable:[GCODEX_API_TOKEN]`                    | `secret_text` |
| gBackstage       | Stage             | `stage-grimten-com` | Production             | `VITE_GCODEX_API_URL`               | `https://gcodex.grimten.com`                                            | `secret_text` |
| gBackstage       | Stage             | `stage-grimten-com` | Production             | `VITE_GRIMTEN_SSO_ISSUE_ENDPOINT`   | `https://grimten.com/api/grimten-sso/issue`                             | `secret_text` |
| gBackstage       | Stage             | `stage-grimten-com` | Production             | `VITE_GRIMTEN_SSO_SESSION_ENDPOINT` | `https://grimten.com/api/grimten-sso/session`                           | `secret_text` |
| gBackstage       | Stage             | `stage-grimten-com` | Production             | `VITE_SUPABASE_PUBLISHABLE_KEY`     | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_PUBLISHABLEKEY]`  | `secret_text` |
| gBackstage       | Stage             | `stage-grimten-com` | Production             | `VITE_SUPABASE_URL`                 | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_URL]`             | `secret_text` |
| gBackstage       | Stage             | `stage-grimten-com` | Preview                | `GH_TOKEN`                          | `TBD`                                                                   | `plain_text`  |
| gBackstage       | Stage             | `stage-grimten-com` | Preview                | `VITE_SUPABASE_PUBLISHABLE_KEY`     | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_PUBLISHABLEKEY]`  | `plain_text`  |
| gBackstage       | Stage             | `stage-grimten-com` | Preview                | `VITE_SUPABASE_URL`                 | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_URL]`             | `plain_text`  |
| gPrototype2      | Production        | `proto2`            | Production             | `FONTAWESOME_NPM_AUTH_TOKEN`        | `gPronto.Framework:.env variable:[FONTAWESOME_NPM_AUTH_TOKEN]`          | `plain_text`  |
| gPrototype2      | Production        | `proto2`            | Production             | `VITE_SUPABASE_PUBLISHABLE_KEY`     | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE2_PUBLISHABLEKEY]` | `plain_text`  |
| gPrototype2      | Production        | `proto2`            | Production             | `VITE_SUPABASE_URL`                 | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE2_URL]`            | `plain_text`  |
| gPrototype2      | Stage             | `stageproto2`       | Production             | `FONTAWESOME_NPM_AUTH_TOKEN`        | `gPronto.Framework:.env variable:[FONTAWESOME_NPM_AUTH_TOKEN]`          | `secret_text` |
| gPrototype2      | Stage             | `stageproto2`       | Production             | `GRIMTEN_PROTOTYPEID`               | `gPronto.Framework:.env variable:[GPRONTO_GPROTOTYPE2_ID]`              | `secret_text` |
| gPrototype2      | Stage             | `stageproto2`       | Production             | `VITE_ADAPTER_INTEGRATION_EMAIL`    | `TBD`                                                                   | `secret_text` |
| gPrototype2      | Stage             | `stageproto2`       | Production             | `VITE_ADAPTER_INTEGRATION_PASSWORD` | `TBD`                                                                   | `secret_text` |
| gPrototype2      | Stage             | `stageproto2`       | Production             | `VITE_GCODEX_API_TOKEN`             | `gPronto.Framework:.env variable:[GCODEX_API_TOKEN]`                    | `secret_text` |
| gPrototype2      | Stage             | `stageproto2`       | Production             | `VITE_GCODEX_API_URL`               | `https://gcodex.grimten.com`                                            | `secret_text` |
| gPrototype2      | Stage             | `stageproto2`       | Production             | `VITE_SUPABASE_PUBLISHABLE_KEY`     | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE2_PUBLISHABLEKEY]` | `secret_text` |
| gPrototype2      | Stage             | `stageproto2`       | Production             | `VITE_SUPABASE_URL`                 | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE2_URL]`            | `secret_text` |
| gPrototype3      | Production        | `proto3`            | Production             | `FONTAWESOME_NPM_AUTH_TOKEN`        | `gPronto.Framework:.env variable:[FONTAWESOME_NPM_AUTH_TOKEN]`          | `plain_text`  |
| gPrototype3      | Production        | `proto3`            | Production             | `VITE_SUPABASE_PUBLISHABLE_KEY`     | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE3_PUBLISHABLEKEY]` | `plain_text`  |
| gPrototype3      | Production        | `proto3`            | Production             | `VITE_SUPABASE_URL`                 | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE3_URL]`            | `plain_text`  |
| gPrototype3      | Stage             | `stageproto3`       | Production             | `FONTAWESOME_NPM_AUTH_TOKEN`        | `gPronto.Framework:.env variable:[FONTAWESOME_NPM_AUTH_TOKEN]`          | `secret_text` |
| gPrototype3      | Stage             | `stageproto3`       | Production             | `GRIMTEN_PROTOTYPEID`               | `gPronto.Framework:.env variable:[GPRONTO_GPROTOTYPE3_ID]`              | `secret_text` |
| gPrototype3      | Stage             | `stageproto3`       | Production             | `VITE_ADAPTER_INTEGRATION_EMAIL`    | `TBD`                                                                   | `secret_text` |
| gPrototype3      | Stage             | `stageproto3`       | Production             | `VITE_ADAPTER_INTEGRATION_PASSWORD` | `TBD`                                                                   | `secret_text` |
| gPrototype3      | Stage             | `stageproto3`       | Production             | `VITE_GCODEX_API_TOKEN`             | `gPronto.Framework:.env variable:[GCODEX_API_TOKEN]`                    | `secret_text` |
| gPrototype3      | Stage             | `stageproto3`       | Production             | `VITE_GCODEX_API_URL`               | `https://gcodex.grimten.com`                                            | `secret_text` |
| gPrototype3      | Stage             | `stageproto3`       | Production             | `VITE_SUPABASE_PUBLISHABLE_KEY`     | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE3_PUBLISHABLEKEY]` | `secret_text` |
| gPrototype3      | Stage             | `stageproto3`       | Production             | `VITE_SUPABASE_URL`                 | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE3_URL]`            | `secret_text` |
| gPrototype4      | Production        | `proto4`            | Production             | `FONTAWESOME_NPM_AUTH_TOKEN`        | `gPronto.Framework:.env variable:[FONTAWESOME_NPM_AUTH_TOKEN]`          | `plain_text`  |
| gPrototype4      | Production        | `proto4`            | Production             | `VITE_SUPABASE_PUBLISHABLE_KEY`     | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE4_PUBLISHABLEKEY]` | `plain_text`  |
| gPrototype4      | Production        | `proto4`            | Production             | `VITE_SUPABASE_URL`                 | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE4_URL]`            | `plain_text`  |
| gPrototype4      | Stage             | `stageproto4`       | Production             | `FONTAWESOME_NPM_AUTH_TOKEN`        | `gPronto.Framework:.env variable:[FONTAWESOME_NPM_AUTH_TOKEN]`          | `secret_text` |
| gPrototype4      | Stage             | `stageproto4`       | Production             | `GRIMTEN_PROTOTYPEID`               | `gPronto.Framework:.env variable:[GPRONTO_GPROTOTYPE4_ID]`              | `secret_text` |
| gPrototype4      | Stage             | `stageproto4`       | Production             | `VITE_ADAPTER_INTEGRATION_EMAIL`    | `TBD`                                                                   | `secret_text` |
| gPrototype4      | Stage             | `stageproto4`       | Production             | `VITE_ADAPTER_INTEGRATION_PASSWORD` | `TBD`                                                                   | `secret_text` |
| gPrototype4      | Stage             | `stageproto4`       | Production             | `VITE_GCODEX_API_TOKEN`             | `gPronto.Framework:.env variable:[GCODEX_API_TOKEN]`                    | `secret_text` |
| gPrototype4      | Stage             | `stageproto4`       | Production             | `VITE_GCODEX_API_URL`               | `https://gcodex.grimten.com`                                            | `secret_text` |
| gPrototype4      | Stage             | `stageproto4`       | Production             | `VITE_SUPABASE_PUBLISHABLE_KEY`     | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE4_PUBLISHABLEKEY]` | `secret_text` |
| gPrototype4      | Stage             | `stageproto4`       | Production             | `VITE_SUPABASE_URL`                 | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE4_URL]`            | `secret_text` |

